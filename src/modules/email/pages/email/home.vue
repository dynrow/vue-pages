<template>
    <div class="mail-list">
        <mt-navbar v-model="selected">
            <mt-tab-item id="1">未读<mt-badge size="small" color="#fc5461" v-if="unread"></mt-badge></mt-tab-item>
            <mt-tab-item id="2">收件箱</mt-tab-item>
            <mt-tab-item id="3"><i class="jcm-star"></i>邮件</mt-tab-item>
            <mt-tab-item id="4">草稿箱</mt-tab-item>
            <mt-tab-item id="5">已发送</mt-tab-item>
        </mt-navbar>
        <mt-search v-model="search" placeholder="搜索"></mt-search>
        <div ref="wrapper" class="page-infinite">
            <Loadmore
                :on-infinite="onInfinite"
                :options="loadmoreOpt"
                :init-scroll="initScroll"
                :style="{ height: wrapperHeight + 'px'}">
                <div class="mail-item">
                    <router-link v-for="info in getMailAll" :key="info.id" class="mint-cell"
                        :to="{ path: selected == '4' ? 'compose' : 'detail', query: { 
                            id: info.id, 
                            selected : selected
                        }}">
                    	<i class="mpoint" v-if="info.isRead==null || info.isRead=='0'"></i>
                        <div class="mint-cell-wrapper">
                        	<i class="jcm-tanhao orange" v-if="info.starMail==null || info.starMail=='1'"></i>
                            <div class="mint-cell-title">
                                <span v-html="info.mailTitle"></span>
                            </div> 
                            <div class="mint-cell-value">
                                <span class="mr20">发件人：{{info.senderUserName}}</span>
                                <span class="mr10">{{info.senderTime.slice(0, -3)}}</span>
                                <i class="jcm-fujian gray" v-if="info.attachUrl!=null"></i>
                                <i class="jcm-star yellow" v-if="info.starMail==null || info.starMail=='1'"></i>
                            </div>
                        </div>
                    </router-link>
               </div>
            </Loadmore>
        </div>
    </div>
</template>
<script>
    import {Indicator, Toast} from 'mint-ui';
    import { Search } from 'mint-ui';
    import Util from '@/libs/util.js';
    import Loadmore from '@/components/loadmore';
    const URL_LIST = {
        '1': 'unReadMail',
        '2': 'receiveMail',
        '3': 'starMail',
        '4': 'draftMail',
        '5': 'sendMailManage'
    }
    export default {
        components: {
            Loadmore
        },
        data() {
            return {
                //菜单类
                searchState: true,
                //当前选中的栏目
                selected: '2',
                //默认第一个栏目下的信息
                getMailAll: [],
                //加载数据的loading
                loading: false,
                search: "",
                emailData :{},
                //待办数量
                unread: false,
                //控制容器的高度
                wrapperHeight: 200,
                /**
                 * 存放所有栏目的页面数据
                 * columns对象的key对应的是栏目的id, value是当前栏目的pageNum
                 */
                columns: {},
                //上拉刷新配置
                loadmoreOpt: {
                    up: {
                        toTop: {
                            src : false//不显示返回顶部按钮
                        },
                        page: {
                            size: 10
                        },
                        noMoreSize: 8
                    }
                }
            }
        },
        methods: {
            initScroll(mescroll){//更多加载初始化
                this.mescroll = mescroll;
            },
            onInfinite() {//加载更多操作
                this.columns[this.selected]++;
                this.getList();
            },
            getList(isTab) {//邮件列表查询数据
                let _this = this;
                _this.showLoading();
                //如果是切换tab过来的请求,分页信息重置
                if (isTab) {
                    _this.getMailAll= [];
                    _this.columns[_this.selected] = 0;
                    _this.$route.query.selected = _this.selected;
                }
                //请求列表数据
                _this.Api.MAIL.getMailAll({
                    url: URL_LIST[_this.selected],
                    pageNum : _this.columns[_this.selected]
                }).then(function (res) {
                    if (res.data.code === '000000') {
                        if (res.data.body.length) {
                            _this.getMailAll = _this.oldData = isTab ? res.data.body : _this.getMailAll.concat(res.data.body);
                        }
                        //需要把关闭加载进度的方法放到这里, 保证无论是否有数据都会调用
                        _this.mescroll.endSuccess(res.data.body.length, null ,_this.columns[_this.selected] + 1);
                        //
                        if(_this.columns[_this.selected] == 0 && res.data.body.length == 0){
                        	_this.mescroll.showEmpty();	
                        }
                    } else {
                        Toast(res.data.errormsg);
                        _this.mescroll.endSuccess();
                    }
                    _this.$nextTick(() => {
                        _this.hideLoading(); 
                    });
                }).catch(error => {
                    _this.hideLoading();
                });
                //当前选中就是未读邮件不需要再一次查询
                if(_this.selected != 1){
                    _this.getunread();
                }
            },
            getunread(){//是否有未读邮件
                let _this = this;
                _this.Api.MAIL.getMailAll({
                    url: URL_LIST[1],
                    pageNum : 0
                }).then(function (res) {
                    if (res.data.code === '000000') {
                    	_this.unread = res.data.body.length==0 ? false : true;
                    }
                });
            },
            showLoading() {//显示加载进度
                Indicator.open();
            },
            hideLoading() {//隐藏加载进度
                Indicator.close();
            }
        },
        mounted() {//页面加载
            let selectIndex = window.sessionStorage.getItem('selectIndex');
            if(selectIndex){
                this.selected = selectIndex;
            }
            //内容盒子高度
            this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top - 50;
            this.columns[this.selected] = 0;
            this.getList();
            this.oldData = [];
        },
        watch: {
            selected: function (val) {//tab切换
                window.sessionStorage.setItem('selectIndex', val)
                this.getList(true);
            },
            search: function(val){//查询
                if(val){
                    this.getMailAll = this.oldData.filter((item)=>{
                        return item.mailTitle.indexOf(val) > -1 || item.senderUserName.indexOf(val) != -1;
                    })
                }else{
                    this.getMailAll = this.oldData;
                }
            }
        }
    }
</script>
 
<style>
</style>