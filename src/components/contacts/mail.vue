<template>
	<div>
		<mt-field label="收件人" v-if="isShow">
			<mt-cell :title="user.displayName" :key="user.id" v-for="user in user1"></mt-cell>
			<img src="./images/check.png" height="20px" width="20px" @click="goContacts(1)">
		</mt-field>
		<mt-field label="抄送" v-if="isShow">
			<mt-cell :title="user.displayName" :key="user.id" v-for="user in user2"></mt-cell>
			<img src="./images/check.png" height="20px" width="20px" @click="goContacts(2)">
			<!--<router-link to="contacts" style="text-decoration: none;">-->
			<!--</router-link>-->
		</mt-field>
		<mt-field label="收件人pop1" v-if="!isShow">
			<mt-cell :title="user.displayName" :key="user.id" v-for="user in user1"></mt-cell>
			<img src="./images/check.png" height="20px" width="20px" @click="goPopup(1)">
		</mt-field>
		<mt-field label="收件人pop2" v-if="!isShow">
			<mt-cell :title="user.displayName" :key="user.id" v-for="user in user2"></mt-cell>
			<img src="./images/check.png" height="20px" width="20px" @click="goPopup(2)">
		</mt-field>
		<mt-field label="主题" v-model="content" v-if="!isShow">
		</mt-field>

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
	  		:isSingle="isSingle" 
	  		:selectedUser="selectedUser" 
	  		@onSubmit="onSubmit"
	  		@onHiden="onHiden"
	  		v-if="popupVisible" >
    	</contacts>
    </contacts>
    </div>
</template>

<script>
import Vue from 'vue';
import Contacts from "@/components/contacts/index.vue";
//  history.pushState(null, null, document.URL);
//  window.addEventListener('popstate', function () {
//  	console.log("location: " + document.location + ", state: " + JSON.stringify(event.state));
//  	debugger;
//          history.pushState(null, null, document.URL);
//  }); 	
export default {
	components: {
        Contacts
    },
	data(){return {
			index:1,
			selectedUser:[],
			user1:[],
			user2:[],
			content:"",
			isShow:false,
			isSingle:false,
			popupVisible:false
	    }
	},
	methods:{
		goContacts(index){
			if(index==1){
				this.$router.push({ name: 'Contacts', params: { id:100001,model:'user1',data:this.user1,isSingle:false }});
			}else{
				this.$router.push({ name: 'Contacts', params: { id:100001,model:'user2',data:this.user2,isSingle:true }});
			}
		},
		goPopup(index){
			this.index=index;
			if(index==1){
				this.selectedUser = this.user1;
			}else{
				this.selectedUser = this.user2;
			}
			this.popupVisible=true;
		},
		addUser(selected){
			let _this = this;
			if(selected.model=="user1"){
				_this.user1 = [];
	  			if(selected.data){
	  				_this.user1 = selected.data;
	  			}
			}else{
				_this.user2 = [];
	  			if(selected.data){
	  				_this.user2 = selected.data;
	  			}
			}
  			
		},
		onSubmit(selected){
			this.popupVisible=false;
			if(this.index==1){
				this.user1 = selected;
			}else{
				this.user2 = selected;
			}
		},
		onHiden(){
			this.popupVisible=false;
		}
	},
	beforeRouteEnter (to, from, next) {
  		console.log('beforeRouteEnter mail',to.params);
    	next((vm) => {
    		vm.addUser(to.params);
    		vm.popupVisible = false;
        })
  	},
  	beforeRouteUpdate (to, from, next) {
  		console.log('beforeRouteUpdate mail');
    	next();
  	},
  	beforeRouteLeave (to, from, next) {
  		console.log('beforeRouteLeave mail',to, from);
  		if(from.name=='Contacts'){
  			this.popupVisible=false;
  			next(false);
  		}else{
  			next();
  		}  	
  	}
}
</script>

<style>
	.mint-field .mint-cell-title{
		width: 60px;
	}
	.mint-field-other{
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}
	.mint-field-other .mint-cell-title{
		width: 45px;
	}
</style>
