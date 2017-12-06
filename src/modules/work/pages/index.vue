<template>
    <div class="work-content" :style="{ height: wrapperHeight + 'px' }">
        <calendar
        :events="calendar.events"
        :jcmday="currentDate"
        @select="calendar.select"
        @selectMonth="calendar.selectMonth"
        @selectYear="calendar.selectYear"
        id="workCalendar">
        </calendar>
        <div id="workNew" class="work-new clearfix">
            <span class="fl" style="float:left">{{today}}</span>
            <i class="mintui plus" @click="viewDiary()"></i>
        </div>
        <div class="work-main" :style="{ height: workListHeight + 'px' }">
            <ul class="work-list" v-show="workList.length>0">
            	<li v-for="item in workList" @click="viewDiary(item)">
	                <span class="list-time">{{item.startTimeStr}}-{{item.endTimeStr}}</span>
	                <span class="list-title white-space">{{item.title}}</span>
	                <i class="mint-cell-allow-right"></i>
                </li>
            </ul>
            <div class="work-no" v-show="workList.length==0">
            	<img src="../images/no.png" height="44px" width="44px">
            	<p>暂无相关日程</p>
            </div>
        </div>
    </div>
</template>

<script>
import calendar from '@/components/calendar';
import Api from '@/libs/api';
import Util from '@/libs/util.js';
import { Toast } from 'mint-ui';
export default{
    components:{
        calendar
    },
    data(){
        let _this = this;
        return {
        	currentDate: [],//当前日期
            calendar: {
                events:{},
                select(value){
                	_this.updateDate(value);
                },
                selectMonth(value){
                	_this.updateDate(value);
                },
                selectYear(value){
                	_this.updateDate(Array.of(value));
                }
            },
            dirayList: [],//月份日程
            wrapperHeight: 0 //控制容器的高度
        }
    },
    beforeRouteEnter (to, from, next) {
    	next((vm) => {
    		vm.queryDiary();
    	})
  	},
    methods: {
    	updateDate(newDate){//调整日期
    		let lastDate = this.currentDate;
    		if(newDate.length==1){//年
    			newDate[1] = this.currentDate[1];
    			newDate[2] = this.currentDate[2];
    		}else if(newDate.length==2){//年月
    			newDate[2] = this.currentDate[2];
    		}
    		this.currentDate = newDate;
    		if(this.currentDate[0]!=lastDate[0]||this.currentDate[1]!=lastDate[1]){//年或者月改变了
    			this.queryDiary();
    		}
    	},
        queryDiary(){//根据年月获取月日程
        	let _this = this;
	      	_this.Api.WORK.queryDiary({
	      		year:_this.currentDate[0],
	      		month:_this.currentDate[1]
	      	}).then(function(res){
	            if(res.data.code === '000000'){
	            	if(_this.currentDate.length==0){//从服务器获取当期日期
	            		let today = new Date(res.data.body.time);
	                	_this.currentDate = [today.getFullYear(), today.getMonth() + 1, today.getDate()]
	            	}
	                _this.dirayList = res.data.body.dirayList;
	                _this.calendar.events = {};
	                _this.dirayList.forEach(function(element,index){
	                	if(element){
		            		_this.calendar.events[_this.currentDate[0] + '-' + _this.currentDate[1] + '-' + (index+1)] = '$';
	                	}
	                })
	            }else{
	           		Toast(res.data.errormsg);
	           	}
	            _this.$nextTick(function () {
			        _this.wrapperHeight = document.documentElement.clientHeight - (_this.$parent.headerState?40:0);
			    })
	        }).catch(function(error){
	        	Toast('加载失败......');
	        })
        },
        viewDiary(item){//去往详情页
        	window.sessionStorage.setItem("diaryDetail",JSON.stringify(item));
	    	window.sessionStorage.setItem("currentDate",JSON.stringify(this.currentDate));
	    	this.$router.push({ name: 'Detail', params: { id : item ? item.id : 0 }});
        }
    },
    computed:{
    	today:function(){//格式化日期
    		if(this.currentDate.length>0){
    			let iosdate = this.currentDate.join("/"); //解决ios不能正确转换日期
    			return Util.format(new Date(iosdate) ,'yyyy年MM月dd日');
    		}else{
    			return "";
    		}
	    },
	    workList:function(){//当天日程
	    	let day = this.currentDate[2];
	    	return this.dirayList[day-1]?this.dirayList[day-1].dirayList:[];
	    },
	    workListHeight:function(){//日程区域高度
	    	let workListHeight = 0;
	    	let workCalendar = document.getElementById("workCalendar");
	    	let workNew = document.getElementById("workNew");
	    	if(this.workList.length==0&&workCalendar){
	    		workListHeight = this.wrapperHeight - workCalendar.clientHeight - workNew.clientHeight;
	    	}
	    	return workListHeight
	    }
    },
}


</script>

