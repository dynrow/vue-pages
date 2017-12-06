<template>
    <div class="fd">
        <div class="flow" @click.stop="hideApprove" >
            <div class="flow-detail" id="flow-detail" ref="viewBox" v-on:scroll="scrolls">
                <div >
                    <mt-cell title="文号" >
                        <span >{{senddetails.noValue}}</span>
                    </mt-cell>
                    <mt-cell title="缓急" >
                        <span>{{senddetails.priorityValue}}</span>
                    </mt-cell>
                    <mt-cell title="标题">
                            <span>{{senddetails.title}}</span>
                        </mt-cell>
                    <mt-cell title="主送" >
                        <span>{{senddetails.mainSendUserName}}</span>
                    </mt-cell>
                    <mt-cell title="抄送" >
                        <span>{{senddetails.copySendUserName}}</span>
                    </mt-cell>
                    <mt-cell title="行文类型" >
                        <span>{{senddetails.docFlowType}}</span>
                    </mt-cell>
                    <mt-cell title="主办部门" >
                        <span>{{senddetails.deptName}}</span>
                    </mt-cell>
                    <mt-cell title="拟稿人" >
                        <span>{{senddetails.docCreateUser}}</span>
                    </mt-cell>
                    <mt-cell title="发文日期" >
                        <span>{{senddetails.modifyDate}}</span>
                    </mt-cell>
                    <mt-cell title="校对人" >
                        <span>{{senddetails.proofUser}}</span>
                    </mt-cell>
                    <mt-cell title="复核人" >
                        <span>{{senddetails.reviewUser}}</span>
                    </mt-cell>
                    <mt-cell title="附件" >
                        <ul><li v-for="attach in attachList"><a :href=attach.url  class="attach">{{attach.attachName}}</a></li></ul>
                    </mt-cell>
                </div>
                <div style="text-align: center;transform: translateY(25px);" v-if="senddetails.pdfUrl">
                    <mt-button plain type="primary" size="small" @click="queryMain(senddetails.pdfUrl)">查看正文</mt-button>
                </div>
               <!-- <button @click="pdfview">PDF</button>-->
                <div class="advice" ref="advice" :class="{nobtn: !senddetails.pdfUrl}">
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
            <Examine ref="examine" :fn-btn2="onSubmit" :status.sync="isShow" :showing="shows" :types.sync="apptypes"></Examine>

            <!-- popupVisible 控制显隐
	            nodeList 可选节点列表
	            isSingle 节点是否单选
	            fnBtn1 确认回调
	            fnBtn2 取消回调
	        -->
	        <JcApprove v-model="popupVisible"
	        	v-if="popupVisible"
	        	:actions="nodeList"
	        	:isSingle="choiceFlag=='single'"
	        	:fn-btn1="onConfirm">
	        </JcApprove>

	        <mt-actionsheet :actions="sheetData" v-model="sheetVisible" cancelText="" ></mt-actionsheet>


        </div>

    </div>
</template>

<script>

    import {Indicator, Toast ,MessageBox} from 'mint-ui';
    import Examine from '@/components/examine';
    //import PdfView from '@/components/pdfview';

    import Util from '@/libs/util.js';

     import JcApprove from '@/components/approve';
     import PdfView from '@/components/pdfview';

    let pdf = new PdfView();

    export default {
        components: {
            Examine,
            JcApprove
        },
        beforeRouteEnter(to, from, next) {

            next((vm) => {
                vm.getDetail();
                vm.hideApprove();
                vm.popupVisible = false;
                vm.nodeList = [];
            })
        },
        data() {
            return {
                senddetails: [],
                isShow: false,
                popupVisible: false,
                nodeList:[],
                choiceFlag:"",
                submitParams:{},
                sheetData: [{name: '确定提交?'}, {name: '是',method: this.onSave}, {name: '否',method: this.onCancel}],
            	sheetVisible: false,
                suggestMap:[],
                shows:true,
                apptypes:true,
                attachList:[]

            }
        },
        mounted(){

            this.maodian = this.$refs.advice.clientHeight;
            this.boxheight = this.$refs.viewBox.scrollHeight;
            this.diff =this.boxheight - this.maodian - document.body.clientHeight;
            if(this.diff < 0){
                this.$refs.suggest.style.position = "static";
            };

        },
        methods: {
            queryMain(url){
                pdf.show(url);
            },
            getDetail: function(){
                let _this = this;
                this.$route.query.selected != '1'? this.shows=false : this.shows=true;
                if (this.$route.query && this.$route.query.id) {
                    _this.submitParams = _this.$route.query;
                    _this.Api.DOC.getSendDetail({
                        id: _this.$route.query.id,
                        definitionId: _this.$route.query.definitionId_,
                        nodeId: _this.$route.query.nodeId,
                        businessKey: _this.$route.query.business_Key_,
                        instanceId: _this.$route.query.instanceId_,
                        selected:_this.$route.query.selected
                    }).then((res) =>{
                        _this.$set(_this, 'senddetails', res.data.body);
                        _this.senddetails.editSuggestName ? _this.apptypes = true :  _this.apptypes = false;
                         _this.suggestMap =  Object.keys(res.data.body.suggestMap).map((item)=>{
                            return res.data.body.suggestMap[item];

                        });
                        _this.attachList =  Object.keys(res.data.body.attachList).map((item)=>{
                                return res.data.body.attachList[item];
                        });
                        _this.submitParams.id = _this.senddetails.id;
		        		_this.submitParams.editSuggestName = _this.senddetails.editSuggestName;
                    }).catch((error) =>{
                        Toast({message:' 请求失败!!!'});
                    });
                }
            },
            parseTimeDate(stamp) {
                return Util.format(new Date(stamp), 'yyyy-MM-dd');
            },
            hideApprove(){
                if(this.$refs.examine.types){
                this.isShow = false;}
            },
            sheet(text) {
                this.personnel=true;
            },
            suggest:function(){
                this.$refs.viewBox.scrollTop = this.$refs.viewBox.scrollHeight;
                this.$refs.suggest.style.position="static";
            },
            scrolls(){
                 Util.debounce(()=>{
                    //let diff = this.maodian - (this.boxheight - document.body.clientHeight);
                    let diff =this.boxheight - this.maodian - document.body.clientHeight;
                    var top = this.$refs.viewBox.scrollTop;
                    if(top > diff){
                        this.$refs.suggest.style.position = "static";
                    }else{
                        this.$refs.suggest.style.position = "absolute";
                    }
                 }, 100)();
            },

            onSubmit(suggest, signature){//提交
                let _this = this;
                _this.submitParams.suggest = suggest;
                _this.submitParams.signature = signature;//手写数据
                _this.Api.DOC.getNextNodes({
                	definitionId: _this.submitParams.definitionId_,//获取待办列表时获取的相应属性值
                	curNodeId: _this.submitParams.curNodeId_,//获取待办列表时获取的相应属性值
                }).then((res)=>{
                    if(res.data.code === '000000'){
                		this.popupVisible = true;
                		this.nodeList = res.data.body.nextNodesList;
                		this.choiceFlag = res.data.body.choiceFlag;
                    }else{
                        Toast({message: res.data.errormsg});
                    }
                })
                this.hideApprove();
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
           		_this.Api.DOC.saveSendApproval(_this.submitParams).then((res)=>{
                    if(res.data.code === '000000'){
                        Toast({message: '提交成功...'});
                         _this.$router.go(-1);
                    }else{
                        Toast({message: res.data.errormsg});
                    }
                })
            }
        },

    }
</script>


<style lang="scss">
  @import '../../../assets/sass/base.scss';

    .flow{
	 	.mint-actionsheet-listitem {
	        height: 50px;
	        line-height: 50px;
	    }

	    .mint-actionsheet-listitem:first-child {
	        height: 65px;
	        line-height: 65px;
	        font-size: 15px;

	    }

	    .mint-actionsheet-listitem:nth-child(2) {
	        color: #ff4e4e;
	    }

	    .mint-actionsheet-button {
	        height: 50px;
	        line-height: 50px;
	    }
    }

</style>
