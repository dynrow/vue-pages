<template>
<div @click="ccbccHide()" class="compose">
    <div class="userlist">
        <ul>
            <li>
                <div @click.stop="goContacts(1)">
                    <span>收件人：</span>
                    <div>
                        <a v-for="(userObj,userIndex) in user1" :key="userObj.id" @click.stop="removeUser(1,userIndex)" >
                        	{{userObj.displayName}}<i class="jcm-guanbi"></i>
                        </a>
                    </div>
                    <i class="jcm-jiahao cutImg" @click.stop="goContacts(1)"></i>
                </div>
            </li>
            <li @click.stop="ccbcc()" v-show="copyto">
                <div>
                    <span class="w-p100">抄送/密送：</span>
                </div>
            </li>
            <li v-show="!copyto">
                <div @click.stop="goContacts(2)">
                    <span>抄送：</span>
                    <div v-model="sendMail.cc"> 
                        <a v-for="(userObj,userIndex) in user2" :key="userObj.id" @click.stop="removeUser(2,userIndex)">
                        	{{userObj.displayName}}<i class="jcm-guanbi"></i>
                        </a>
                    </div>
                    <i class="jcm-jiahao cutImg" @click.stop="goContacts(2)"></i>
                </div>
            </li>
            <li v-show="!copyto">
                <div @click.stop="goContacts(3)">
                    <span>密送：</span>
                    <div v-model="sendMail.bcc">
                        <a v-for="(userObj,userIndex) in user3" :key="userObj.id" @click.stop="removeUser(3,userIndex)">
                        	{{userObj.displayName}}<i class="jcm-guanbi"></i>
                        </a>
                    </div>
                    <i class="jcm-jiahao cutImg" @click.stop="goContacts(3)"></i>
                </div>
            </li>
            <li>
                <div>
                    <span>主题：</span>
                    <div>
                        <input type="text" class="theme" v-model="sendMail.mailTitle" maxlength="80"/>
                    </div>
                    <Uploader class="w50" :options="uploaderOptions"></Uploader>  
                    <label class="blueCol" v-show="files.length">{{files.length}}</label>
                </div>
            </li>
        </ul>
    </div> 
    <div class="mail-content">
    	<div class="mail-text">
    		<textarea placeholder="请输入邮件正文" 
    			v-model="sendMail.mailContent" 
    			maxlength="10000" >
    		</textarea>
    	</div>
	    <!--<div placeholder="请输入正文" @click.stop="toFocus" class="textarea" ref="textCon" contenteditable="true" @input="checkLength"></div>-->
	    <div class="allCon" v-if="allCon">
	        <div ref="textCons" class="textarea" contenteditable="true">
	            <div>--------------原始邮件--------------</div>
	            <div class="allConTitle">
	                <p><strong>发件人：</strong>{{replyItem.senderUserName}}</p>
	                <p><strong>发送时间：</strong>{{replyItem.senderTime}}</p>
	                <p><strong>收件人：</strong>{{replyItem.to}}</p>
	                <p v-if="replyItem.cc"><strong>抄送：</strong>{{replyItem.cc}}</p>
	                <p><strong>主题：</strong>{{replyItem.mailTitle}}</p>
	                <p><strong>内容：</strong></p>
	                <div v-html="replyItem.mailContent"></div>
	            </div>
	        </div>
	    </div>
	    
	    <div class="picList" v-show="files.length">
	        <ul>
	            <li v-for="info in files" :key="info.id">
	                <img :src="info.url"  width="60px" height="60px" />
	                <a class="deleteId" @click="deleteId(info.id)"><i class="jcm-times"></i></a>
	            </li>
	        </ul>
	    </div>
    </div>
    <!--<div class="sendBtn" :style="{bottom: files.length ? '90px' : '10px'}">
        <mt-button type="primary" disabled v-if="!isSendAble">发送</mt-button>
        <mt-button type="primary" @click="sendValid" v-else>发送</mt-button>
    </div>-->
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
        v-if="userVisible" >
    </contacts>
    <mt-actionsheet :actions="sheetData" v-model="sheetVisible" cancelText="取消"></mt-actionsheet>
    <mt-actionsheet :actions="sendData" v-model="sendVisible" cancelText=""></mt-actionsheet>
</div>
</template>
<script>
//使用状态管理
import {mapState} from 'vuex';
import { Toast } from 'mint-ui';
import Uploader from '@/components/uploader';
import jcmp from '@/libs/jcmp.js';
import config from '../../../../../config';
import Contacts from "@/components/contacts/index.vue";
export default {
    name: 'compose',
    beforeRouteEnter(to, from, next){
		next(vm=>{
			vm.sendBtnText("发送");
			var replyData = window.sessionStorage.getItem('replyData');
            vm.sendMail.mailContent ="";
            vm.user1=[];
            vm.user2=[];
            vm.user3=[];
            vm.copyto = true;
            vm.allCon = false;
            var selected = vm.$route.query.selected;
            //草稿进入编辑页面
            if(selected == 4){
                vm.getDraft();
//              vm.replyCon = false;
//              vm.replyTitle = true;
//              vm.transpond = false;
            }else if(replyData){//缓存
                replyData = JSON.parse(replyData);
                vm.replyItem = replyData;
                var repeat = vm.$route.query.repeat;
                
                if(repeat){//转发
//                  vm.replyCon = false;
//                  vm.replyTitle = false;
                    vm.allCon = true;
//                  vm.transpond = true;
                    vm.sendMail.mailTitle = '转发：' + vm.replyItem.mailTitle;
                }else{
                	var plan = vm.$route.query.plan;
                	let userNames = replyData.senderUserName;
	                let userIds = replyData.senderUserId;
	                //目前缺少头像和部门id
	                vm.user1.push({
	                    id:userIds,
	                    displayName:userNames,
	                    photo:"",
	  					deptId:"",
	                    isChecked:true
	                });
                    //全部回复
                    if(plan){
                        if(replyData.ccIds){
                            let ccUserIds = replyData.ccIds.split(',');
                            let ccUserNames = replyData.cc.split(',');
                            for(let i=0;i<ccUserIds.length;i++){
                                vm.user1.push({
                                    id:ccUserIds[i],
                                    displayName: ccUserNames[i],
                                    isChecked:true
                                });
                            }
                        }                        
                    }
//                  vm.replyCon = false;
//                  vm.replyTitle = true;
                    vm.allCon = true;
//                  vm.transpond = false;
                    vm.sendMail.to = vm.replyItem.to;
//                  vm.sendMail.mailContent = vm.replyItem.mailContent;
                    vm.sendMail.mailTitle = '回复：' + vm.replyItem.mailTitle;
                }
            }else{
                vm.sendMail = {
                    userId: '',//登录人id
                    to:'' ,//收件人id，多个id间用逗号隔开
                    cc:'',//抄送id，多个id间用逗号隔开
                    bcc:'',//密送人id，多个id间用逗号隔开
                    fileids:'',//附件id，多个id间用逗号隔开
                    delattachIds:'',//删除的附件id，多个id间用逗号隔开
                    mailContent:'',//邮件内容
                    mailTitle:''//邮件标题
                };
                vm.replyItem = {};
                vm.files = [];
//              vm.replyCon = true;
//              vm.replyTitle = false;
//              vm.transpond = false;
            }
            vm.oldDiffData = Object.assign({} ,vm.sendMail);
		})
	},
    components: {
        Uploader,
        Contacts
    },
    data(){
        let _this = this;
        return {
            index:1,//人员选择树 用户索引
            isSingle:false,//人员选择树 是否单选
            userVisible:false,//人员选择树 是否显示
            selectedUser:[],//人员选择树 已选用户
            user1: [],
            user2: [],
            user3: [],
            files: [],
            replyItem: {},
//          replyCon: true,
//          replyTitle : false,
            allCon: false,//全部回复
//          transpond: false,//转发
            copyto: true,//显示抄送、密送
            sheetVisible: false,//保存提示
			sheetData: [{name: '是否保存草稿?'}, {name: '是',method: this.saveDraft}, {name: '否',method: this.onCancel}],
			sendVisible: false,//主题提示
			sendData: [{name: '邮件主题为空，是否继续?'}, {name: '是',method: this.send}, {name: '否'}],
            uploaderOptions: {//附件参数
                headers: {
                    'client_app_id': jcmp._appId(),
                    'client_device_id': jcmp._deviceId(),
                    'access_token': jcmp._jcmpToken()
                },
                formData: {
                    businessId : 1,
                    businessTable : 'table',
                    category: 'category1',
                },
                targetHandler: (file)=>{
                    
                },
                style: 'jcimg',
		        label: '<i class="jcm-fujian"></i>',
                //server: 'http://192.168.140.14:9580/jcmp/gateway/api/v1/emailUpload',
                server: config.build.server + '/gateway/api/v1/saveAttach',
                targetHandler(file){
                    if(file.ext == "jpg" || file.ext == "jpeg" || file.ext == "gif" || file.ext == "png" || file.ext == "bmp" || file.ext == "svg"){
                        file.url = file.url;
                    }
                    else if(file.ext == "doc" || file.ext == "docx"){
                        file.url = require('../../images/01-doc.png');
                    }
                    else if(file.ext == "ppt"){
                        file.url = require('../../images/02-ppt.png');
                    }
                    else if(file.ext == "xls" || file.ext == "xlsx"){
                        file.url = require('../../images/03-xls.png');
                    }
                    else if(file.ext == "zip" || file.ext == "rar"){
                        file.url = require('../../images/04-yasuobao.png');
                    }
                    else if(file.ext == "pdf"){
                        file.url = require('../../images/05-pdf.png');
                    }
                    else if(file.ext == "txt"){
                        file.url = require('../../images/07-txt.png');
                    }
                    else{
                        file.url = require('../../images/08-else.png');
                    }
                    _this.files.push(file);
                }
            },
            sendMail: {//邮件内容
                userId: '',//登录人id
                to:'' ,//收件人id，多个id间用逗号隔开
                cc:'',//抄送id，多个id间用逗号隔开
                bcc:'',//密送人id，多个id间用逗号隔开
                fileids:'',//附件id，多个id间用逗号隔开
                delattachIds:'',//删除的附件id，多个id间用逗号隔开
                mailContent:'',//邮件内容
                mailTitle:''//邮件标题
            }
        }
    },
    methods:{
        ccbcc(){//显示抄送、密送
           this.copyto = false;
        },
        ccbccHide(){//隐藏抄送、密送
            if(!this.copyto){
                if(!this.user2.length && !this.user3.length){
                    this.copyto = true;
                }
            }
        },
        sendValid(){//邮件发送前校验
        	if(this.sendMail.to.length==0&&this.sendMail.cc.length==0&&this.sendMail.bcc.length==0){//校验收件人、抄送人、密送人
                Toast({
                    message: '请填写收件人后再发送',
                    duration: 5000
                });
                return;
            }
        	if(this.sendMail.mailTitle.length==0){//校验主题
        		this.sendVisible = true;
        		return;
        	}
        	this.send();
        },
        send(){//发送邮件
            let _this = this;
//          var textCon = _this.$refs.textCon.innerHTML;
//          if(_this.allCon){
//              var textCons = _this.$refs.textCons.innerHTML;
//              var text = textCon + textCons;
//          }else{
//              var text = textCon;
//          }
			if(_this.allCon){
            	_this.sendMail.mailContent += _this.$refs.textCons.innerHTML;
           	}
            _this.Api.MAIL.sendMail(
                _this.sendMail
            ).then(function(res) {
                if(res.data.code === '000000'){
                    _this.$router.replace({ path: '/home', query: { selected: '5', sendTo: true }});
                }
                Toast('发送成功');
            });
        },
        deleteId(fileId){//删除附件
            let index = -1;
            this.files.forEach((item ,inx)=>{
                if(item.id == fileId){
                    index = inx;
                }
            })
            if(index >= 0){
                this.$children.forEach((item)=>{
                    if(item.uploader){
                        item.uploader.removeFile(this.files[index]);
                    }
                })
                this.files.splice(index ,1);
            }
        },
        goContacts(index){//打开人员选择树
            this.index=index;
            if(index==1){
                this.selectedUser = this.user1;
            }else if(index==2){
                this.selectedUser = this.user2;
            }else if(index==3){
                this.selectedUser = this.user3;
            }
            this.sendBtnText();
            this.userVisible=true;
		},
		onSubmit(selected){//人员选择树确认回调
			this.sendBtnText("发送");
			this.userVisible=false;
			if(this.index==1){
				this.user1 = selected;
			}else if(this.index==2){
				this.user2 = selected;
			}else if(this.index==3){
				this.user3 = selected;
			}
		},
		onHiden(){//人员选择树隐藏
			this.sendBtnText("发送");
			this.userVisible=false;
		},
        removeUser(index,userIndex){//删除已选用户
            if(index==1){
                this.user1.splice(userIndex,1);
            }else if(index==2){
                this.user2.splice(userIndex,1);
            }else if(index==3){
                this.user3.splice(userIndex,1);
            }
        },
        onCancel(){//不保存草稿
           	this.sheetVisible = false;
            this.next();
        },
        saveDraft(){//保存草稿
            let _this = this;
            _this.Api.MAIL.saveDraft(
				_this.sendMail
			).then(function(res) {
                if(res.data.code === '000000'){
                    _this.onCancel();
                    _this.next && _this.next();
                    _this.$router.replace({ path: '/home', query: { selected: '4' }});
                }
			})
        },
        getDraft(){//获取草稿内容
            let _this = this;
            _this.Api.MAIL.getMailById({
				id: _this.$route.query.id
			}).then(function(res) {
                if(res.data.code === '000000'){
                   _this.sendMail = ((obj)=>{
                       return {
                            userId: obj.senderUserId,
                            to: obj.toIds ,
                            cc: obj.ccIds,
                            bcc: obj.bccIds,
                            //附件id暂时没有
                            fileids:'',
                            mailContent: obj.mailContent,
                            mailTitle: obj.mailTitle
                       }
                   })(res.data.body);
                   _this.oldDiffData = Object.assign({} ,_this.sendMail);
                }
                if(res.data.body.attachUrl){
                    _this.files.push(res.data.body.attachUrl);
                }
			})
        },
        toFocus(event){
            setTimeout(()=>{
                event.target.focus();
            },10)
        },
        diffData(){//对比进入到写邮件页面的数据和离开时,是否有变化
            let o = this.oldDiffData,
                n = this.sendMail;
            if(
                o.bcc == n.bcc && 
                o.cc == n.cc && 
                o.to == n.to && 
                o.fileids == n.fileids &&
                o.mailContent == n.mailContent &&
                o.mailTitle == n.mailTitle
            ){
                return false;
            }
            return true;
        },
        sendBtnText(text){
        	document.querySelector('.mint-header-button.is-right').innerHTML=text?text:'';
        }
    },
    watch:{
        user1:function(val){
            this.sendMail.to = val.map((item)=>{
                return item.id;
            }).join(',')
        },
        user2:function(val){
            this.sendMail.cc = val.map((item)=>{
                return item.id;
            }).join(',')
        },
        user3:function(val){
            this.sendMail.bcc = val.map((item)=>{
                return item.id;
            }).join(',')
        },
        files:function(val){
            this.sendMail.fileids = val.map((item)=>{
                return item.id;
            }).join(',');
        },
    },
    computed:{
    	isSendShow:function(){//校验发送按钮是否可用
    		let isSendShow = userVisible || sheetVisible || sendVisible;
    		if(isSendShow){
    			this.sendBtnText();
    		}else{
    			this.sendBtnText('发送');
    		}
    		return isSendShow;
    	},
    	isSendAble:function(){//校验发送按钮是否可用
    		let isSendAble = this.user1.length>0 || this.user2.length>0 || this.user3.length>0;
    		let sendBtn = document.querySelector('.mint-header-button.is-right');
    		if(isSendAble){
    			sendBtn.classList.add("active");
    			sendBtn.onclick=this.sendValid;
    		}else{
    			sendBtn.classList.remove("active");
    			sendBtn.onclick="";
    		}
    		return isSendAble;
    	}
    },
    beforeRouteLeave(to, from, next){
    	this.sendBtnText();
        window.sessionStorage.removeItem('replyData');
        if(to.query.sendTo){
            next();
            return;
        }
        if(this.diffData()){
            this.sheetVisible = true;
            this.next = next;
        }else{
            next();
        }
	},
}
</script>
<style>
    
</style>