<template>
	<div class="emailDetail-wrap">
		<div>
			<div class="emailDetail-top">
				<h1>{{email.mailTitle}}</h1>
				<div class="emailDetail-send">
					<span><i>发件人：</i><i>{{email.senderUserName}}</i></span>
					<span v-if="attachUrlLength" class="attach" v-show="attachHide" @click="goAttach">{{email.attachUrl.length}}</span>
					<span class="fr" @click="onDetails" v-show="onDetailsClick">详情<b><i class="jcm-xiajiantou"></i></b></span>
					<span class="fr" @click="offDetails" v-show="offDetailsClick">隐藏<b><i class="jcm-xiajiantou_1"></i></b></span>
				</div>
				<div class="emailDetail-send" v-if="details">
					<span><i>收件人：</i><i>{{email.to}}</i></span>
				</div>
				<div class="emailDetail-send" v-if="details">
					<span><i>抄　送：</i><i>{{email.cc}}</i></span>
				</div>
				<!--<div class="emailDetail-send" v-if="details">
					<span><i>密　送：</i><i>{{email.bcc}}</i></span>
				</div>-->
				<div class="emailDetail-send" v-if="details">
					<span><i>时　间：</i><i>{{email.senderTime}}</i></span>
				</div>
				<div class="emailDetail-send" v-show="attachHide" v-if="details">
					<span class="attach" @click="goAttach"><i>附　件：</i>{{email.attachUrl.length}}</span>
				</div>
			</div>
			<div class="emailDetail-content" :style="{top: topHeight+'px'}">
				<div class="emaildetail-char2" v-html="email.mailContent">
				</div>
				<div id="attachList" class="emaildetail-attach" v-show="attachHide">
					<div>附件：</div>
					<p v-for="info in email.attachUrl">
						<a :href="info.url">{{info.attachName}}</a>
					</p>
				</div>
			</div>
		</div>
		<div class="box-bottom">
            <mt-tabbar>
                <mt-tab-item id="回复" class="pr" :class="{selected:idReplyShow}" @click.native="isShow()">
                    	回复
                    <ul class="footerfirst-list" v-show="idReplyShow">
                        <li @click="reply('all')">全部回复</li>
                        <li @click="reply()">回复</li>
                        <li>取消</li>
                    </ul>
                </mt-tab-item>
                <mt-tab-item id="转发" @click.native="transpond('repeat')">
                    	转发
                </mt-tab-item>
                <mt-tab-item id="星标" class="addStarRtx" @click.native="addStarRtx()" v-show="starRtx">
                    <i class="jcm-xingbiao"></i>星标
                </mt-tab-item>
                <mt-tab-item id="取消星标" class="deldelStarRtx" @click.native="delStarRtx()" v-show="!starRtx">
                    <i class="jcm-biaoxing"></i>取消星标
                </mt-tab-item>
                <mt-tab-item id="删除" @click.native="sheetVisible=true">
                  	 删除
                </mt-tab-item>
            </mt-tabbar>
        </div>
		<mt-actionsheet :actions="sheetData" v-model="sheetVisible" cancelText=""></mt-actionsheet>
	</div>
</template>

<script>
	import { MessageBox } from 'mint-ui';
	import { Toast } from 'mint-ui';
	export default{
		name: "jc-emaildetail",
		beforeRouteEnter(to, from, next){
			next(vm=>{
				var selected = vm.$route.query.selected;
				vm.getMailById();
				vm.attachHide = true;
				vm.idReplyShow = false;
				vm.onDetailsClick = true;
				vm.offDetailsClick = false;
			})
		},
		data(){
			return{
				email: {},
				attachUrlLength: false,
				details: false,
				onDetailsClick: true,
				idReplyShow: false,
				offDetailsClick :false,
				starRtx: true,
				attachHide: true,
				emailData :{},
				sheetVisible: false,
				sheetData: [{name: '确定删除?'}, {name: '是',method: this.delMailRtx}, {name: '否'}],
				topHeight: 0//邮件正文上边的高度
			}
		},
		methods:{
			getMailById: function(){//获取邮件详情
				let _this = this;
				if(this.$route.params && this.$route.query.id){
					_this.Api.MAIL.getMailById({
						id: _this.$route.query.id
					}).then(function(res) {
						if(res.data.code === '000000'){
							_this.$set(_this, 'email', res.data.body);
							_this.emailData = res.data.body;
							if(res.data.body.starMail==1){
								_this.starRtx = false;
							}else{
								_this.starRtx = true;
							}
							if(res.data.body.attachUrl.length){
								_this.attachUrlLength= true;
								for(var i=0;i<res.data.body.attachUrl.length;i++ ){
									res.data.body.attachUrl[i].url = _this.Api.MAIL.attachUrl(res.data.body.attachUrl[i].url);
								}
							}else{
								_this.attachHide = false;
							}
						}else{
							Toast({message: res.data.errormsg});
						}
						_this.calcHeight();
					}).catch(function(error) {});
				}
			},
			reply(type){//回复邮件
				this.emailData.type = true;
				var str = JSON.stringify(this.emailData);
　　			  	//存入
　　			   	window.sessionStorage.setItem('replyData',str);
				this.$router.push({ path: '/compose', query: { plan: type }});
			},
			isShow(){//控制回复菜单
				this.idReplyShow=!this.idReplyShow;
			},
			onDetails(){//显示详情
				let _this = this;
				_this.details = true;
				_this.onDetailsClick = false;
				_this.offDetailsClick = true;
				_this.attachUrlLength= false;
				_this.calcHeight();
			},
			offDetails(){//隐藏详情
				let _this = this;
				_this.details = false;
				_this.onDetailsClick = true;
				_this.offDetailsClick = false;
				_this.attachUrlLength= true;
				_this.calcHeight();
			},
			transpond(type){//转发
				this.emailData.type = true;
				var str = JSON.stringify(this.emailData);
　　			   	//存入
　　			   	window.sessionStorage.setItem('replyData',str);
				this.$router.push({ path: '/compose', query: { repeat: type }});
			},
			addStarRtx(){//星标邮件
				let _this = this;
				_this.Api.MAIL.addStarRtx(
					_this.emailData.id
					).then(function(res) {
						if(res.data.code === '000000' && res.data.body ==='1'){
							_this.starRtx = false;
						}
				})
			},
			delStarRtx(){//删除星标
				let _this = this;
				_this.Api.MAIL.delStarRtx(
					_this.emailData.id
					).then(function(res) {
						if(res.data.code === '000000' && res.data.body ==='1'){
							_this.starRtx = true;
						}
				})
			},
			delMailRtx(){//删除邮件
				let _this = this;
				if(_this.$route.query.selected==="5"){
					_this.selected = 1;
				}else{  
					_this.selected = 0;
				}
				_this.Api.MAIL.delMailRtx(
					_this.emailData,_this.selected
				).then(function(res) {
					if(res.data.code === '000000'){
						Toast('删除成功');
						_this.$router.replace({ path: '/mail/home', query: { selected: _this.$route.query.selected }});
					}else{
		           		Toast(res.data.errormsg);
		           	}
				})
			},
			goAttach(){//点击附件图标跳转到附件列表
				document.querySelector("#attachList").scrollIntoView(true)   
			},
			calcHeight(){//计算邮件正文距离上边框的高度
				this.$nextTick(function () {
			        this.topHeight = document.querySelector(".emailDetail-top").clientHeight;
			    })
			}
		},
	}
</script>