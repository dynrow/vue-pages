<template>
    <div class="write-raply">
        <div class="email-write" >
            <div class="write-info">
                <label for="" class="label">收件人：</label>
                <span></span>
                <i class="jcm-jiahao choose" ></i>
            </div>
            <div class="write-info" @click.stopk=" bcc=true,set=false" v-show="set">
                <label for="" class="label">抄送/密送：</label>
                <span></span>
            </div>
            <div class="write-info" v-show="bcc">
                <label for="" class="label">抄送：</label>
                <span></span>
                <i class="jcm-jiahao choose" ></i>
            </div>
            <div class="write-info" v-show="bcc">
                <label for="" class="label">密送：</label>
                <span></span>
                <i class="jcm-jiahao choose" ></i>
            </div>
            <div class="write-info">
                <label for="" class="label">主题：</label>
                <input type="text" class="email-title">
                <i class="jcm-shangchuanfujian upload"></i>
            </div>
            <div>
                <textarea name="" id="" cols="30" rows="10" class="email-content" placeholder="请输入正文..."></textarea>
            </div>
            <div class="send">
                <mt-button type="primary" >发送</mt-button>
            </div>
        </div>
        <div class="email-reply">
            <div class="reply-line">-------------------- 原始邮件 --------------------</div>
            <div class="reply-info">
                <ul>
                    <li><span>发件人：</span><span>哈哈哈</span></li>
                    <li><span>发送时间：</span><span>哈哈哈</span></li>
                    <li><span>收件人：</span><span>哈哈哈</span></li>
                    <li><span>主题：</span><span>哈哈哈</span></li>
                </ul>
            </div>
            <div class="reply-content">哈哈哈哈哈哈哈哈或或或或或或或或或或或或或或或或或
            或或或或或或或或或或或或或或或或或或或或或或或或或或或或哈哈哈哈哈哼
            或或或或或或或或或哈哈哈哈哼或或或哈哈哈哈哈哈哈哈或或或或或或或或或或或或或或或或或
            或或或或或或或或或或或或或或或或或或或或或或或或或或或或哈哈哈哈哈哼
            或或或或或或或或或哈哈哈哈哼或或或哈哈哈哈哈哈哈哈或或或或或或或或或或或或或或或或或
            或或或或或或或或或或或或或或或或或或或或或或或或或或或或哈哈哈哈哈哼
            或或或或或或或或或哈哈哈哈哼或或或哈哈哈哈哈哈哈哈或或或或或或或或或或或或或或或或或
            或或或或或或或或或或或或或或或或或或或或或或或或或或或或哈哈哈哈哈哼
            或或或或或或或或或哈哈哈哈哼或或或哈哈哈哈哈哈哈哈或或或或或或或或或或或或或或或或或
            或或或或或或或或或或或或或或或或或或或或或或或或或或或或哈哈哈哈哈哼
            或或或或或或或或或哈哈哈哈哼或或或哈哈哈哈哈哈哈哈或或或或或或或或或或或或或或或或或
            或或或或或或或或或或或或或或或或或或或或或或或或或或或或哈哈哈哈哈哼
            或或或或或或或或或哈哈哈哈哼或或或或或或或或或或或或</div>
        </div>
        
    </div>
</template>
<script>
    import {Indicator,Toast} from 'mint-ui';
    import JcSearch from '@/components/search';
    import Util from '@/libs/util.js';
    import Loadmore from '@/components/loadmore';
    export default {
        components: {
        },
        data() {
            return {
                bcc:false,
                set:true,

            }
        },
        
        methods: {

        }
    }
</script>
 <style lang="scss">
    .write-raply{
        height:100vh;
        overflow: scroll;
        .email-write{
            position:relative;
            padding:0 15px;
            .write-info{
                display:flex;
                position:relative;
                min-height:50px;
                width:100%;
                border-bottom:1px solid #e2e2e2;
                .label{
                    flex:1;
                    line-height:50px;
                    font-size:16px;
                    color:#999;
                }
                .choose{
                    position:absolute;
                    top:10px;
                    right:0;
                    color: #4e8dff;
                    width: 30px;
                    height: 30px;
                    font-size: 30px;
                }
                .upload{
                    position:absolute;
                    top:15px;
                    right:0;
                    color: #4e8dff;
                    width: 22px;
                    height: 22px;
                    font-size: 22px;
                }
                .email-title{
                    margin:10px 30px 10px 0;
                    padding-left:10px;
                    flex:4;
                    border:none;
                    height:30px;
                }
            }
            
            
            .email-content{
                width:100%;
                resize:none;
                border: 1px solid #fff;
                padding:15px 0;
                color:#333;
                outline:none;
                font-size:16px;
            }
            .mint-button--normal{
                position:absolute;
                bottom:0px;
                right:30px;
                width:60px;
                height:33px;
                background:#4e8dff;
                color:#fff;
                font-size:16px;
                line-height:33px;
            }
            .send{
                width:100%;
                height:30px;
                background:#fff;
            }
            
        }
        
        .email-reply{
            padding:0 15px;
            .reply-line{
                padding:15px 0;
                font-size:14px;
                color:#333;
            }
            .reply-info{
                padding:10px 10px 20px;
                width:100%;
                background:#f0f0f0;
            }
            .reply-content{
                padding: 15px 0;
            }
        }
    }
 </style>