<template>
    <div class="td">
        <div class="flow" @click.stop="hideApprove" ref="textBox"  v-on:scroll="scrolls">
            <div class="flow-detail" id="flow-detail" ref="viewBox" >
                <div style="padding-bottom:20px;">
                    <mt-cell title="所属栏目">
                        <span v-html="info.title"></span>
                    </mt-cell>
                    <mt-cell title="标题">
                        <span v-html="info.title"></span>
                    </mt-cell>
                    <mt-cell title="副标题">
                        <span v-html="info.title"></span>
                    </mt-cell>
                    <mt-cell title="作者">
                        <span v-html="info.author"></span>
                    </mt-cell>
                    <mt-cell title="作者单位" >
                        <span v-html="info.author_unit"></span>
                    </mt-cell>
                    <mt-cell title="首页显示图片">
                        <span><img :src="info.picUrl" alt="暂无图片"></span>
                    </mt-cell>
                    <mt-cell title="附件">
                        <p class="attach-list" v-for="attach in info.attachUrlList">
                            <a :href="attach.url">{{attach.attachName}}</a>
                        </p>
                    </mt-cell>
                    <mt-cell title="发布时间">
                        <span v-html="info.sendTime"></span>
                    </mt-cell>
                    <mt-cell title="有效期限">
                        <span v-html="info.sendTime"></span>
                    </mt-cell>
                    <mt-cell title="发布人">
                        <span v-html="info.author"></span>
                    </mt-cell>
                    <mt-cell title="发布部门">
                        <span v-html="info.sendTime"></span>
                    </mt-cell>
                    <mt-cell title="内容" style="flex-wrap: wrap;">
                        <div v-html="noTableHtml1"></div>
                        <div v-html="tableHtml" style="overflow-x:scroll;"></div>
                        <div v-html="noTableHtml2"></div>
                    </mt-cell>
                    <mt-cell title="摘要">
                        <span v-html="info.sendTime"></span>
                    </mt-cell>
                    <mt-cell title="允许评论">
                        <span v-html="info.sendTime"></span>
                    </mt-cell>
                    <mt-cell title="公开范围">
                        <span v-html="info.sendTime"></span>
                    </mt-cell>
                </div>
                <div class="advice" ref="advice">
                    <a class="advice-title"  @click="suggest" ref="suggest">流转意见</a>
                    <div class="advice-content">
                        <p v-if="suggestMap.length < 1" style="text-align:center;font-size:14px;color:#999;">暂无流转意见</p>
                        <div v-for="(suggests,sindex) in suggestMap" >

                            <div class="view"   >
                                <div for="" class="view-label">
                                <!--view-icon-un 控制是否为灰色-->
                                <i class="view-icon jcm-duihao2" v-bind:class="sindex > 1 && sindex == suggestMap.length-1 ?  'view-icon-un' :  ''"></i>
                                <!-- {{suggest.suggestName}} -->主办意见
                                </div>
                                <!--view-content-un 控制是否为灰色-->
                                <div  v-bind:class="sindex == suggestMap.length-1 ?  'view-content view-last-content' :  'view-content'">
                                    <div class="view-main" v-for="(suggest,indexs) in suggests" >
                                    <img v-bind:src="suggest.signature" alt="" v-if="suggest.signature">
                                        {{suggest.message}}
                                        <div class="label-mes">
                                            <span class="view-date">{{parseTimeDate(suggest.signDate)}}</span>
                                            <span class="view-name">{{suggest.userName}}</span>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        <!-- message进行配置常用词
            btnText1配置第一个按钮显示文字
            btnText2配置第二个按钮显示文字
            fnSign(url, width, height)  签批回调
            fnBtn1  第一个按钮回调
            fnBtn2  第二个按钮回调
 			types   进行组件类型配置(布尔型，默认是true)
            write   是否可写(默认为true)
            *** 必填参数 *** status.sync 控制控制审批的显隐,需添加sync修饰符
        -->
        <Examine ref="examine" :fn-btn2="onSubmit" :status.sync="isShow"  :showing="shows" :types="apptypes"></Examine>

        <!-- popupVisible 控制显隐
            nodeList 可选节点列表
            isSingle 节点是否单选
            fnBtn1 确认回调
            fnBtn2 取消回调
        -->
        <JcApprove v-model="popupVisible" v-if="popupVisible"
        	:actions="nodeList"
        	:isSingle="choiceFlag=='single'"
        	:fn-btn1="onConfirm">
        </JcApprove>

        <mt-actionsheet :actions="sheetData" v-model="sheetVisible" cancelText=""></mt-actionsheet>
        </div>
    </div>
</template>

<script>
	import Util from '@/libs/util.js';
	import Jcmp from '@/libs/jcmp.js';
    import Examine from '@/components/examine';
    import JcApprove from '@/components/approve';
    import { Toast ,Indicator} from 'mint-ui';
    export default {
        components: {
            Examine,
            JcApprove
        },
        data() {
            return {
                info: {},
                isShow: false,
                suggestMap:[],
                popupVisible: false,
                nodeList:[],
                choiceFlag:"",
                submitParams:{},
                sheetData: [{name: '确定提交?'}, {name: '是',method: this.onSave}, {name: '否',method: this.onCancel}],
            	sheetVisible: false,
            	shows:true,
                apptypes:true,
                noTableHtml1: '', //非table内容
                noTableHtml2: '', //非table内容
                tableHtml: '', //table内容
            }
        },
        beforeRouteEnter(to, from, next) {
            next((vm) => {
            	let _this = vm;
                _this.getNewsDetail();
                _this.hideApprove();

                if(from.name=='Todo'){
                	_this.popupVisible = false;
                	_this.nodeList = [];
                }
            })
        },
        beforeUpdate(){
            this.$nextTick(function () {
               this.maodian = this.$refs.advice.clientHeight;
                this.boxheight = this.$refs.viewBox.scrollHeight;
                this.diff =this.boxheight - this.maodian - document.body.clientHeight;
                if(this.diff < 0){
                    this.$refs.suggest.style.position = "static";
                };
            })

        },
        methods: {
            getNewsDetail() {
                let _this = this;

                if (this.$route.query && this.$route.query.id) {
                    _this.submitParams = _this.$route.query;
                    _this.showLoading();
                    _this.Api.INFO.getInfoById({
                        id: _this.$route.query.id,
                        definitionId: _this.$route.query.definitionId_,
                        nodeId: _this.$route.query.nodeId ,
                        instanceId: _this.$route.query.instanceId_ ,

                        businessKey: _this.$route.query.business_Key_
                    }).then((res) =>{
                        _this.$set(_this, 'info', res.data.body);
                        _this.apptypes = !!_this.info.editSuggestName;
                        _this.info.sendTime = _this.parseTimeDate(_this.info.sendTime);
                        //_this.info.picUrl = _this.info.picUrl ? Jcmp.convertResourceUrl(_this.info.picUrl) : null;
	                	_this.submitParams.id = _this.info.id;
                        _this.submitParams.editSuggestName = _this.info.editSuggestName;
                        _this.suggestMap =  Object.keys(_this.info.suggestMap).map((item)=>{
                            return _this.info.suggestMap[item];
                        });
                        _this.$nextTick(() => {
                            _this.settableWidth();
                            _this.hideLoading();
                        });
		        	}).catch((error) =>{
                        Toast({message:' 请求失败!!!'});
                    });
                }
            },
            hideApprove(){
                if(this.$refs.examine.types){
                    this.isShow = false;
                }
            },
            onSubmit(suggest ,signature){//提交
                let _this = this;
                _this.submitParams.suggest = suggest;
                _this.submitParams.signature = signature;
                _this.Api.INFO.getNextNodes({
                	definitionId_: _this.submitParams.definitionId_,//获取待办列表时获取的相应属性值
                	curNodeId_: _this.submitParams.curNodeId_,//获取待办列表时获取的相应属性值
                }).then((res)=>{
                    if(res.data.code === '000000'){
                		this.popupVisible = true;
                		this.nodeList = res.data.body.nextNodesList;
                		this.choiceFlag = res.data.body.choiceFlag;
                        _this.$nextTick(() => {
                            _this.hideLoading();
                        });
                    }else{
                        Toast({message: res.data.errormsg});
                        _this.hideLoading();
                    }
                })
                this.hideApprove();
           	},
               initScroll(mescroll) {
                this.mescroll = mescroll;
            },
            showLoading() {
                Indicator.open();
            },
            hideLoading() {
                Indicator.close();
            },
           	onConfirm(confirmData){//确认
           		Object.assign(this.submitParams, confirmData);
           		this.popupVisible = false;
           		this.sheetVisible = true;
            },
            onCancel(){
            	this.popupVisible = true;
           		this.sheetVisible = false;
            },
            onSave(){
            	let _this = this;
           		_this.Api.INFO.commitApproval(_this.submitParams).then((res)=>{
                    if(res.data.code === '000000'){
                        Toast({message: '提交成功'});
                        _this.$router.go(-1);
                    }else{
                        Toast({message: res.data.errormsg});
                    }
                })
            },
            scrolls(){
                 Util.debounce(()=>{
                    let diff =this.boxheight - this.maodian - document.body.clientHeight;
                    var top = this.$refs.textBox.scrollTop;
                    if(top > diff){
                        this.$refs.suggest.style.position = "static";
                    }else{
                        this.$refs.suggest.style.position = "absolute";
                    }
                 }, 100)();
            },
            suggest:function(){
                this.$refs.textBox.scrollTop = this.$refs.viewBox.scrollHeight;
                this.$refs.suggest.style.position="static";
            },
            parseTimeDate(stamp) {
                return Util.format(new Date(stamp), 'yyyy-MM-dd');
            },
            //如果信息内容中包含table,table中一行td大于4，就会出横向滚动条，并且table的宽度设置为600px;
            settableWidth: function(){
                let _this = this;
                if(_this.info.infoContent.indexOf('<table>') != -1){
                    let tdLength = _this.info.infoContent.split('<td').length - 1;
                    let trLength = _this.info.infoContent.split('<tr').length - 1;
                    let tableContent = _this.info.infoContent.split('table');
                    tableContent[0] = tableContent[0].substring(0,tableContent[0].length - 1);
                    tableContent[2] = tableContent[2].substr(1);
                    _this.noTableHtml1 = tableContent[0];
                    _this.noTableHtml2 = tableContent[2];
                    if(tdLength/trLength > 4){
                        _this.tableHtml = '<table style="width:600px"' + tableContent[1] + 'table>';
                    }else{
                        _this.tableHtml = '<table' + tableContent[1] + 'table>';
                    }
                }else{
                    _this.noTableHtml1 = _this.info.infoContent;
                }
            }
        }
    }
</script>

<style>

</style>
