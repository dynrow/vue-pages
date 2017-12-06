<template>
    <div class="email-home" >
        <div class="page-navbar">
            <mt-navbar v-model="selected">
                <mt-tab-item id="1">未读<i class="mpoint" v-if="mpoint"></i></mt-tab-item>
                <mt-tab-item id="2">收件箱</mt-tab-item>
                <mt-tab-item id="3">邮件<i class="jcm-biaoxing xingxing" ></i></mt-tab-item>
                <mt-tab-item id="4">草稿箱</mt-tab-item>
                <mt-tab-item id="5">已发送</mt-tab-item>
            </mt-navbar>
            <JcSearch :on-watch="submit"></JcSearch>
            <div ref="wrapper">
                <div class="emails-list" :style="{ height: wrapperHeight + 'px'}">  
                    <div class="mint-cell-wrapper" v-for="mailslist in getMailAll" >
                         <router-link :to="'details'">
                            <div class="mint-cell-value">
                                <span style="color:#333">{{mailslist.mailTitle}}</span>
                                <label>
                                    <span>发件人：{{mailslist.senderUserName}}</span>
                                    <i>{{parseTimeDate(mailslist.senderTime)}}</i>
                                </label>
                            </div>
                        </router-link>
                    </div>    
                </div> 
            </div>   
            <div class="writebox">
                <router-link :to="'write'">
                <mt-button  type="primary"><i class="foot-icon jcm-xieyoujian"></i>写邮件</mt-button>
                </router-link>
            </div>
            
        </div>
    </div>
</template>
 
<script>
    import {
        Indicator,
        Toast
    } from 'mint-ui';
    import JcSearch from '@/components/search';
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
            JcSearch,
            Loadmore
        },
        data() {
            return {
                selected: '1',
                getMailAll: [],
                columns:[],
                wrapperHeight:"",
                val:'',
                mpoint: false,
            }
        },
        
        methods: {
            getList() {
                let _this = this;
                
                //如果是切换tab过来的请求,分页信息重置
                // if (_this.isTab) {
                //     _this.columns[_this.selected] = 0;
                // }
                //加载loading
                // _this.showLoading();
                //获取数据
                _this.Api.MAIL.getMailAll({
                    url: URL_LIST[_this.selected],
                    pageNum : _this.columns[_this.selected]
                }).then(function (res) {
                    if (res.data.code === '000000') {
                        if (res.data.body.length) {
                            _this.getMailAll = res.data.body;
                            _this.cacheData = res.data.body;
                        }
                        //需要把关闭加载进度的方法放到这里, 保证无论是否有数据都会调用
                        //_this.mescroll.endSuccess(res.data.body.length);
                    } else {
                        Toast(res.data.errormsg);
                    }
                    _this.$nextTick(() => {
                    //     _this.hideLoading();
                     });
                    // _this.isTab = false;
                }).catch(error => {
                    // _this.hideLoading();
                })
                _this.getmpoint();
            },
            getmpoint(){
                let _this = this;
                _this.Api.MAIL.getMailAll({
                    url: URL_LIST[1],
                    pageNum : 0
                }).then(function (res) {
                    if (res.data.code === '000000') {
                        if (res.data.body.length > 0) {
                            _this.mpoint = true;
                        }
                    }
                });
            },
            parseTimeDate(stamp) {
                return Util.format(new Date(stamp), 'yyyy-MM-dd');
            },
            submit(val){
                if(val){
                    this.getMailAll = this.cacheData.filter(function(item) {
                        return item.mailTitle.indexOf(val) > -1
                    })
                }else{
                    this.getMailAll = this.cacheData;
                }
            },
            
        },
        mounted(){
            this.columns[this.selected] = 0;
            this.getList();
            this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top
        },
        computed:{
        	
        },
        watch: {
            selected: function () {
                this.columns[this.selected] = 0;
                this.getList();
                // this.isTab = true;
                // this.mescroll.resetUpScroll();
            }
        }
    }
</script>
 
<style lang="scss">

    .email-home{
        height:100%;
        .page-navbar{
            .mint-navbar {
                border-bottom:1px solid #e2e2e2;
                .is-selected{
                    color: #4d8afe;
                    margin: 0;
                    border-bottom: 3px solid #4d8afe;
                    div{
                        color:#4d8afe;
                    }
                }
                .mint-tab-item-label{
                    color:#6a707e;
                    font-size:16px;
                }
                .xingxing{
                    line-height:1px;
                    color:#FFD213;
                }
                
                .mpoint{
                    position:absolute;
                    display:block;
                    width:6px;
                    height:6px;
                    border-radius:50%;
                    background:#fc5461;
                    right: 12px;
                    top: 22px;
                }
            }
            .mint-navbar:first-child a {
                    position:relative;
                }
            .emails-list{
                padding: 0 15px;
                overflow-y: scroll;
                padding-bottom:52px;
                .mint-cell-wrapper{
                    display:inherit;
                    height:68px;
                    background:none;
                    padding:15px 0;
                    align-items:stretch;
                    border-bottom: 1px solid #e2e2e2;
                }
                .mint-cell-wrapper:active{
                    background:#e6e6e6;
                }
                .mint-cell-value{
                    position:relative;
                    height:37px;
                    align-items:stretch;
                    label{
                        width:100%;
                        height:16px;
                        position:absolute;
                        bottom:0;
                        left:0;
                        font-size:14px;
                        color:#666;
                        
                        span{
                            float:left;
                        }
                        i{
                            margin-left:20px;
                            float:left;
                            font-style:normal;
                        }
                    }
                    span{
                        white-space:nowrap;
                        overflow:hidden;
                        text-overflow:ellipsis;
                    }
                }
                
            }
            .writebox{
                position:absolute;
                bottom:0;
                padding:5px 15px;
                height:53px;
                width:100%;
                background:#fff;
                border-top:1px solid #e2e2e2;
                .mint-button--normal{
                    width:100%;
                    background:#4e8dff;
                }
                .foot-icon{
                    color:#fff;
                    font-size:24px;
                }
            }
        }
    }
</style>