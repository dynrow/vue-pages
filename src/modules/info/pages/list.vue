<template>
    <div class="info-list">
        <mt-swipe :auto="2000" class="slide" v-if="info4RtxPicList.length">
            <mt-swipe-item v-for="(pic,index) in info4RtxPicList" :key="pic.id" v-if="index<5">
                <router-link
                        class="link"
                        :to="{ path: 'detail', query: {
                            id: pic.id,
                            nodeId: pic.curNodeId_?pic.curNodeId_:'',
                            instanceId: pic.instanceId_?pic.instanceId_:'',
                            definitionId:pic.definitionId_?pic.definitionId_:'',
                            businessKey: pic.business_Key_?pic.business_Key_:'' ,
                        }}">
                    <img :src="pic.picUrl" :alt="pic.title" class="stick">
                </router-link>
            </mt-swipe-item>
        </mt-swipe>
        <div class="nav-list">
            <mt-navbar v-model="selected">
                <mt-tab-item v-for="li in column4RtxList" :key="li.id" :id="li.id">{{li.name}}
                </mt-tab-item>
            </mt-navbar>
        </div>
        <div class="info-wrapper" ref="wrapper">
            <Loadmore
                :on-infinite="onInfinite"
                :options="loadmoreOpt"
                :init-scroll="initScroll"
                :style="{ height: wrapperHeight + 'px'}"
            >
                <!-- 这一层div如果有ul可以省略,没有则必须添加
                    需要有宽度和高度,否则在数据少的情况下ios会有空白现象 -->
                <div style="width:100%;">
                    <router-link class="mint-cell" v-for="info in info4RtxList"
                        :key="info.id"
                        :to="{ path: 'detail', query: {
                            id: info.id,
                            nodeId: info.curNodeId_?info.curNodeId_:'',
                            instanceId: info.instanceId_?info.instanceId_:'',
                            definitionId:info.definitionId_?info.definitionId_:'',
                            businessKey: info.business_Key_?info.business_Key_:'' ,
                            }}">
                        <div class="mint-cell-wrapper">
                            <div class="mint-cell-title">
                                <span class="mint-cell-text">{{info.title}}</span>
                                <span class="mint-cell-label">{{parseTimeDate(info.createDate)}}</span>
                            </div>
                        </div>
                    </router-link>
                </div>

            </Loadmore>
            <router-link :to="'todo'">
                <mt-palette-button
                    class="pb"
                    mainButtonStyle="color:#fff;background-color:#26a2ff;font-size:12px;"
                    style="right:30px;z-index:999 ">待办
                    <div class="info-badge" v-if="todoSize > 0">
                        <mt-badge size="small" color="#fc5461"></mt-badge>
                    </div>
                    <div class="my-icon-button">{{todoSize}}</div>
                </mt-palette-button>
            </router-link>
        </div>
    </div>
</template>

<script>
    import {Indicator, Toast} from 'mint-ui';
    import Util from '@/libs/util.js';
    import Loadmore from '@/components/loadmore';
    //加载更多文档地址
    //http://www.mescroll.com/api.html
    export default {
        components: {
            Loadmore
        },
        data() {
            return {
                //当前选中的栏目
                selected: '',
                //带有图片的信息
                info4RtxPicList: [],
                // 信息栏目列表
                column4RtxList: [],
                //默认第一个栏目下的信息
                info4RtxList: [],
                //加载数据的loading
                loading: false,
                //待办数量
                todoSize: 0,
                //控制容器的高度
                wrapperHeight: 200,
                /**
                 * 存放所有栏目的页面数据
                 * columns对象的key对应的是栏目的id, value是当前栏目的pageNum
                 */
                columns: {},
                //
                loadmoreOpt: {
                    up: {
                        toTop: {
                            src : false//不显示返回顶部按钮
                        },
                        page: {
                            size: 10
                        }
                    }
                }
            }
        },
        methods: {
            initScroll(mescroll){
                this.mescroll = mescroll;
            },
            onInfinite() {
                this.columns[this.selected]++;
                this.getList();
            },
            parseData(dataList) {
                let _this = this;
                _this.info4RtxPicList = dataList.info4RtxPicList;
                _this.info4RtxList = dataList.info4RtxList;
                _this.column4RtxList = dataList.column4RtxList.map((column) => {
                    _this.columns[column.id] = 0;
                    return column;
                });
                //将第一个栏目设置为选中
                _this.selected = _this.column4RtxList[0].id;
            },
            parseTimeDate(stamp) {
                return Util.format(new Date(stamp), 'yyyy-MM-dd');
            },
            getList() {
                let _this = this;
                //如果是切换tab过来的请求,分页信息重置
                if (_this.isTab) {
                    _this.columns[_this.selected] = 0;
                }
                //加载loading
                _this.showLoading();
                //获取数据
                _this.Api.INFO.getInfoList({
                    columnId: _this.selected,
                    pageNum: _this.columns[_this.selected]
                }).then(res => {
                    if (res.data.code === '000000') {
                        if (res.data.body.length) {
                            _this.info4RtxList = _this.isTab ? res.data.body : _this.info4RtxList.concat(res.data.body);
                        }
                        //如果没有数据列表清空
                        if(_this.columns[_this.selected] == 0 && !res.data.body.length){
                            _this.info4RtxList = [];
                        }
                        //需要把关闭加载进度的方法放到这里, 保证无论是否有数据都会调用
                        _this.mescroll.endSuccess(res.data.body.length);
                    } else {
                        Toast(res.data.errormsg);
                    }
                    _this.$nextTick(() => {
                        _this.hideLoading();
                    });
                    _this.isTab = false;
                }).catch(error => {
                    _this.hideLoading();
                })
            },
            getTodoSize() {
                var _this = this;
                //请求列表数据
                _this.Api.INFO.getTodoSize().then((res) => {
                    if (res.data.code === '000000') {
                        _this.todoSize = parseInt(res.data.body);
                    } else {
                        Toast(res.data.errormsg);
                    }
                }).catch((error) => {});
            },
            showLoading() {
                Indicator.open();
            },
            hideLoading() {
                Indicator.close();
            }
        },
        activated(){
            this.getTodoSize();
        },
        mounted() {
            var _this = this;
            _this.showLoading();

            _this.isTab = false;
            //请求列表数据
            _this.Api.INFO.getInfoAll().then(function (res) {
                if (res.data.code === '000000') {
                    _this.parseData(res.data.body);
                } else {
                    Toast({
                        message: res.data.errormsg,
                        position: 'bottom',
                        duration: 5000
                    });
                }
                _this.$nextTick(() => {
                    _this.wrapperHeight = document.documentElement.clientHeight - _this.$refs.wrapper.getBoundingClientRect().top
                    _this.hideLoading();
                });
            }).catch(function (error) {
                _this.hideLoading();
            });

            _this.getTodoSize();
        },
        watch: {
            selected: function () {
                this.isTab = true;
                this.mescroll.resetUpScroll();
            }
        }
    }
</script>

<style >

</style>
