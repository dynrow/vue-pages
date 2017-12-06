<template>
    <div class="archives-untreated info-wrapper" @click.stop="ctype ? ctype=false : ''">
        <div class="page-navbar">
            <mt-navbar v-model="selected">
                <mt-tab-item id="1">待办公文<i class="mpoint" v-if="mpoint"></i></mt-tab-item>
                <mt-tab-item id="2">收文查询</mt-tab-item>
                <mt-tab-item id="3">发文查询</mt-tab-item>
            </mt-navbar>
            <form action="" class="pagesearch">
                <div>
                    <a class="search-type" href="javascript:void(0);" @click.stop="ctype = !ctype">
                        <span >类型</span>
                        <label :style="{'transform' : 'rotate(' + (ctype ? 180 : 0) + 'deg)'}" class="type-button"></label>
                    </a>
                    <div class="mint-popup-1" v-show="ctype">
                        <span class="triangle-1"></span>
                        <ul class="flow-infor">
                            <li @click.stop="filterFlowData('all')"><a href="javascript:void(0);">全部类型</a></li>
                            <li @click.stop="filterFlowData(flow.definitionId)" v-for="flow in flowsData" :key="flow.definitionId"><a href="javascript:void(0);">{{flow.flowName}}</a></li>
                        </ul>
                    </div>
                </div>
                <input type="search" :style="{ width: searchWidth }" placeholder="搜索" v-model="val">
                <i class="mintui mintui-search"></i>
            </form>
            <div ref="wrapper">
                <div v-show="selected == '1'" style="width: 100%;">
                    <div class="untreatedList" :style="{ height: wrapperHeight + 'px'}">
                        <router-link class="mint-cell" v-for="todo in todoList" :key="todo.flowName +'-'+todo.id" :to="linkOption(todo)">
                            <div class="mint-cell-wrapper">
                                <div class="mint-cell-value">
                                    <span class="mint-cell-text">{{parseTitle(todo.title)}}</span>
                                    <span class="mint-cell-label">
                                    	<span class="flow-type" :class="todo.docType==0  ? 'flow-type-0' : 'flow-type-1'" v-if="todo.flowName">{{todo.flowName}}</span>
                                        <span class="create-date">{{parseTimeDate(todo.createDate)}}</span>
                                        <span class="create-name">{{todo.author}}</span>
                                    </span>
                                </div>
                            </div>
                        </router-link>
                        <div class="mescroll-empty" v-show="showSearchResult"><img class="empty-icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALoAAAC6CAMAAAAu0KfDAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA25pVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDozNGZlY2MwMS1jYzVkLTQ0NDgtYTYyMi0wNDI4NTkxZTA1YWIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6Qzg2OEQ5QjNCRUQ5MTFFNzg5QkFBRjNDNEJFMzY5QjUiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6Qzg2OEQ5QjJCRUQ5MTFFNzg5QkFBRjNDNEJFMzY5QjUiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NzRGOTBBNTNCN0NFMTFFNzk4OTlBRkExMTA1QzhFNDYiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NzRGOTBBNTRCN0NFMTFFNzk4OTlBRkExMTA1QzhFNDYiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4ElKUlAAABgFBMVEVOhffl8f9irP/1+v/I3v7+/v/Z6f3G3f9xxP/e8P/h7f9Ynf92zf/t9f9puf+qzfxksf/7/f+Huvzo8v/S5f1Xmv+kyvqVwf200v10yv/c7f5Pjv/a6v3e7/9QkP9HdPTa6f7b6v6/2P7D2v/c7v550f/w9v9dpf9ntP/b7P3Q4v/c7f3d6v9svP/Y5/9uwP+v0PrL4P9NpvTj7v9fqP/z+P9TlP+91f/F2//V5v/Z6P7e6v9ot/+gxf/N4P9aoP/4+/9Vl//U5v1im/rP4f/W5/12rvt/sftbsPm51P/Y6P3q8/9VrPfU5P+wzv/P4/xgtPvW5/zc6P+30v/s+P/U5/5loPtqvf1blflrpPrb6/1luPze7P3c7v261/vO7P/A1//Z6/3K3v/Y6v5VkPjP4/7e7f6/2vve6f/E3fzV5f/N4vzS4/9doPnf7/3I3P9vqPvf6/+nyP9XlPhTjfdktv2n1/1gpfllrvvM4fxzx/94z/9co//s8//C2/v///+JrpY7AAAAgHRSTlP/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////ADgFS2cAABVUSURBVHja7J2LQ9rIvsfNAWLNLnUxbqWc2PJwuYtYWg6HVfHI5ShKgaIV21oRXYUuPkrx0XZ33V67//r5/SaZPCAZni3uvfebSDLDkPnkm9/MBIRk5M+/rEb+H/1/AbrDZYs783lR5DhuDAQLUcy/cMZtLsftRXfZXuRFwmsuTswHba5bh56K5xnQhh1wBl23Bt0Rd3aIreLn447hozvi4lhPEuOuYaKD32N9qE/v+0B39cUty5kaArqNBMr02DQRrJB1XNJ8fV7zkmp6TLQ5viq6I85pKHp0vTp9nusxbkZ6BR+gxnqDHxk6OFEv8F2j274A+PT0zBhn+8LorryhRmfK0Z9cNk5tAXnXF0R3BI0tzeYYgNSjODYWdHwp9BRnJBcHQe5I6UM+9UXQ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"><p class="empty-tip">暂无相关数据~</p></div>
                    </div>
                </div>
                <div v-show="selected == '2' || selected == '3'" class="doctype">
                    <Loadmore  :on-infinite="onInfinite" :options="loadmoreOpt" :init-scroll="initScroll" :style="{ height: wrapperHeight + 'px'}">
                        <div class="mint-tab-item">
                            <router-link class="mint-cell" v-for="myObj in (selected == '2' ? receList : sendList)" :key="myObj.id" :to="linkOption(myObj)">
                                <div class="mint-cell-wrapper">
                                    <div class="mint-cell-value">
                                        <span class="mint-cell-text">{{parseTitle(myObj.title)}}</span>
                                        <span class="mint-cell-label">
	                                    	<span class="flow-type" :class="myObj.docType==0  ? 'flow-type-0' : 'flow-type-1'" v-if="myObj.flowName">{{myObj.flowName}}</span>
	                                    	<span class="create-date">{{parseTimeDate(myObj.createDate)}}</span>
                                            <span class="create-name">{{myObj.author}}</span>
	                                    </span>
                                    </div>
                                </div>
                            </router-link>
                        </div>
                    </Loadmore>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {
        Indicator,
        Toast
    } from 'mint-ui';
    import Util from '@/libs/util.js';
    import Loadmore from '@/components/loadmore';
    export default {
        components: {
            Loadmore
        },
        data() {
            return {
                //流程列表
                flowsList: [],
                //搜索框的宽度
                searchWidth: '',
                //搜索框中内容
                val: '',
                //多选公文类型
                //types:['办公室收文','信息中心收文','财务科收文','秘书处收文','办公室发文','省政府发文'],
                //公文类型
                ctype: false,
                //当前选中的栏目
                selected: '',
                //加载数据的loading
                loading: false,
                //控制容器的高度
                wrapperHeight: document.documentElement.clientHeight - 111,
                /**
                 * 存放所有栏目的页面数据
                 * columns对象的key对应的是栏目的id, value是当前栏目的pageNum
                 */
                columns: {},
                //上拉刷新配置
                loadmoreOpt: {
                    up: {
                        page: {
                            size: 10
                        },
                        noMoreSize: 5
                    }
                },
                //待办检索结果状态, 是否显示暂无更多
                showSearchResult: false,
                //收文发文分页数量存储
                pageNums: {},
                //待办存储
                todoList:[],
                //收文
                receList:[],
                //发文
                sendList:[],
                mpoint:true
            }
        },
        beforeRouteEnter(to, from, next) {

            next((vm) => {
                vm.getToDoList();
            })
        },
        methods: {
            initScroll(mescroll) {
                let _this = this;
                this.mescroll = mescroll;
                this.mescroll.hideDocNoMore = function(){
                    _this.mescroll.removeEmpty();
                    _this.showSearchResult = false;
                }
                this.mescroll.showDocNoMore = function(){
                    _this.mescroll.showEmpty();
                    _this.showSearchResult = true;
                }
            },
            onInfinite() {
                this.pageNums[this.selected]++;
                this.getDOCList();
            },
            parseTimeDate(stamp) {
                return Util.format(new Date(stamp), 'yyyy-MM-dd');
            },
            //公文列表
            getDOCList() {
                let _this = this;
                //加载loading
                _this.showLoading();
                //获取数据
                _this.Api.DOC[_this.selected == '2' ? 'getReceiveFlows' : 'getSendFlows'](_this.pageNums[_this.selected]).then(function(res) {
                    if (res.data.code === '000000') {
                        let data = res.data.body;
                        if(_this.selected == 2){
                            _this.receList = _this.cacheData['rece'] = _this.cacheData['rece'].concat(Array.isArray(data) ? data : JSON.parse(data));

                        }else{
                            _this.sendList = _this.cacheData['send'] = _this.cacheData['send'].concat(Array.isArray(data) ? data : JSON.parse(data));

                        }
                        //传入当前页码,保证插件计算是否有下一页时使用插件内部的变量导致出错问题
                        _this.mescroll.endSuccess(data.length , null, _this.pageNums[_this.selected] + 1);
                    } else {
                        _this.receList = _this.sendList = [];
                        Toast(res.data.errormsg);
                    }
                    _this.$nextTick(() => {
                        _this.hideLoading();
                    });
                }).catch(error => {
                    _this.hideLoading();
                })
            },
            //待办列表
            getToDoList() {
                var _this = this;
                _this.showLoading();
                _this.Api.DOC.getToDosList().then(function(res) {
                    if (res.data.code === '000000') {
                        let data = res.data.body;
                        _this.todoList = _this.cacheData['todo'] = Array.isArray(data) ? data : JSON.parse(data);
                    } else {
                        Toast(res.data.errormsg);
                    }
                    _this.$nextTick(() => {
                        _this.hideLoading();
                    });
                }).catch(error => {
                    _this.hideLoading();
                })
            },
            //流程列表
            flowList() {
                var _this = this;
                _this.Api.DOC.getFlows().then(function(res) {
                    if (res.data.code === '000000') {
                        let data = res.data.body;
                        _this.flowsList = Array.isArray(data) ? data : JSON.parse(data);
                    } else {
                        Toast(res.data.errormsg);
                    }
                })
            },
            getmpoint(){
                let _this = this;
                _this.Api.DOC.getToDosList().then(function (res) {
                    if (res.data.code === '000000') {
                        if (res.data.body.length > 0) {
                            _this.mpoint = true;
                        }
                    }
                });
            },
            searchW: function() {
                this.searchWidth = document.body.clientWidth - 123 + 'px';
            },
            showLoading() {
                Indicator.open();
            },
            hideLoading() {
                Indicator.close();
            },
            //点击列表
            linkOption(obj){
                return {
                    path: obj.docType == 1  ? 'receivedetails' : 'senddetails' ,
                    query: {
                        id: obj.id ,
                        nodeId: obj.curNodeId_ ? obj.curNodeId_ : '',
                        definitionId_: obj.definitionId_,
                        instanceId_:obj.instanceId_,
                        business_Key_: obj.business_Key_,
                        curNodeId_: obj.curNodeId_ ? obj.curNodeId_ : '',
                        taskId_: obj.taskId_ ? obj.taskId_ : '',
                        selected: this.selected,
                    }
                }
            },
            //过滤工作流类型
            filterFlowData(type){
                let index = this.selected;
                //获取当前sheet页过滤需要数据集
                let data = this.cacheData[index == 1 ? 'todo' : index == 2 ? 'rece' : 'send'];
                if(index == 1){
                    this.todoList = type == 'all' ? data : data.filter(function(item) {
                        return item.definitionId_ == type;
                    })
                }
                if(index == 2){
                    this.receList  = type == 'all' ? data : data.filter(function(item) {
                        return item.definitionId_ == type;
                    })
                }
                if(index == 3){
                    this.sendList  = type == 'all' ? data : data.filter(function(item) {
                        return item.definitionId_ == type;
                    })
                }
                this.ctype = false;
            },
            filterSearchData(key){//根据查询关键字过滤数据
                let _this = this;
                if(this.searchState){
                    return false;
                }
                //标识正在检索状态
                this.searchState = true;
                //检索列表类型,   待办, 收文, 发文
                this.indexType = this.selected == 1 ? 'todo' : this.selected == 2 ? 'rece' : 'send';
                //待检索的数据,根据当前类型获取
                let data = this.cacheData[this.indexType];
                //检索结果
                let result = data.filter(function(item) {
                    return item.title && item.title.indexOf(key) != -1;
                })
                //赋值给当前列表的数组
                this.$set(this, this.indexType + 'List' ,result);
                //判断检索结果是否为空
                if(!result.length){
                    this.mescroll.showDocNoMore();
                }else{
                    this.mescroll.hideDocNoMore();
                }
                //渲染完成后重置检索状态
                this.$nextTick(()=>{
                    _this.searchState = false;
                });
            },
            flowIndex(definitionId){//获取流程类型索引
        		for(let i=0;i<this.flowsList.length;i++){
        			if(this.flowsList[i].definitionId == definitionId){
        				return i/10;
        			}
        		}
        		return -1;
        	},
            parseTitle(title){
                if(title == null) { return "(无标题)"}else{return title}
            }
        },
        mounted() {
            this.cacheData = {
                todo: [],
                rece: [],
                send: []
            };
            this.searchState = false;
            this.searchW();
            //请求列表数据
            this.flowList();
            this.selected = '1';
            this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top
        },
        watch: {
            selected: function() {
            	this.val='';
                this.cacheData = {
                    todo: [],
                    rece: [],
                    send: []
                };
                this.mescroll.hideDocNoMore();
                if(this.selected == '1'){
                    this.getToDoList();
                }else{
                    this.pageNums[this.selected] = 0;
                    this.getDOCList();
                }
            },
            val: function(value){
            	if(value.length > 0){
                    this.mescroll.lockUpScroll(null);//  方法
                    this.mescroll.hideUpScroll();
            		this.filterSearchData(value);
            	}else{
                    this.mescroll.lockUpScroll(false);
            		this.filterFlowData('all');
            	}
            }
        },
        computed:{
        	flowsData: function(){
        		if(this.selected == '1'){
        			return this.flowsList;
        		}else if(this.selected == '2'){
        			return this.flowsList.filter(function(item){
						return item.extStr1 == '1';
					})
        		}else{
        			return this.flowsList.filter(function(item){
						return item.extStr1 == '0';
					})
        		}

        	}
        }
    }
</script>

