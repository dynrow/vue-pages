<template>
    <div ref="wrapper" class="doc-message">
        <JcSearch :on-watch="submit" ref="search"></JcSearch>
        <mt-navbar v-model="selected">
            <mt-tab-item id="1">公共文档</mt-tab-item>
            <mt-tab-item id="2">我的文档</mt-tab-item>
            <mt-tab-item id="3">我的收藏</mt-tab-item>
        </mt-navbar>
        <!-- 文档列表-->
        <div ref="scrollContainer" class="scroll" :style="{ height: wrapperHeight + 'px'}">
            <ul class="doc-list">
                <li v-for="dir in subdirs" :key="dir.id">
                    <a class="dir" :href="'#'+dir.id">
                        <p>{{dir.folderName}}</p>
                    </a>
                </li>
                <li v-for="doc in documents" :key="doc.id">
                    <a class="file" :class="[doc.dmSuffix]" @click="jump(doc)" :href="parseUrl(doc.physicalPath)">
                        <p>{{doc.dmName }}</p>
                        <span>{{doc.createUserName}}</span>
                        <span class="time">{{paresDate(doc.createDate)}}</span>
                        <span class="bulk">{{doc.dmSize}}</span>
                    </a>
                </li>
            <!-- <li v-if="isEmpty" style="text-align: center;margin-top: 20px;">暂无数据</li>-->
            </ul>
        </div>
    </div>
</template>
<script>

    import JcSearch from '@/components/search';
    import ToTop from '@/components/ToTop';
    import {Toast} from 'mint-ui';
    import jcmp from '@/libs/jcmp.js';
    import Util from '@/libs/util.js';
    import store from '@/store';

    export default {
        components: {
            JcSearch
        },
        data() {
            return {
                //当前选中的栏目
                selected: '',
                //文件夹集合
                subdirs: [],
                //文件集合
                documents: [],
                //当前文件夹id
                folderId: '',
                //是否是空
                isEmpty: false,
                //列表容器高度
                wrapperHeight: 100,
            }
        },
        methods: {
            submit(val){
                if(val){
                    this.documents = this.cacheData.filter(function(item) {
                        return item.dmName.indexOf(val) > -1
                    })
                }else{
                    this.documents = this.cacheData;
                }
            },
            queryDir(id) {
                this.folderId = id;
                this.getData();
            },
            getData() {
                this.isEmpty = false
                store.commit('updateLoadingStatus', {isLoading: true})
                if (this.selected == '3') {
                    this.getCollectionList();
                } else {
                    this.getDocList();
                }
            },
            getDocList() {
                let _this = this;
                _this.Api.ARCHIVE[_this.selected == 1 ? 'getPublicList' : 'getDocList']({
                    folderId: _this.folderId
                }).then((res) => {
                    if (res.data.code === '000000') {
                        _this.praseData(res.data.body);
                    } else {
                        _this.empty();
                        Toast({message: res.data.errormsg});
                    }
                    _this.$nextTick(function () {
                        _this.wrapperHeight = document.documentElement.clientHeight - _this.$refs.scrollContainer.getBoundingClientRect().top;
                    })
                })
            },
            getCollectionList() {
                let _this = this;
                _this.Api.ARCHIVE.getCollectionList().then((res) => {
                    if (res.data.code === '000000') {
                        _this.empty();
                        _this.$set(_this, 'documents', res.data.body);
                        _this.cacheData = res.data.body;
                    } else {
                        _this.empty();
                        Toast({message: res.data.errormsg});
                    }
                    _this.$nextTick(function () {
                        _this.wrapperHeight = document.documentElement.clientHeight - _this.$refs.scrollContainer.getBoundingClientRect().top;
                    })
                })
            },
            /**
             * @method 清空显示的数组
             */
            empty(){
                this.documents = [];
                this.subdirs = [];
                this.isEmpty = true;
                store.commit('updateLoadingStatus', {isLoading: false})
            },
            /**
             * @method 解析数据, 将服务端返回的数据赋值给当前页面
             */
            praseData(obj) {
                store.commit('updateLoadingStatus', {isLoading: false})
                this.documents = obj.documents || [];
                this.cacheData = obj.documents || [];
                this.subdirs = obj.subdirs || [];
                if(this.subdirs.length == 0 && this.documents.length == 0){
                    this.isEmpty = true;
                }
            },
            /**
             * @method 解析访问路径, 通过jcmp
             */
            parseUrl(url){
                return jcmp.convertResourceUrl(url).replace('uri=' ,'uri%3D');
            },
            /**
             * @method 解析时间格式, 将时间戳显示年月日
             */
            paresDate(stamp){
                return Util.format(new Date(stamp) ,'yyyy-MM-dd');
            },
            /**
             * @method 点击文件查看时触发
             */
            jump(doc){
                sessionStorage.setItem('doc' ,JSON.stringify(doc))
            }
        },
        watch: {
            selected() {
                this.folderId = '';
                this.getData();
                this.$refs.search.searchText='';
            },
            '$route': function(){
                this.queryDir(this.$route.params.folderId ? this.$route.params.folderId : '');
            }
        },
        mounted(){
            this.cacheData = [];
            this.wrapperHeight = document.documentElement.clientHeight - this.$refs.scrollContainer.getBoundingClientRect().top;
            this.selected = '1';
            new ToTop(this.$refs.scrollContainer ,{});
        }
    }
</script>

<style lang="scss">
    @import '../../../assets/sass/params';
    @import '../../../components/loadmore/mescroll.scss';
    //搜索框样式

    .doc-message {
        input {
            border: 1px solid #ddd!important;
        }
        .jc-search input:focus{
            border: 1px solid #B9D3EE;
            box-shadow: 0 0 5px #B9D3EE;
            outline: none;
            border-radius:4px;
        }
        //导航
        .mint-navbar {
            border-bottom: 1px solid #e2e2e2;
        }

        .mint-navbar .mint-tab-item.is-selected {
            margin-bottom: 0;
            color: $tabNav-color-active !important;
            border-bottom: 3px solid $tabNav-color-active;
        }

        .mint-tab-item {
            color: $tabNav-color-default;
        }

        .mint-tab-item-label {
            font-size: $tabNav-font;
            margin: 0 5px;
        }
        .scroll{
            overflow-y: scroll;
        }
        //文档列表
        .doc-list {
            padding: $page-padding;
            display: block !important;
            padding-bottom: 30px;
        }

        .doc-list li {
            display: block;
            min-height: $list-height;
            line-height: 24px;
            border-bottom: $list-bottom-border;
        }
        .doc-list li:last-child {
            border-bottom: none;
        }

        .doc-list li p {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }

        .doc-list li a {
            display: block;
            height: 55px;
            padding-top: 10px;
            padding-left: 50px;
            font-size: $list-title-font;
            color: $list-title-color;

        }
        .doc-list li a.dir p {
            line-height: 50px;
        }
        .doc-list li a {
            &.file{
                 background: url("../images/08-else.png") 0 15px no-repeat;
            }
            &.doc,
            &.docx {
                background: url("../images/01-doc.png") 0 15px no-repeat;
            }
            &.xls,
            &.xlsx {
                background: url("../images/03-xls.png") 0 15px no-repeat;
            }
            &.ppt {
                background: url("../images/02-ppt.png") 0 15px no-repeat;
            }
            &.pdf {
                background: url("../images/05-pdf.png") 0 15px no-repeat;
            }
            &.txt {
                background: url("../images/07-txt.png") 0 15px no-repeat;
            }
            &.dir {
                background: url("../images/06-wenjianjia.png") 0 15px no-repeat;
            }
            &.file , &.dir{
                background-size: 35px 40px;
            }
        }
        .doc-list li a:active {
            background-color: $list-active-bgcolor;
        }

        .doc-list li span {
            font-size: $list-label-font;
            color: $list-label-color;
        }

        .time {
            margin: 0 10px;
        }

        .bulk {
            float: right;
        }
    }
</style>
