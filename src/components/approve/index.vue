<template>
	<transition name="approve-float">
		<div v-show="currentValue" class="jc-approve">
			<ul class="jc-approve-list">
				<li class="jc-approve-listitem jc-title">
					<span>审批节点（{{isSingle?'单选':'多选'}}）</span>
				</li>
				<div v-for="( item, itemIndex ) in nodeList" >
					<li class="jc-approve-listitem" :class="{ checked:item.isChecked }" @click.stop="itemClick(item, itemIndex)">		
						<span class="jc-check">
						    <input type="checkbox" :checked="item.isChecked"/>
						    <label></label>
						</span>
						<span>{{item.name}}</span>
						<!--<span class="jcm-user7" v-show="item.isChecked" @click.stop="selectUser(item, itemIndex)"></span>-->
					</li>
					<li class="jc-approve-listitem" v-if="item.isChecked&&userList[itemIndex]">
						<div class="jc-user-wrapper">
							<span class="jc-user" v-for="( user, userindex ) in userList[itemIndex]"  @click.stop="removeUser(item, itemIndex, userindex)">
								{{user.displayName}}<i class="jcm-guanbi" v-if="!(item.userType!='2'&&item.assignees.length>0)"></i>
							</span>
						</div>
					</li>
				</div>
			</ul>
			<div class="btn-group">
	            <mt-button type="default" @click.native="onCancel" v-if="cancelText" plain>{{ cancelText }}</mt-button>
	            <mt-button type="primary" @click.native="onConfirm" v-if="confirmText">{{ confirmText }}</mt-button>
	        </div>
			
			<!-- 人员选择树控件说明：
				hasCheck 是否显示checkbox, true
	            isSingle 是否单选, 默认false
	            selectedUser 已选用户
	            selectedDept 已选用户
	            optionUser 可选用户
	            onSubmit 人员选择回调
	            onHiden 隐藏界面
	        -->
		  	<contacts 
		  		:hasCheck="true" 
		  		:isSingle="isSingleUser" 
		  		:selectedUser="selectedUser" 
		  		:selectedDept="selectedDept" 
		  		:optionUser="optionUser"
		  		@onSubmit="onSubmit"
		  		@onHiden="onHiden"
		  		v-if="userVisible" >
	    	</contacts>
		</div>
	</transition>
</template>

<script type="text/babel">
  import { Popup,Toast } from 'mint-ui';
  import Contacts from "@/components/contacts/index.vue";
  var isDebug = false;
  export default {
    name: 'jc-approve',
    mixins: [Popup],
    components: {
        Contacts
    },
    props: {
      actions: {
        type: Array,
        default: () => []
      },
	  fnBtn1: {
	        type: Function,
	        default: undefined,
	        required: true
	  },
	  fnBtn2: {
	        type: Function,
	        default: undefined,
	        required: false
	  },
      isSingle: {
        default: false
      },
      modal: {
        default: true
      },
      modalFade: {
        default: false
      },
      lockScroll: {
        default: false
      },
      closeOnClickModal: {
        default: true
      },
      confirmText: {
        type: String,
        default: '确定'
      },
      cancelText: {
        type: String,
        default: '取消'
      }
    },
    data() {
      return {
        currentValue: false,
        nodeList:[],
        userList:[],
        index: 0,//节点索引
        isSingleUser:false,//用户是否单选
        userVisible:false,//是否显示
        selectedUser:[],//已选用户
        selectedDept:[],//已选部门
        optionUser:[]//可选用户
      };
    },
    watch: {
      currentValue(val) {
        this.$emit('input', val);
      },
      value(val) {
        this.currentValue = val;
      }
    },
    methods: {
      itemClick(item, index){//点击节点
      	this.index = index;
      	if(!item.isChecked){//节点增加isChecked属性，是否选中
      		this.$set(item, 'isChecked', true)
      	}else{
      		this.$set(item, 'isChecked', !item.isChecked)
      	}
      	if(item.isChecked){
      		this.selectUser(item, index);
      	}
      },
      singleClick(){//处理单选
      	if(this.isSingle){
      		let _this = this;
      		this.nodeList.forEach(function(element,i) {
				if(_this.index!=i){
					element.isChecked = false;
				}
      		})
      	}
      },
      selectUser(item, index){//处理用户选择
      	if(item.type=='end'){//type值为流程状态，如果是end表示下个节点为结束节点，可以直接提交
      		return;
      	}
      	if(item.userType!='2'&&item.assignees.length>0){
      		isDebug&&console.log('直接提交',this.userList)
      		let user = [];
      		item.assignees.forEach(function(element) {
      			user.push({
      				id:element.id,
      				displayName:element.name
      			})
      		})
      		this.$set(this.userList, this.index, user);
      	}
      	
      	if(item.userType=='2'&&item.assignees.length>0){
      		isDebug&&console.log('选择候选人')
      		this.userVisible = true;
      		this.isSingleUser = item.dealType==4;
			this.selectedUser = this.userList[index]?this.userList[index]:[];
			this.optionUser = item.assignees;
      	}
      	
      	if(item.assignees.length==0){
      		isDebug&&console.log('人员选择树')
      		this.userVisible = true;
      		this.isSingleUser = item.dealType==4;
			this.selectedUser = this.userList[index]?this.userList[index]:[];
			this.optionUser = item.assignees;
      	}
      },
      removeUser(item, itemIndex, userIndex){//删除已选择用户
      	isDebug&&console.log(userIndex,itemIndex,this.userList[itemIndex][userIndex]);
      	if(item.userType!='2'&&item.assignees.length>0){//直接提交不能删除用户
      		return;
      	}
      	this.userList[itemIndex].splice(userIndex,1);
      	if(this.userList[itemIndex].length==0){
      		item.isChecked = false;
      	}
      },
      onConfirm(){//确认
      	let _this = this;
      	let confirmData = {
      		confirmUserId: '',// 选中的审批人id  id间用&分割，如果只有一个审批人不加&
      		confirmNodeId: '',// 选中的下个提交节点id，即componentId属性对应值，id间用&分割，如果只选中一个审批节点不用加&
      		confirmSequencesId: ''//选中节点对应的路由id，即返回节点中channel数组对象中sequenceId属性对应值，用&分割，如果只有一个只不加&
      	}
		_this.nodeList.forEach(function(node,index){
			if(node.isChecked){
				confirmData.confirmNodeId += node.componentId + '&';
				node.channel.forEach(function(channel){
					confirmData.confirmSequencesId += channel.sequenceId + '&';
				})
				if(_this.userList[index]){
					_this.userList[index].forEach(function(user){
						confirmData.confirmUserId += user.id + '&';
					})
				}
			}
		})
		if(confirmData.confirmNodeId.length==0){
			Toast({message: '请选择审批节点',duration: 1000});
			return;
		}
		if(this.fnBtn1){
			confirmData.confirmUserId = confirmData.confirmUserId.slice(0, -1);
			confirmData.confirmNodeId = confirmData.confirmNodeId.slice(0, -1);
			confirmData.confirmSequencesId = confirmData.confirmSequencesId.slice(0, -1);
            this.fnBtn1(confirmData);
        }
      },
      onCancel(){//取消
      	this.currentValue = false;
      	this.fnBtn2 && this.fnBtn2();
      },
      onSubmit(selectedUser, selectedDept){//人员选择树回调
      	this.userVisible=false;
      	this.$set(this.userList, this.index, selectedUser);
      	this.selectedDept = selectedDept;
      	this.singleClick();
      },
      onHiden(){//隐藏人员选择树
      	this.userVisible=false;
      	this.nodeList[this.index].isChecked=false;
      }
    },
    mounted() {
	    if (this.value) {
	      	this.nodeList = this.nodeList.concat(this.actions);
	        this.rendered = true;
	        this.currentValue = true;
	        this.open();
	    }
    }
  };
</script>

<style lang="scss">
	@import '../../assets/sass/base.scss';
	.jc-approve {
		position: fixed;
		background: #e0e0e0;
		width: 100%;
		text-align: center;
		bottom: 0;
		left: 0;
		/*transform: translate3d(-50%, 0, 0);*/
		backface-visibility: hidden;
		transition: transform .3s ease-out;
		border-top: 1px solid #e0e0e0;
		.jc-approve-list {
			list-style: none;
			padding: 0;
			margin: 0;
		}
		.jc-approve-listitem {
			display: flex;
			justify-content: flex-start;
			align-items: center;
			width: 100%;
			height: 50px;
			line-height: 50px;
			font-size: 18px;
			color: #333;
			background-color: #fff;
			border-bottom: solid 1px #e0e0e0;
			overflow-x:auto;
			&:active {
				background-color: #f0f0f0;
			}
		}
		.jc-approve-listitem.checked{
			border-bottom: none;
		}
		.jc-approve-listitem::-webkit-scrollbar {width: 0px;height: 0px;}
		
		.jc-title{
			padding-left: 15px;
		}
		.jc-check {
			width: 22px;
			height: 22px;
			position: relative;
			margin: 15px;
		}
		.jc-check label {
			width: 20px;
			height: 20px;
			position: absolute;
			top: 0;
			left: 0;
			border: 1px solid #9DA5BE;
			background: #ffffff;
			border-radius: 11px;
		}
		.jc-check label:after {
			content: '';
			width: 10px;
			height: 6px;
			position: absolute;
			top: 4px;
			left: 4px;
			border: 2px solid #fff;
			border-top: none;
			border-right: none;
			background: transparent;
			opacity: 0;
			transform: rotate(-45deg);
		}
		.jc-check input[type=checkbox]:checked+label {
			border: 1px solid #4E8DFF;
			background: #4E8DFF;
		}
		.jc-check input[type=checkbox]:checked+label:after {
			opacity: 1;
		}
		.jc-check input[type=checkbox] {
			opacity: 0;
			position: absolute;
			z-index: 2;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			margin: 0;
			cursor: pointer;
		}
		.jc-user-wrapper{
			padding: 0 10px 13px 10px;
		}
		.jc-user{
			height: 20px;
			line-height: 20px;
			margin: 5px;
		    padding: 5px;
		    background-color: #e8e8e8;
		    border-radius: 5px;
		    white-space: nowrap;
		}
		.jcm-user7{
			position: absolute;
			right: 15px;
			font-size: 28px;
			width: 40px;
			height: 40px;
			line-height: 40px;
		}
		.btn-group{  
		    width: 100%;
		    height: 53px;
		    background: #fff;
		    box-shadow: -3px 9px 20px #bbb;
		    border-top: 1px solid #ededed;
		    padding: 5px 15px;
		    display: flex;
		    justify-content: space-between;
		}
		.mint-button--primary{
			background-color: $global-base-color;
		}
		.mint-button--default{
			color: $global-base-color;
			border: thin solid #e2e2e2;
		}
		.mint-button{
			width: 48%;
		}
	}
	.mint-toast{z-index: 5000;}
	.approve-float-enter,
	.approve-float-leave-active {
		transform: translate3d(0, 100%, 0);
	}
</style>