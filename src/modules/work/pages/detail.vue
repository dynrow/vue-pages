<template>
    <div class="work-detail">
        <div class="work-item">
    		<mt-field label="标题:" placeholder="请输入标题" v-model="detail.title" :attr="{maxlength:125}"></mt-field>
    		<mt-field label="开始时间:" placeholder="请输入开始时间" v-model="startDate" @click.native="openPicker(1)" :readonly="true"></mt-field>
    		<mt-field label="结束时间:" placeholder="请输入结束时间" v-model="endDate" @click.native="openPicker(0)" :readonly="true"></mt-field>
    		<mt-field placeholder="请输入日程内容" type="textarea" rows="10" v-model="detail.content" :attr="{maxlength:2000}"></mt-field>
        </div>
        <div class="btn-group">
            <mt-button type="primary" @click.native="saveDetail" :class="{save:isAdd}">保存</mt-button>
            <mt-button type="danger" @click.native="sheetVisible=true" v-if="!isAdd">删除</mt-button>
        </div>
	  	<mt-datetime-picker ref="picker" type="time" v-model="pickerValue" @confirm="updateTime"></mt-datetime-picker>
	  	<mt-actionsheet :actions="sheetData" v-model="sheetVisible" cancelText=""></mt-actionsheet>
    </div>
</template>

<script>
import { MessageBox } from 'mint-ui';
import { Toast } from 'mint-ui';
import Util from '@/libs/util.js';
export default {
    data() {
        return {
        	isAdd: 0,//新增 or 修改
        	flag: 0,//开始时间 or结束时间
        	pickerValue: '08:00',
        	sheetData: [{name: '是否删除日程?'}, {name: '是',method: this.removeDetail}, {name: '否'}],
            sheetVisible: false,
			detail: {
				startTimeStr:'08:00',
				endTimeStr:'20:00'
			},
			workDate:''

        }
    },
  	activated: function () {//进入页面
	    this.getDetail();
	},
    deactivated: function () {//离开页面
     	this.sheetVisible = false;
    	this.$refs.picker.close();
    },
    methods: {
    	getDetail(){
	        let currentDate = JSON.parse(window.sessionStorage.getItem("currentDate")).join("/");//解决ios不能正确转换日期
    		this.workDate =  Util.format(new Date(currentDate) ,'yyyy-MM-dd');
	        if(this.$route.params && this.$route.params.id>0){//修改
	        	this.isAdd = 0;
	       		this.detail = JSON.parse(window.sessionStorage.getItem("diaryDetail"));
               }else{//新增
               document.title = '新增日程';
	       		this.isAdd = 1;
	       		this.detail =  {
	       			id:'',
				  	title:'',
					content:'',
					starttime:'',
					endtime:'',
					startTimeStr:'08:00',
					endTimeStr:'20:00'
	       		}
	        }
	  	},
    	openPicker(flag) {
    		this.flag = flag;
    		if(this.flag){
    			this.pickerValue=this.detail.startTimeStr;
    		}else{
    			this.pickerValue=this.detail.endTimeStr;
    		}
	        this.$refs.picker.open();
	    },
	    updateTime(newTime){
	      	this.flag?this.detail.startTimeStr=newTime:this.detail.endTimeStr=newTime;
	    },
	   	saveDetail(){
	   		if(this.detail.title.length==0){
	   			Toast('请输入日程标题');
				return;
	   		}
            if(this.detail.title.length<2){
                Toast('标题不能小于2个字');
                return;
            }
            if(this.detail.content.length==0){
                Toast('请输入日程内容');
                return;
            }
	   		if(this.detail.content.length<2){
	   			Toast('日程内容不能小于2个字');
				return;
	   		}
	   		if(this.detail.startTimeStr > this.detail.endTimeStr){
	   			Toast('开始时间不能晚于结束时间');
				return;
	   		}

			let _this = this;
			_this.detail.starttime = _this.startDate+":00";
			_this.detail.endtime = _this.endDate+":00";
	      	_this.Api.WORK.saveDiary(_this.detail).then(function(res){
	            if(res.data.code === '000000'&&res.data.body===1){
	            	Toast('保存成功');
	            	_this.$router.go(-1);
	            }else{
	           		Toast(res.data.errormsg);
	           	}
	        }).catch(function(error){
	        	Toast('加载失败......');
	        })
	   	},
	  	removeDetail(){
	  		let _this = this;
	      	_this.Api.WORK.deleteDiary(_this.detail.id).then(function(res){
	            if(res.data.code === '000000'&&res.data.body===1){
	            	let instance = Toast('删除成功');
	            	_this.$router.go(-1);
	            }else{
	           		Toast(res.data.errormsg);
	           	}
	        }).catch(function(error){
	        	Toast('加载失败......');
	        })
	  	}

    },
    computed: {
   		startDate:{
   			get:function(){
   				return this.workDate + ' ' + this.detail.startTimeStr;
   			},
   			set:function(newValue){
   				console.log(newValue)
   			}
   		},
   		endDate:{
   			get:function(){
   				return this.workDate + ' ' + this.detail.endTimeStr;
   			},
   			set:function(newValue){
   				console.log(newValue)
   			}
   		}
    }
}
</script>
