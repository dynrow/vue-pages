<template>
	<div class="contacts">
		<div id="search" class="search" v-show="showSearch">
			<span class="checkbox" :class="{checked:isCheckAll}" @click.stop="onCheckAll" v-if="hasCheck&&!isSingle" >
				<label></label>
			</span>
			<span class="checkall" @click.stop="onCheckAll" v-if="hasCheck&&!isSingle" v-show="!isSearch">全选</span>
			<div class="mint-searchbar">
		        <div class="mint-searchbar-inner">
		            <i class="mintui mintui-search"></i> 
		            <input type="search" v-model.trim="keyword" placeholder="搜索" class="mint-searchbar-core">
		        </div> 
		    </div>
		</div>
		<div class="list" :style="'height:'+ listHeight +'px'" v-if="!isSearch">
	    	<ul>
	    		<li v-for="item in showDept" @click.stop="getDeptData(item.id)">
	    			<div>
	    				<span class="checkbox" :class="{checked:item.isChecked}" :value="item.id" @click.stop="onCheckDept(item)" v-if="hasCheck&&!isSingle">
	    					<label></label>
	    				</span>
	    				<a>
	    					<div>
			    				<img :src="deptImg" width="50" height="50">
			    				<span>{{item.name}}</span>
		    				</div>
		    				<span class="jcm-arrows"></span>
	    				</a>
    				</div>
	    		</li>
	    		<li v-for="item in showUser" @click.stop="onCheckUser(item)">
	    			<div>
	    				<span class="checkbox" :class="{checked:item.isChecked}" :value="item.id" v-if="hasCheck">
	    					<label></label>
	    				</span>
	    				<a>
		    				<img :src="item.photo?item.photo:userImg" width="50" height="50">
		    				<span>{{item.displayName}}</span>
	    				</a>
    				</div>
	    		</li>
	    	</ul>
	    	<slot name="total">
	    		<div :text="total" class="total">共{{total}}人</div>
	    	</slot>
    	</div>
    	<div class="list" :style="'height:'+ listHeight +'px'" v-if="isSearch">
	    	<ul>
	    		<li v-for="item in searchList" @click.stop="onCheckResult(item)">
	    			<div>
	    				<span class="checkbox" :class="{checked:item.isChecked}" :value="item.id" v-if="hasCheck">
	    					<label></label>
	    				</span>
	    				<img :src="item.photo" width="50" height="50">
	    				<span>{{item.displayName}}</span>
    				</div>
	    		</li>
	    	</ul>
    	</div>
    	<div id="selected" class="selected" v-if="showSelectedUser.length>0">
    		<ul>
    			<li v-for="item in showSelectedUser" @click="onRemove(item)">
    				<img :id="item.id" :src="item.photo?item.photo:userImg" width="50" height="50">
	    		</li>
    		</ul>
    		<slot name="button">
    			<span @click="onSubmit">确定({{showSelectedUser.length}})</span>
    		</slot>
    	</div>
	</div>
</template>

<script>
import { Toast } from 'mint-ui';
//import $ from 'jquery';
import deptImg from  './images/dept.png';
import userImg from  './images/userImg.png';

const supportsPushState = (function() {
    const ua = window.navigator.userAgent
    if ((ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) &&
        ua.indexOf('Mobile Safari') !== -1 &&
        ua.indexOf('Chrome') === -1 &&
        ua.indexOf('Windows Phone') === -1) {
        return false
    }
    return window.history && 'pushState' in window.history
})()

const jcalldept = "jc-all-dept";
var _sessionStorage = {
	set(key,value){
		sessionStorage.setItem(key,JSON.stringify(value));
	},
	get(key){
		return JSON.parse(sessionStorage.getItem(key));
	}
}

export default { 
	name:'contacts', 
	props: {
		'hasCheck':{//是否显示checkbox
            type: Boolean,
            default: true
        },
        'isSingle':{//是否单选
            type: Boolean,
            default: false
        },
        'selectedUser':{//已选用户
        	type: Array,
        	default: function () {
		        return []
		    }
        },
        'selectedDept':{//已选部门
        	type: Array,
        	default: function () {
		        return []
		    }
        },
        'optionUser':{//可选用户
        	type: Array,
        	default: function () {
		        return []
		    }
        }
    },
	data(){
		return {
			keyword: "",//查询关键字
			deptImg: deptImg,//部门图片
			userImg: userImg,//用户默认头像
			deptId: 0,//当前部门id
			searchList: [],//查询列表
	    	userList: [],//用户列表
	    	deptList: [],//部门列表
	    	total: 0,//部门下人数
	    	isSearch: false,//是否查询
	    	showSearch: true,//是否显示查询框
	    	historyList:[],//记录组件内历史路径
	    	deptMap: new Map(),//部门列表
	    	deptIdSet: new Set(),//记录访问过的部门id
	    	timer:null,//节流函数
	    	listHeight: 0
	    }
	},
  	methods:{
  		getAllDept(){//查询所有部门
  			let _this = this;
			let deptListStorage = _sessionStorage.get(jcalldept);
			if(deptListStorage&&deptListStorage.length>0){
				_this.deptList = deptListStorage;
				_this.echoSelected();
				return;
			}
			_this.Api.CONTACTS.getAllDept().then(function(res) {
  				if(res.data.code === '000000'){
  					res.data.body.forEach(function(element) {
  						let tmp = {
		  					"id":element.id,
		  					"name":element.name,
		  					"pId":element.parentId,
		  					"type":element.deptType,
		  					"isChecked":false,
		  					"total":element.userCount
		  				};
  						_this.deptList.push(tmp);
  					});
  					
  					_this.deptList.forEach(function(element) {// 生成部门path
  						let pId = element.pId;
						let path = element.id + ",";
						while(pId != 0){
							path += pId + ",";
							pId = _this.getParentId(pId);
						}
						element.path = path;
						_this.deptMap.set(element.id,element);
  					});
  					
  					_sessionStorage.set(jcalldept,_this.deptList);
  					
			  		_this.echoSelected();
	           	}else{
	           		Toast({message: res.data.errormsg});
	           	}
	        }).catch(function(error) {
	        	Toast({message: '请求失败......'});
	        });
  		},
  		getDeptData(id){//根据部门id获取下一级数据
  			let _this = this;
  			_this.deptId = id || 100001;
  			_this.historyList.push(_this.deptId);
  			if(_this.deptIdSet.has(_this.deptId)){//确保一个部门只通过网络访问一次
  				return;
  			}
  			_this.deptIdSet.add(_this.deptId);
			_this.Api.CONTACTS.getDeptData(this.deptId).then(function(res) {
  				if(res.data.code === '000000'){
		  			//部门通过getAllDept一次获取
		  			//res.data.body.departments.forEach(function(element) {
					//});
		  			let isChecked = false;
					res.data.body.users.forEach(function(element) {
						let index = _this.indexArr(_this.userList,element);
						if(index==-1){
							let tmp = {
			  					"id":element.id,
			  					"displayName":element.displayName,
			  					"photo":element.photo?_this.Api.CONTACTS.convertUrl(element.photo):userImg,
			  					"deptId":element.deptId,
			  					"duty":element.dutyIdValue,
			  					"isChecked":isChecked
			  				};
			  				_this.userList.push(tmp);
						}				
					});
					_this.total = res.data.body.userCount;
	           	}else{
	           		Toast({message: res.data.errormsg});
	           	}
	        }).catch(function(error) {
	            Toast({message: '请求失败......'});
	        });
  		},
  		getUsers(item){//根据部门id获取所有用户
  			let _this = this;
  			_this.Api.CONTACTS.getUsers(item.id).then(function(res) {
				if(res.data.code === '000000'){
	        		if(item.isChecked){
	        			res.data.body.forEach(function(element) {
	        				let index = _this.indexArr(_this.userList,element);
	        				if(index==-1){
		        				let tmp = {
				  					"id":element.id,
				  					"displayName":element.displayName,
				  					"photo":element.photo?_this.Api.CONTACTS.convertUrl(element.photo):userImg,
				  					"deptId":element.deptId,
				  					"duty":element.dutyIdValue,
				  					"isChecked":true
				  				};
				  				_this.userList.push(tmp);
			  				}else{
			  					_this.userList[index].isChecked = true;
			  				}
	  					})
		  			}else{
		  				res.data.body.forEach(function(element) {
		  					let index = _this.indexArr(_this.userList,element);
	        				if(index!=-1){
				  				_this.userList[index].isChecked=false;
			  				}
	  					})
		  			}
	    		}else{
	           		Toast({message: res.data.errormsg});
	           	}
	        }).catch(function(error) {
	            Toast({message: '请求失败......'});
	        });	
  		},
  		getUsersByName(keyword){//根据关键字查询用户
  			let _this = this;
			_this.Api.CONTACTS.getUsersByName(keyword).then(function(res) {
  				if(res.data.code === '000000'){
  					_this.searchList = [];
					res.data.body.forEach(function(element) {
						let isChecked = false;
						let index = _this.indexArr(_this.userList,element);
						if(index!=-1){
							isChecked = _this.userList[index].isChecked;
						}
		  				_this.searchList.push({
		  					"id":element.id,
		  					"displayName":element.displayName,
		  					"photo":element.photo?_this.Api.CONTACTS.convertUrl(element.photo):userImg,
		  					"deptId":element.deptId,
		  					"duty":element.dutyIdValue,
		  					"isChecked":isChecked
		  				});
					});
	           	}else{
	           		Toast({message: res.data.errormsg});
	           	}
	        }).catch(function(error) {
	            Toast({message: '请求失败......'});
	        });
  		},
  		onCheckDept(item){//部门选中、部门取消
  			item.isChecked = !item.isChecked;
  			this.deptList.forEach(function(element){
  				if(element.path.indexOf(item.id+",")!=-1){
  					element.isChecked = item.isChecked;
  				}
  			})
  			this.getUsers(item);						
  		},
  		onCheckUser(item){//人员选中、人员取消
  			item.isChecked = !item.isChecked;
  			this.onSingle(item);
  		},
  		onCheckResult(item){//查询结果 人员选中、人员取消
  			item.isChecked = !item.isChecked;
  			let index = this.indexArr(this.userList,item);
			if(index==-1){
				this.userList.push(item);
			}else{
				this.userList[index].isChecked = item.isChecked;
			}
			this.onSingle(item);
			this.changeDeptChecked(item);
  		},
  		onCheckAll(){//点击全选
  			let _this = this;
  			let check = _this.isCheckAll;
  			_this.showDept.forEach(function(element) {
  				element.isChecked=!check;
  				_this.getUsers(element);		
			});
			_this.showUser.forEach(function(element) {
  				element.isChecked=!check;
			});
  		},
  		onRemove(item){//删除选中人员
  			item.isChecked = !item.isChecked;
			this.changeDeptChecked(item);
  		},
  		changeDeptChecked(item){//取消对应部门的选中状态
			let userDept = {};//用户所属部门
			this.deptList.forEach(function(element){
				if(element.id==item.deptId){
					userDept = element;
				}
			})
			this.deptList.forEach(function(element){
				if(userDept.path.indexOf(element.id+",")!=-1){
					element.isChecked = false;
				}
			})
  		},
  		indexArr(arr,item){//返回数组对象的索引值
  			for(var i=0; i<arr.length; i++){
				if(arr[i].id===item.id){
					return i;
				}
			}
  			return -1;
  		},
  		getParentId(deptId){//获取部门的上级部门id
  			for (var dept of this.deptList) {
				if(dept.id == deptId){
					return dept.pId;
				}
			}
			return 0;
  		},
  		onSubmit(){//确定方法
			let users = this.showSelectedUser;
			let depts = this.showSelectedDept;
			this.$emit("onSubmit", users, depts);
			$(window).off(supportsPushState ? 'popstate.jc' : 'hashchange.jc');
			window.history.go(-1);
		},
		onSingle(item){//单选处理
			if(this.isSingle&&item.isChecked){
  				for(let user of this.showSelectedUser){
  					if(user.id!=item.id){
  						user.isChecked = false;
  					}
  				}
  				if(this.isSearch){//查询结果
  					for(let user of this.searchList){
	  					if(user.id!=item.id){
	  						user.isChecked = false;
	  					}
	  				}
  				}
  			}
		},
		onBack(){//返回、后退处理
			let _this = this;
			history.pushState(null, null, document.URL);
			$(window).on(supportsPushState ? 'popstate.jc' : 'hashchange.jc', (e) => {
	            e && e.preventDefault();
	            if(_this.historyList.length>1){
					_this.historyList.pop();
		  			_this.deptId = _this.historyList[_this.historyList.length-1];
		  			history.pushState(null, null, document.URL);
		  		}else{
		  			this.$emit("onHiden");
	  				$(window).off(supportsPushState ? 'popstate.jc' : 'hashchange.jc');
		  		}
	            return;
	        })
		},
		echoSelected(){//多选回显用户后部门处理
			let _this = this;
			if(_this.selectedUser.length>0&&!_this.isSingle){
				_this.deptList.forEach(function(parent) {// 生成部门子部门
					parent.subDept = [];//当前部门total包含的部门id
					_this.deptList.forEach(function(child) {
						if(child.path.indexOf(parent.id+",")!=-1){
							parent.subDept.push(child.id);
						}
					});
				});
				
				let deptUserCount = new Map;//已选的部门对应的人数
	  			_this.selectedUser.forEach(function(user){
	  				let count = deptUserCount.get(user.deptId);
					if(count===undefined){
						deptUserCount.set(user.deptId,1);
					}else{
						deptUserCount.set(user.deptId,++count);
					}
	  			})
	  			
	  			_this.deptList.forEach(function(dept){
	  				if(dept.total>0&&dept.total<=_this.selectedUser.length){
	  					let total= 0;
	  					dept.subDept.forEach(function(deptId){
	  						let count = deptUserCount.get(deptId);
	  						if(count===undefined){
	  							count = 0;
	  						}
	  						total += count;
	  					})
	  					if(dept.total === total){
	  						dept.isChecked = true;
	  					}
	  				}
	  			})
	  		}
		},
	    calcHeight(){//计算list的高度
	    	this.$nextTick(function () {
			    let winHeight = window.innerHeight;//窗口高度
	    		let headerHeight = document.querySelector("header") ? document.querySelector("header").clientHeight : 0;//header高度
	    		let searchHeight = this.showSearch ? document.querySelector("#search").clientHeight : 0;//查询条高度
	    		let selectedHeight = this.showSelectedUser.length>0 ? document.querySelector("#selected").clientHeight : 0;//已选用户高度
	    		this.listHeight =  winHeight - headerHeight - searchHeight - selectedHeight;
			})
    	}
  	},
    watch:{
    	keyword:function (val, oldVal) {//监听查询关键字
    		let _this = this;
    		if(val.length>0){
    			clearTimeout(_this.timer);
	            _this.timer = setTimeout(function(){
	               _this.getUsersByName(val);
	            },300);
    			_this.isSearch = true;
    		}else{
    			_this.searchList = [];
    			_this.isSearch = false;
    		}
	    },
	    showSelectedUser:function(val, oldVal){
	    	if(val.length != oldVal.length && (val.length==0 || oldVal.length==0)){
	    		this.calcHeight();
	    	}
	    }
    },
    computed:{
    	isCheckAll:function(){//当前页是否全选
    		let isCheckAll = true;
    		if(this.showDept.length==0&&this.showUser.length==0){
    			isCheckAll = false;
    		}
    		if(isCheckAll){
				this.showDept.forEach(function(element) {
				    if(!element.isChecked){
				        isCheckAll = false;
				        return;
				    };
				});
			}
			if(isCheckAll){
			    this.showUser.forEach(function(element) {
			        if(!element.isChecked){
			            isCheckAll = false;
			            return;
			        };
			    });
			}
			//父级部门选中状态调整
			let index = this.indexArr(this.deptList,{id:this.deptId});
			if(index!=-1){
				this.deptList[index].isChecked = isCheckAll;
			}
    		return isCheckAll;
    	},
    	showDept:function(){//页面显示的部门
    		let _this = this;
    		return this.deptList.filter(function(item){  
				return item.pId == _this.deptId;
			})
    	},
    	showUser:function(){//页面显示的用户
    		let _this = this;
    		return this.userList.filter(function(item){
				return item.deptId == _this.deptId;
			})
    	},
    	showSelectedUser:function(){//页面显示的选中用户
    		let _this = this;
    		return this.userList.filter(function(item){
				return item.isChecked;
			})
    	},
    	showSelectedDept:function(){//页面显示的选中部门
    		let _this = this;
    		return this.deptList.filter(function(item){
				return item.isChecked;
			})
    	}
    },
    mounted() {
  		let _this = this;
  		_this.userList = [];
  		
  		if(_this.selectedUser.length>0){//回显已选用户
			_this.userList = _this.selectedUser;
		}
  		
  		if(_this.optionUser.length>0){
  			_this.optionUser.forEach(function(element){
  				let index = _this.indexArr(_this.userList,element);
				if(index==-1){
					let tmp = {
	  					"id":element.id,
	  					"displayName":element.name,
	  					"photo":element.photo?_this.Api.CONTACTS.convertUrl(element.photo):userImg,
	  					"deptId":"",
	  					"duty":"",
	  					"isChecked":false
	  				};
	  				_this.userList.push(tmp);
				}	
			})
			_this.total=_this.optionUser.length;
			_this.showSearch = false;
  		}else{
  			_this.getAllDept();
    		_this.getDeptData();
  		}
  		
  		_this.onBack();
  		_this.calcHeight();
  		window.onresize = _this.calcHeight;
  	}
}

</script>

<style lang="scss">
    @import '../../assets/sass/base';
	html, body{
		margin: 0;
	    padding: 0;
	    width: 100%;
	    height: 100%;
	    font-size: 18px;
	    display: -webkit-flex;
	  	display: flex;
	  	min-height: 100vh;/*1vh表示浏览器高度的1%，100vh为浏览器高度，感觉这个挺好的*/
	  	/* min-height: 100%;另一种写法 */
	  	flex-direction: column;
	}
	
	.contacts {
		position: fixed;
		top: 0;
		left: 0;
		height: 100%;
		width: 100%;
		background-color: #fff;
		z-index: 5000;
		
		.checkbox {
			width: 22px;
			height: 22px;
			position: relative;
			margin-left: 15px;
		}
		
		.checkbox label{
			width: 20px;
			height: 20px;
			position: absolute;
			top: 0;
			left: 0;
			border: 1px solid #9DA5BE;
			background: #ffffff;
			border-radius: 11px;
		} 
		.checkbox label:after{
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
		.checkbox.checked label{
			border: 1px solid #4E8DFF;
			background: #4E8DFF;
		}
		.checkbox.checked label:after {
			opacity: 1;
		}
		.jcm-arrows{
			font-size: 20px;
			color: #9DA5BE;
			margin-right: 15px;
		}
		.arrow{
			width: 10px;
			height: 10px;
			position: relative;
			margin-right: 15px;
		}
		.arrow:before{
			content: '';
			width: 12px;
			height: 12px;
			position: absolute;
			right: 2px;
			border: 2px solid #9DA5BE;
			border-top: none;
			border-left: none;
			background: transparent;
			transform: rotate(-45deg);
		}
		.search{
			height: 70px;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			background-color: #eee;
		}
		.checkall{
			color: #999999;
			margin-left: 15px;
			white-space: nowrap;
		}
		.mint-searchbar{
	    	background-color: #eee;
	    	padding: 0;
	    	margin: 0 15px;
	    	width: 100%;
	    }
	    .mint-searchbar-inner{
	    	height: 40px;
	    }
	    .mint-searchbar-inner .mintui-search{
	    	font-size: 18px;
	    	color: #9e9e9e;
	    	margin: 0 8px;
	    }
		.list {
	    	overflow-y: scroll;
	    	-webkit-overflow-scrolling: touch;
	    }
	    .list ul li {
	    	height: 75px;
	    	padding: 0px;
	    	border-bottom: 1px solid #e2e2e2;
	    	display: flex;
	    	align-items: center;
	    }
	    .list ul li div,.list ul li a {
	    	display: flex;
	    	align-items: center;
	    	width: 100%;
	    }
	    .list ul li > span {
	    	margin-right: 10px;
	    }
	    .list ul li input, .list ul li img, .list ul li span {
	    	margin-left: 15px;
	    }
	    .total {
	    	text-align: center;
	    	font-size: 14px;
	    	margin: 0 auto;
	    	padding: 12px;
	    }
	    .selected {
	    	position: fixed;
	    	left: 0;
		    bottom: 0;
		    height: 75px;
		    width: 100%;
	    	display: flex;
	    	flex-direction: row;
	    	justify-content: flex-start;
	    	align-items: center;
	    	background-color: #f3f3f3;
	    }
	    .selected ul{
	    	display: flex;
	    	width: 77%;
	    	overflow: auto;
	    	margin-left: 5px;
	    }
	    .selected ul li{
	    	height: 50px;
	    	width: 50px;
	    	margin-left: 5px;
	    }
	    .selected span{
	    	color: #4e8dff;
	    	text-align: center;
	    	margin: 0 auto;
	    }
	    
	    .list::-webkit-scrollbar {width: 0px;height: 0px;}
	    .selected ul::-webkit-scrollbar {width: 0px;height: 0px;}
	}
</style>
