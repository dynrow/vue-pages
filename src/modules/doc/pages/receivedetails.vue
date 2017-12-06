<template>
    <div class="fd">
        <div class="flow" @click.stop="hideApprove" >
            <div class="flow-detail" id="flow-detail" ref="viewBox" v-on:scroll="scrolls">
                <div class="flow-content">
                    <mt-cell title="来文单位" >
                        <span>{{redetails.sendDept}}</span>
                    </mt-cell>
                    <mt-cell title="来文文号">
                        <span>{{redetails.noValue}}号</span>
                    </mt-cell>
                    <mt-cell title="密级" >
                    <span>{{redetails.secretValue}}</span>
                    </mt-cell>
                    <mt-cell title="文件日期">
                        <span>{{redetails.remark17}}</span>
                    </mt-cell>
                    <mt-cell title="收文日期" >
                        <span>{{redetails.receiveDate}}</span>
                    </mt-cell>
                    <mt-cell title="紧急程度" >
                        <span>{{redetails.priorityValue}}</span>
                    </mt-cell>
                    <mt-cell title="收文分类" >
                        <span>{{redetails.docTypeValue}}</span>
                    </mt-cell>
                    <mt-cell title="来文编号" >
                        <span>{{redetails.seqValue}}</span>
                    </mt-cell>
                    <mt-cell title="页数" >
                        <span>{{redetails.total}}</span>
                    </mt-cell>
                    <mt-cell title="文件标题" >
                        <span>{{redetails.title}}</span>
                    </mt-cell>
                    <mt-cell title="办结时限" >
                        <span>{{redetails.remark18}}</span>
                    </mt-cell>
                    <mt-cell title="备注" >
                        <span>{{redetails.remark1}}</span>
                    </mt-cell>
                    <mt-cell title="附件" >
                        <ul><li v-for="attach in attachList"><a :href=attach.url  class="attach">{{attach.attachName}}</a></li></ul>
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
	            fnSign  签批回调
	            fnBtn1  第一个按钮回调
	            fnBtn2  第二个按钮回调
	 			types   进行组件类型配置(布尔型，默认是true)
	            readOnly是否可写(默认为false)
                showing 是否可以审批
	            *** 必填参数 *** status.sync 控制控制审批的显隐,需添加sync修饰符
	        -->
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

    //let pdf = new PdfView();

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
                redetails: [],
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
            getDetail: function(){
                let _this = this;
                this.$route.query.selected != '1'? this.shows=false : this.shows=true;
                if (this.$route.query && this.$route.query.id) {
                    _this.submitParams = _this.$route.query;
                    _this.Api.DOC.getReceiveDetail({
                        id: _this.$route.query.id,
                        definitionId: _this.$route.query.definitionId_,
                        nodeId: _this.$route.query.nodeId,
                        businessKey: _this.$route.query.business_Key_,
                        instanceId: _this.$route.query.instanceId_,
                        selected:_this.$route.query.selected
                    }).then((res) =>{
                        _this.$set(_this, 'redetails', res.data.body);
                        _this.redetails.editSuggestName ? _this.apptypes = true :  _this.apptypes = false;
                         _this.suggestMap =  Object.keys(res.data.body.suggestMap).map((item)=>{
                            return res.data.body.suggestMap[item];

                        });
                        _this.attachList =  Object.keys(res.data.body.attachList).map((item)=>{
                                return res.data.body.attachList[item];
                        });
                        
                        _this.submitParams.id = _this.redetails.id;
		        		_this.submitParams.editSuggestName = _this.redetails.editSuggestName;
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

            onSubmit(suggest ,signature){//提交
                let _this = this;
                _this.submitParams.suggest = suggest;
                _this.submitParams.signature = signature;
                _this.Api.DOC.getNextNodes({
                	definitionId: _this.submitParams.definitionId_,//获取待办列表时获取的相应属性值
                	curNodeId: _this.submitParams.curNodeId_,//获取待办列表时获取的相应属性值
                }).then((res)=>{
                    if(res.data.code === '000000'){
                		this.popupVisible = true;
                		this.nodeList = res.data.body.nextNodesList;
                		this.choiceFlag = res.data.body.choiceFlag;
                    }else{
                        Toast(res.data.errormsg);
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
           		_this.Api.DOC.saveReceiveApproval(_this.submitParams).then((res)=>{
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
