//获取访问接口对象
/**
 * 所有接口统一通过此文件调用, 开发环境可以使用jcfe模拟后台服务器接口
 * 运行环境使用使用jcmp来访问接口
 *
 */
//http请求配置对象
var HTTP = require('./jcmp.api.js').HTTP;

//http://172.16.3.71:8080/gitbucket/gezg/jc-mobile-interface
/**
 * 暴露给外部的公共接口方法,  对于页面使用者,
 * 应该是不用关心当前的请求是从jcmp调来的数据,还是前端Mock模拟的数据
 */
export default {
    DOC: {
        //获取流程列表
        getFlows() {
            return HTTP.get('/getFlows');
        },
        //获取待办公文所有数据
        getToDosList() {
            return HTTP.get('/getToDosList');
        },
        //获取收文列表
        getReceiveFlows(pageNum) {
            return HTTP.get('/getReceiveFlows?pageNum=' + pageNum);
        },
        //获取发文列表
        getSendFlows(pageNum) {
            return HTTP.get('/getSendFlows?pageNum=' + pageNum);
        },
        //获取收文详情
        getReceiveDetail(opt) {
            let url = '/getReceiveDetail?id=' + opt.id;
            if (opt.definitionId) {
                url = url + '&definitionId=' + opt.definitionId + '&nodeId=' + opt.nodeId + '&instanceId=' + opt.instanceId + '&businessKey=' + opt.businessKey;
            }
            return HTTP.get(url);
        },
        //获取发文详情
        getSendDetail(opt) {
            let url = '/getSendDetail?id=' + opt.id;
            if (opt.definitionId) {
                url = url + '&definitionId=' + opt.definitionId + '&nodeId=' + opt.nodeId + '&instanceId=' + opt.instanceId + '&businessKey=' + opt.businessKey;
            }
            return HTTP.get(url);
        },
        //获取提交节点及接收人
        getNextNodes(opt) {
            let url = '/getNextNodes4Doc';
            if (opt.definitionId) {
                url = url + '?definitionId_=' + opt.definitionId + '&curNodeId_=' + opt.curNodeId;
            }
            return HTTP.get(url);
        },
        //收文审批提交接口
        saveReceiveApproval(opt) {
            return HTTP.post('/saveReceiveApproval', opt);
        },
        //发文审批提交接口
        saveSendApproval(opt) {
            return HTTP.post('/saveSendApproval', opt);
        }
    },
    ATTENCE: {
        /**
         * 获取所有初始化需要的参数
         *
         * @returns
         */
        initAttence() {
            return HTTP.get('/initAttence');
        },
        /**
         * 打卡方法
         *  lat:''//维度
         lng:''//经度
         position:''//打卡位置详细描述
         companyName:''//打卡简要地址描述（公司名称）
         message:''//情况说明
         *
         * @param {any} params
         * @returns
         */
        attenceIn(params) {
            return HTTP.post('/attenceIn', params);
        },
        /**
         * 获取当前月的所有打卡信息
         *
         * @returns
         */
        attenceHitory(option) {
            return HTTP.get('/attenceHitory?year=' + option.year + '&month=' + option.month);
        },
        /**
         * 添加情况说明
         * @param {*} option 
         */
        addMessage(option) {
            return HTTP.post('/addMessage?date=' + option.date + '&message=' + option.message);
        },
    },
    INFO: {
        //获取信息页面所有数据
        getInfoAll() {
            return HTTP.get('/getInfoAll');
        },
        /**
         * 根据栏目id 和分页信息获取列表数据
         *
         * @param {any} option
         * columnId  栏目id
         * pageNum   页码
         */
        getInfoList(option) {
            return HTTP.get('/getInfoList?columnId=' + option.columnId + '&pageNum=' + option.pageNum);
        },
        /**
         * 获取待办数量
         */
        getTodoSize() {
            return HTTP.get('/getTodoSize');
        },
        /**
         * 根据id获取某一条数据详细信息
         *
         * @param {Object} {
         *    id : '数据的ID'
         *  nodeId:'',//节点id，这个值在加载列表时已经得到，该值只在待办页面加载信息详细页面时传，其他页面不需要传
         *   definitionId:''//流程id，这个值在加载列表时已经得到，该值只在待办页面加载信息详细页面时传，其他页面不需要传
         * }
         */
        getInfoById(opt) {
            let url = '/getInfoDetail?id='+ opt.id;
            if (opt.definitionId) {
                url = url + '&definitionId=' + opt.definitionId + '&nodeId=' + opt.nodeId + '&instanceId=' + opt.instanceId + '&businessKey=' + opt.businessKey;
            }
            return HTTP.get(url);
        },
        /**
         * 获取待办列表
         */
        getTodoList(num) {
            return HTTP.get('/getTodoList?pageNum=' + num);
        },
        /**
         * 信息审批提交接口
         *
         * @param {any} params
         * @returns
         */
        commitApproval(params) {
            return HTTP.post('/commitApproval', params);
        },
        /**
         * 获取提交节点及接收人
         *
         * @param  {Object}{
         * 	userId: '',//当前登录人id
		 *  definitionId_: '',获取待办列表时获取的相应属性值
		 *  curNodeId_: 获取待办列表时获取的相应属性值
         * }
         * @returns
         */
        getNextNodes(params) {
            let url = '/getNextNodes';
            if (params.definitionId_) {
                url = url + '?definitionId_=' + params.definitionId_ + '&curNodeId_=' + params.curNodeId_;
            }
            return HTTP.get(url);
        }
    },
    CONTACTS: {//人员选择树接口
        //根据部门id获取当前的下级部门及用户
        getDeptData(deptId) {
            return HTTP.get('/getUserAndSubChildDeptByDeptId.action?id=' + deptId);
        },
        //根据部门id获取下级所有用户
        getUsers(deptId) {
            return HTTP.get('/getAllUserByDeptId.action?id=' + deptId);
        },
        //获取所有部门信息
        getAllDept() {
            return HTTP.get('/getAllDepartment.action');
        },
        //根据关键字查询用户
        getUsersByName(keyword) {
            return HTTP.get('/getUsersByName.action?keyword=' + keyword);
        },
        //转换图片路径
        convertUrl(resourceUrl) {
            return HTTP.defaults.baseURL + "/resource?uri=" + window.btoa(resourceUrl);
        }
    },
    WORK: {
        //获取指定月份有日程的日期列表
        queryDiary(params) {
            let url = '/queryDiary';
            if (params.year && params.month) {
                url += '?year=' + params.year + '&month=' + params.month;
            }
            return HTTP.get(url);
        },
        //新增、修改日程
        saveDiary(params) {
            return HTTP.post('/saveDiary', params);
        },
        //删除日程
        deleteDiary(id) {
            return HTTP.get('/deleteDiary?id=' + id);
        }
    },
    /**
     * 所有接口完成回调
     * @example
     * api.getAll(api.getMap(),testSave({formJson: ''}))
     * .then((res)=>{
     *    res[0]		getMap的响应信息
     *    res[1]		testSave的响应信息
     * })
     *
     */
    getAll(...params) {
        return HTTP.all(params);
    },
    ARCHIVE: {//获取文档管理信息
        //获取文档列表信息
        getDocList(params) {
            return HTTP.get('/myArchive?folderId=' + params.folderId);
        },
        getPublicList(params) {
            return HTTP.get('/publicArchive?folderId=' + params.folderId);
        },
        getCollectionList(){
            return HTTP.get('/getCollectionList');
        },
    },
    MAIL: {
        /**
         * 获取邮箱首页内容
         */
        getMailAll(opt) {
            return HTTP.get('/' + opt.url + '?pageNum=' + opt.pageNum);
        },
        /**
         * 上传附件接口
         */
        getSaveAttach(opt) {
            return HTTP.get('/saveAttach');
        },
        /**
         * 邮件管理获取邮件详情
         */
        getMailById(opt) {
            return HTTP.get('/getMailById?id=' + opt.id);
        },
        //转换图片路径
        attachUrl(opt) {
            return HTTP.defaults.baseURL + "/resource?uri=" + window.btoa(opt);
        },
        //发送邮件
        sendMail(opt) {
            return HTTP.post('/sendMail', opt);
        },
        //设置星标邮件
        addStarRtx(opt) {
            return HTTP.post('/addStarMail?mailId=' + opt);
        },
        //取消星标邮件
        delStarRtx(opt) {
            return HTTP.post('/delStarMail?mailId=' + opt);
        },
        //删除邮件
        delMailRtx(opt, mailFolderId) {
            return HTTP.post('/delMailRtx?id=' + opt.id + '&mailFolderId=' + mailFolderId);
        },
        //保存草稿箱
        saveDraft(opt) {
            return HTTP.post('/saveDraft', opt);
        }
    }
};
