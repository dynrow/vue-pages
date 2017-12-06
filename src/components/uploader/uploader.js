
import WebUploader from '@/libs/vendor/webuploader/webuploader.html5only.js';
import { Toast } from 'mint-ui';

import store from '@/store';

/**
 * 移动端上传组件封装
 * @authors gezg
 * @date    2017-05-18 13:43:12
 * @version $Id$
 */
class Uploader {
    constructor(options) {
        this.$el = (() => {
            if (options && options.el) {
                return $(options.el);
            } else {
                throw new Error('el 参数错误!!!');
            }
        })();
        this.uuid = this.guid();
        //所有文件的进度信息，key为file id
        this.percentages = {};
        this.files = [];        //存放已上传的附件
        this.delFiles = [];     //存放所有已删除的附件
        let ratio = window.devicePixelRatio || 1;
        //Object.assign 在Android下报错
        this.option = $.extend({
            state: 'pedding',   //可能有pedding, ready, uploading, confirm, done.
            fileSize: 0,        //添加的文件总大小 
            fileCount: 0,       //添加的文件数量
            fileNumLimit: 30,   //文件上传个数
            fileSizeLimit: 200 * 1024 * 1024, //限制一组文件大小
            fileSingleSizeLimit: 50 * 1024 * 1024, //限制单个文件大小
            ratio: ratio,       //优化retina, 在retina下这个值是2
            thumbnailWidth: 110 * ratio, // 缩略图大小
            thumbnailHeight: 110 * ratio,
            server: 'http://192.168.140.14:9380/jcmp/gateway/api/v1/uploadAttach',
            timeout: 2 * 60 * 1000, //超时时间默认2分钟
            accept: undefined,      //文件规则
            label: '选择文件',      //按钮名称    
            headers: {},            //自定义请求头部
            formData: {},           //请求参数
            style: null,            //按钮容器上添加的class

            //回调函数
            delCallback: null,
            success: null,
            finished: null,
            ready: null,
            targetHandler: null,    //上传成功后绘制方法
            btnTemplate: null,      //按钮自定义模版
        }, options);

        //自定义按钮模版情况下不需要
        if (this.option.btnTemplate) {
            this.option.label = '';
        }

        this.init();
    }

    init() {
        if (WebUploader.Uploader.support()) {
            this.$el.html(this.containerTemplate())
            this.create();
        } else {
            throw new Error('您的浏览器不支持上传插件');
        }
    }

    create() {
        let _this = this,
            option = _this.option;

        _this.uploader = WebUploader.create({
            //指定选择文件的按钮容器，不指定则不创建按钮。
            pick: {
                id: '#filePicker' + _this.uuid,
                label: option.label,
                /**
                 * 为实现效果统一 设置为true的话在
                 * ios下可以多选
                 * andriod下还是多选不了
                 */
                multiple: false
            },
            //上传给后台的参数
            formData: option.formData,
            timeout: option.timeout,
            headers: option.headers,
            style: option.style,

            chunked: false, //是否要分片处理大文件上传。
            chunkSize: 512 * 1024, //如果要分片，分多大一片？ 默认大小为5M.
            server: option.server,
            accept: option.accept,
            //是否已二进制的流的方式发送文件
            //上传本机拍摄的照片,上传成功后服务器上的这张图片显示损坏
            //sendAsBinary: true, //注释掉,添加后后台接收contentType参数不正确
            // 禁掉全局的拖拽功能。这样不会出现图片拖进页面的时候，把图片打开。
            disableGlobalDnd: true,
            fileNumLimit: option.fileNumLimit,
            fileSizeLimit: option.fileSizeLimit, // 200 M
            fileSingleSizeLimit: option.fileSingleSizeLimit // 50 M
        });

        _this.addBindEvent();
    }

    addBindEvent() {
        let _this = this,
            option = _this.option,
            mapping = {};
        /**
         * 监听附件加入队列,返回false则加入队列失败
         */
        _this.uploader.on('beforeFileQueued', (file) => {
            //判断是否超出限制上传的数量
            if (option.fileCount == option.fileNumLimit) {
                _this.uploader.trigger('error', 'Q_EXCEED_NUM_LIMIT', file);
                return false;
            }

            /**
             * 监听加入队列文件
             */
        }).on('fileQueued', (file) => {

            store.commit('updateLoadingStatus', {isLoading: true})

            option.fileCount++;
            option.fileSize += file.size;

            _this.setState('ready');

            /**
             *监听全部添加完成事件
                */
        }).on('filesQueued', (file) => {
            //一组文件成功加入队列, 开始调用上传方法'
            //当一批文件加载后,直接调用上传方法
            _this.uploader.upload();
            /**
             * 监听文件上传成功
             */
        }).on('uploadSuccess', (file, response) => {
            if (response.code === '000000') {
                _this.addFile(response.body);
                if ($.isFunction(option.success)) {
                    option.success.call(_this, response.body, file);
                }
            } else {
                Toast({
                    message: response.errormsg,
                    position: 'bottom',
                    duration: 2000
                });
            }
            /**
             * 监听全部上传完成,不等于全部成功
             */
        }).on('uploadFinished', () => {
            store.commit('updateLoadingStatus', {isLoading: false})
            if ($.isFunction(option.finished)) {
                option.finished.call(null);
            }
            /**
             *监听全部事件
                */
        }).on('all', (type) => {
            switch (type) {
                case 'uploadFinished':
                    _this.setState('confirm');
                    break;

                case 'startUpload':
                    _this.setState('uploading');
                    break;

                case 'stopUpload':
                    _this.setState('paused');
                    break;
            }
            /**
             * 错误处理方法
             * @param  {[type]} code [错误代码]
             */
        }).on('error', (code) => {
            //超出最大数量
            if ('Q_EXCEED_NUM_LIMIT' === code) {
                Toast({
                    message: '超出最大数量',
                    position: 'bottom',
                    duration: 2000
                });
            //文件上传重复
            } else if ('F_DUPLICATE' === code) {
                Toast({
                    message: '文件上传重复',
                    position: 'bottom',
                    duration: 2000
                });
            }
        });
        //插件初始化完成回调
        if ($.isFunction(option.ready)) {
            option.ready.call(null);
        }
    }

    addFile(file) {
        let _this = this,
            option = _this.option;
        //获取当前文件后缀名
        let suffix = (function() {
            var str = file.fileName.substring(file.fileName.lastIndexOf('.') + 1);
            if (str.length > 4) {
                str = str.substring(0, 4);
            }
            return str;
        })();
        //添加到已上传数组
        _this.files.push(file);
        _this.percentages[file.id] = [file.size, 0];


        if ($.isFunction(option.targetHandler)) {
            option.targetHandler.call(_this, file);
        } else {
            let html = _this.getTargetTemplate(file);
            _this.$el.before(html);
        }
    }

    removeFile(file) {
        let _this = this,
            option = _this.option;
        //把已删除附件缓存到一个delFiles的变量中
        _this.files.forEach((f, i) => {
            if (f.id == file.id) {
                _this.delFiles.push(_this.files[i]);
                _this.files.splice(i, 1);
            }
        });
        //删除进度
        delete _this.percentages[file.id];
        //获取webuploader队列中的附件
        let webFile = _this.uploader.getFiles();
        //删除队列中的附件
        webFile.forEach(function(item){
            if(file && item.name == file.fileName){
                _this.uploader.removeFile(item);
            }
        });

        if ($.isFunction(option.delCallback)) {
            option.delCallback.call(_this, file);
        }
    }
    /**
     * 获取已上传附件
     * @return {[type]} [description]
     */
    getFiles() {
        return this.files.map((file) => {
            return file.id;
        });
    }
    /**
     * 获取已删除附件
     * @return {[type]} [description]
     */
    getDel() {
        return this.delFiles.map((file) => {
            return file.id;
        });
    }
    /**
     * [setState description]
     * @param {[type]} val [description]
     */
    setState(val) {
        console.log(val);
    }

    getTargetTemplate(file) {
            let _this = this,
                option = _this.option;
            return `<div style="display:inline-block;width:6rem;height: 6rem;"><img src="${file.fileUrl}" style="width:100%;height:100
    %;"/></div>`;
        }
        //模版
    containerTemplate() {
        let _this = this,
            option = _this.option;

        let temp = ['<div class="uploader-container">'];
        temp.push('<div id="filePicker' + _this.uuid + '">');
        if (option.btnTemplate) {
            temp.push(option.btnTemplate());
        }
        temp.push('</div>');
        return temp.join('');
    }
    //不重复标识
    guid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        }).toUpperCase();
    }
}

export default Uploader;