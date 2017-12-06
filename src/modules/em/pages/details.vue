<template>
    <div class="email-details">
        <div class="details-header">
            <h1 class="details-title">很快就到哈萨克会撒娇快点回家啊啥客户端看见安徽省经典款哈就开始就开始加深对杰卡斯杰卡斯</h1>
            <div class="details-info">
                <span>
                    <i>发件人：</i>
                    <i>111</i>
                </span>
                <span class="de-attachment" v-show="detailslabel2">
                    <i>2</i>
                    <i class="jcm-shangchuanfujian upload"></i>
                </span>
                <span class="content-details" @click="detailslabel = !detailslabel,detailslabel2 = !detailslabel2"><span v-if="detailslabel2">详情</span><span v-if="detailslabel">隐藏</span><i :style="{'transform' : 'rotate(' + (detailslabel ? 180 : 0) + 'deg)'}"></i></span>
                <div class="details-label" v-show="detailslabel">
                    <span>
                        <i>收件人：</i>
                        <i>111</i>
                    </span><span>
                        <i>抄送：</i>
                        <i>111</i>
                    </span><span>
                        <i>时间：</i>
                        <i>111</i>
                    </span><span>
                        <i>附件：</i>
                        <i>111</i>
                    </span>
                </div>
            </div>
        </div>
        <div class="details-content">
            <div class="main-content">电话卡删空间撒好借好还讲课费金合欢花或或或或或或或或或或或或
            或或或或或或或或或或或或或或或或或或或或或或或
            或或或或或将近奖金军军军军军军军军军军军军军军军军军军军军军军
            \或或或或或或或或或或或或或或或或或或或或或或或
            或或或或或将近奖金军军军军军军军军军军军军军军军军军军军军军军
            或或或或或或或或或或或或或或或或或或或或或或或
            或或或或或或或或或或或或或或或或或或或或或或或
            或或或或或将近奖金军军军军军军军军军军军军军军军军军军军军军军
            \或或或或或或或或或或或或或或或或或或或或或或或
            或或或或或将近奖金军军军军军军军军军军军军军军军军军军军军军军
            或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或
            或或或或或将近奖金军军军军军军军军军军军军军军军军军军军军军军
            \或或或或或或或或或或或或或或或或或或或或或或或
            或或或或或将近奖金军军军军军军军军军军军军军军军军军军军军军军
            或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或
            或或或或或将近奖金军军军军军军军军军军军军军军军军军军军军军军
            \或或或或或或或或或或或或或或或或或或或或或或或
            或或或或或将近奖金军军军军军军军军军军军军军军军军军军军军军军
            或或或或或或或或或或或或或或或或或或或或或或或
            或或或或或将近奖金军军军军军军军军军军军军军军军军军军军军军军
            或或或或或或或或或或或或或或或或或或或或或或或
            或或或或或将近奖金军军军军军军军军军军军军军军军军军军军军军军
            军军军军军军军军军军军军军军军军军军军军军军军军军军军军军军军军军军军军军军将近奖金军军军军军军军军</div>
            <div class="enclosure">
                <i>附件：</i>
                <ul class="enclosure-name">
                    <li>哈哈哈哈</li>
                    <li>哈哈哈哈</li>
                    <li>哈哈哈哈</li>
                </ul>
            </div>
        </div>
        <div class="details-btn">
            <a href="javascript:void(0);" @click.stop="reply= !reply"><i>回复
                <ul class="email-reply" v-show="reply">
                    <li>全部回复</li>
                    <li>回复</li>
                    <li class="last">取消</li>
                    <span class="triangle"></span>
                    <span class="triangle-2"></span>
                </ul>
            </i>
            
            </a>
            
            <a href="javascript:void(0);">转发</a> 
            <a href="javascript:void(0);">星标<i class="jcm-biaoxing xingxing" ></i></a> 
            <a href="javascript:void(0);">删除</a> 
            
           
        </div>
        
    </div>
</template>
<script>
    import {Indicator,Toast,Popup} from 'mint-ui';
    import JcSearch from '@/components/search';
    import Util from '@/libs/util.js';
    export default {
        components: {
        },
        data() {
            return {
                bcc:false,
                set:true,
                reply:false,
                detailslabel:false,
                detailslabel2:true
            }
        },
        
        methods: {

        }
    }
</script>
<style lang="scss">
    .email-details{
        height:100vh;
        padding:0 0 50px 0;
        overflow: scroll;
        .details-header{
            padding:15px;
            border-bottom:1px solid #eee;
            .details-title{
                font-size:20px;
                font-weight:600;
                color:#333;
                line-height:30px;
            }
            .details-info{
                margin-top:5px;
                color:#333;
                font-size:16px;
                span,i{
                    line-height:16px;
                    font-style:normal;
                    color:#333;
                    font-size:16px;
                }
                .details-label{
                    margin-top:3px;
                    span{
                        padding:4px 0;
                        display:block;
                    }
                }
            }
            .de-attachment{
                margin-left:10px;
                .upload{
                    line-height:15px;
                    color:#6d6d6d;
                    font-size:14px;
                }
            }
            .content-details{
                position:relative;
                float:right; 
                padding-right:20px;
                i{
                    display:block;position:absolute;
                    right:0;
                    width:14px;
                    height:8px;
                    bottom:4px;
                    background:url(../sources/jiantou0.png) no-repeat;
                }
                
            }
        }
        .details-content{
            padding:15px;
            .main-content{
                color:#333;
                font-size:18px;
            }
            .enclosure{
                display:flex;
                margin-top:20px;
                i{
                    color:#333;
                    float:left;
                    height:100%;
                    font-style:normal;
                }
                .enclosure-name{
                    float:left;
                    li{
                        float:left;
                        width:100%;
                        color:#4e8dff;
                    }
                }
                
            }
            
        }
        .details-btn{
            position: fixed;
            display:flex;
            bottom: 0;
            padding:10px 16px;
            height:53px;
            background:#fff;
            border-top:1px solid #E2E2E2;
            width:100%;
            .xingxing{
                color:#ffd213;
                font-size:18px;
            }
            a{
                display:block;
                height:33px;
                font-size:15px;
                color:#4e8dff;
                line-height:33px;
                text-align:center;
                background:#fff;
                border-radius:4px;
                flex: 1;
                i{
                    font-style:normal;
                    position:relative;
                }
            }
            a:active{
                height:33px;
                font-size:15px;
                color:#fff;
                border-radius:4px;
                background:#4e8dff;
            }
            .email-reply{
                position:absolute; 
                left:0;
                width:120px;
                background:#fff;
                border-radius:5px;
                bottom:30px;
                margin-left:-45px;
                padding:0 12px;
                border:1px solid #e2e2e2;
                li{
                    padding: 4px 12px;
                    text-align:center;
                    color:#333;
                    border-bottom:1px solid #e2e2e2;
                }
                .last{
                    border:none;
                }
                .triangle{
                    position:absolute;
                    left:50%;
                    bottom:-8px;
                    margin-left:-7px;
                    width: 0;
                    height: 0;
                    border-left: 8px solid transparent;
                    border-right: 8px solid transparent;
                    border-top: 8px solid #e2e2e2;;
                }
                .triangle-2{
                    position:absolute;
                    left:50%;
                    bottom:-6px;
                    margin-left:-7px;
                    width: 0;
                    height: 0;
                    border-left: 8px solid transparent;
                    border-right: 8px solid transparent;
                    border-top: 8px solid #fff;;
                }
            }
            
            
            
        }
        
    }
</style>