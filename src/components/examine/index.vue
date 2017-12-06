<template lang="html">
    <div class="examine" v-show="showing" >
        <transition name="fade">
            <div class="approve" v-show="!types ||  status" @click.stop="sight = false">
                <div v-show="types">
                    <div class="app-infor">
                        <div class="usually">
                            <a href="javascript:void(0);"  @click.stop="readOnly ? sight=false : sight = !sight"  class="sight">
                                <label for="" class="uword">常用词</label>
                                <span  :style="{'transform' : 'rotate(' + (sight ? 180 : 0) + 'deg)'}" class="uword-button"></span>
                            </a>
                            <div class="mint-popup-1" v-show="sight" >
                                <span class="triangle-1"></span>
                                <ul class="flow-infor">
                                    <li @click.stop="userword = word , sight = false" v-for="word in message"><a href="javascript:void(0);" class="a-start">{{word}}</a></li>
                                </ul> 
                            </div>
                        </div>
                        <span>&nbsp</span>
                        <label for="" class="write" @click.stop="sign">签批</label>
                    </div>
                    <div class="signature" v-show="signImgBase64">
                        <img :src="signImgBase64">
                        <span @click.stop="signImgBase64 = ''" class="del"><i class="jcm-delete"></i><br/>删除</span>
                    </div>
                    <textarea name=""  cols="30" :rows="row" id="suggest" v-model="userword"  v-bind:readonly="readOnly" placeholder="请填写意见..."></textarea>
                </div>
                <div class="operate">
                    <button type="default" class="return" @click.stop="btn1">{{btnText1}}</button>
                    <mt-button type="primary" style="float:right" @click.stop="btn2">{{btnText2}}</mt-button>
                </div>
            </div>
        </transition>
        <div class="btn-approve" >
            <mt-button  type="primary" @click.stop="shown" >审批</mt-button>
        </div>
    </div>
</template>

<script>
import Hammer from 'hammerjs';
import {Toast} from 'mint-ui';
    export default {
        props: {
            showing:{
                type: Boolean,
                default: true,
                required: true
            },
            status: {
                type: Boolean,
                default: false,
                required: false
            },
            message:{
                type: Array,
                default(){
                    return ['批准','退回','重新上报']
                }
            },
            btnText1:{
                type: String,
                default:'退回'
            },
            btnText2:{
                type: String,
                default:'提交'
            },
            fnSign:{
                type: Function,
                default: undefined,
                required: false
            },
            fnBtn1: {
                type: Function,
                default: undefined,
                required: false
            },
            fnBtn2: {
                type: Function,
                default: undefined,
                required: false
            },
            types: {
                type: Boolean,
                default: true
            },
            write:{
                type: Boolean,
                default: true
            },
            readOnly:{
                type: Boolean,
                default: false
            },
            aprrove:{
                type: Boolean,
                default: true
            }
        },
        data(){
            const img = require('./timg.jpg');
            return{
                //控制常用词显示隐藏
                sight : false,
                //输入的文字
                userword: '',
                pic:false,
                row:10,
                //签批回显图片base64
                signImgBase64: img
            }
        },
        mounted(){
            let _this = this;
            window.doRevisionResult = function(url, width, height){
                 _this.signImgBase64 = url;
                 _this.row = 6;
                if(_this.fnSign){
                    _this.fnSign(url, width, height);
                }
            };
            var hammertime = new Hammer(document.body);
            hammertime.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL});
            hammertime.on('swipedown',function(){
                _this.hide();
            })
        },
        methods: {
            sign() {
                try {
                    if(window.iAppRevision){
                        let w = document.documentElement.clientWidth;
                        iAppRevision.doRevision(w, w, 'target');
                    }
                } catch (err) {}
            },
            btn1(){
                if(this.fnBtn1){
                    this.fnBtn1();
                }else{
                    this.$router.go(-1);
                }
            },
            btn2(){
                 if(this.types){
                    if(this.signImgBase64 || this.userword){
                        this.fnBtn2 && this.fnBtn2(this.userword ,this.signImgBase64);
                    }else{
                        Toast('请填写审批意见');
                    }
                }else{
                    this.fnBtn2 && this.fnBtn2();
                }
            },
            shown(){
                this.userword = '';
                this.sight = false;
                this.$emit('update:status', true);
            },
            hide(){
                this.$emit('update:status', false);
            }
        }
    }
</script>

<style lang="scss">
    .examine{
        
        .fade-enter-active {
            animation: movetop .2s 1;
            -webkit-animation:movetop .2s 1;
        }
        .fade-leave-active {
            animation: movebottom .2s 1;
            -webkit-animation:movebottom .2s 1;
        }
        @-webkit-keyframes movetop
        {
            from {bottom:-342px;}
            
            to{bottom:0px;}
        }
        @-webkit-keyframes movebottom
        {
            from {bottom:0px;}
            
            to{bottom:-342px;}
        }
        @keyframes movetop
        {
            from {bottom:-342px;}
            
            to{bottom:0px;}
        }
        @keyframes movebottom
        {
            from {bottom:0px;}
            
            to{bottom:-342px;}
        }

        
        .approve{
            
            position:absolute;
            bottom:0;
            padding:5px 15px 5px;
            order:2;
            width: 100%;
            z-index:5;
            border-top:1px solid #ededed;
            background: #fff;
            box-shadow:-3px 0px 20px rgba(187,187,187, 0.7);
            // animation:myfirst .5s;
            // animation-fill-mode: forwards;
            .signature{
                position: relative;
                width:100%;
                padding-top:15px;
                img{
                    max-width:200px;
                }
                .del{
                    position: absolute;
                    right: 20px;
                    bottom: 20px;
                    line-height: 1.5;
                    text-align: center;
                    i{
                        font-size: 24px;
                    }
                }
            }
            .app-infor{
               padding-top:15px;
                font-size: 18px;

                .usually{
                    position:absolute;
                    left:50%;
                    margin-left:-42px;
                 
                    .sight{
                        display:inline-block;
                        text-decoration: none;
                    }
                    .uword{
                        float:left;
                        margin-right:8px;
                        color:#333;
                        font-size:18px;
                   }
                    .mint-button::after{
                        background:none;
                    }
                }
                .mint-popup-1 {
                    position: absolute;
                    top: 39px;
                    left:12px;
                    border: 1px solid #e2e2e2;
                    width: 120px;
                    z-index:1;
                    border-radius: 8px;
                    opacity:0.9;
                    background:#fff;
                    animation:myfirst .5s;
                }
                    
                .mint-popup-1::before {
                    display: inline-block;
                    
                    width: 0;
                    height: 0;
                    border: solid transparent;
                    border-width: 10px;
                    border-bottom-color: #e2e2e2;
        
                    content: "";
                    position: absolute;
                    top: -21px;
                    right: 48px;
                }
                .triangle-1{
                    display: inline-block;
        
                    width: 0;
                    height: 0;
                    border: solid transparent;
                    border-width: 10px;
                    border-bottom-color: #fff;
                
                    position: absolute;
                    top: -20px;
                    right: 48px;
                }
                .write{
                    float: right;
                    color:#518afe;
                    
                }
                .uword-button{
                    // position:absolute;
                    // right:0;
                    // top:0;
                    float:right;
                    display:block;
                    width:19px;
                    height:17px;
                    padding:1px;
                    border:1px solid #ddd;
                    border-radius:5px;
                    background:#fff url(../../assets/attence/images/jiantou0.png) center center no-repeat;
                    
                }
            }
            .flow-infor{
                padding:0;
                margin:0;
            
                li{
                    color:#333;
                    list-style-type: none;
                    text-align:center;
                    width:100%;
                    transform:all 4s ease;
                    a{
                        display:block;
                        padding:10px; 
                        color:#333;
                        border-bottom: 1px solid #f2f2f2;
                    }
                }
                li:first-child a{
                        border-radius: 4px  4px 0 0;
                    }
                li:last-child a{
                        border-radius: 0 0 4px 4px;
                        border:none;
                    }
                a:active{
                    background: #9da5be;
                    color:#fff;
                }
                .last-span{
                    border-bottom:0;
                }
            }
            
            textarea{
                padding:10px 3px 7px 10px;
                resize: none;
                margin-top:5px;
                -webkit-appearance: none;
                font-size:18px;
                width:100%;
                border: 1px solid #e2e2e2;
                box-shadow:none;
                background:#f2f2f2;
            }
            .operate{
                .mint-button--normal{
                    width:48%;
                }
                .return{
                    width:48%;
                    height:41px;
                    float:left;
                    color:#4e8dff;
                    background:#fff;
                    border-radius:4px;
                    font-size:18px;
                    border:thin solid #e2e2e2;
                }
                .return:active{
                    background:#9da5be;
                        color:#fff;
                }
            }
        } 
        
        .btn-approve{
            order:3;
            padding: 5px 4%;
            position:fixed;
            bottom:0;

            width:100%;
            height: 53px;

            background:#fff;
            box-shadow:-3px 9px 20px #bbb;
            border-top:1px solid #ededed;

            .mint-button--normal{
                width:100%;
                height:43px;
                border-radius: 3px;
                font-size: 20px;
                line-height: 43px;
            }   
        }
        .mint-button--primary{
            background: #4e8dff;
        }
    }
</style>