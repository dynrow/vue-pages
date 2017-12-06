<template>
    <div>
        <span></span>
        <dl class="attence-detail border" @click="show">
            <dt>情况说明</dt>
            <dd>
                <i class="jcm-arrows"></i>
                <p class="content">{{message || situationText}}</p>
            </dd>
        </dl>
        <div v-if="state">
            <div class="mint-msgbox-wrapper" style="position: absolute; z-index: 2005;">
                <div class="mint-msgbox">
                    <div class="mint-msgbox-content">
                        <div class="mint-msgbox-message">
                            <textarea class="situation-text" v-model="situationInput" v-focus :placeholder="placeholder || ''"></textarea>
                        </div>
                    </div>
                    <div class="mint-msgbox-btns">
                        <button class="mint-msgbox-btn mint-msgbox-cancel confirmBtn" @click="hide">取消</button>
                        <button class="mint-msgbox-btn mint-msgbox-confirm confirmBtn" @click="onConfirm">确定</button>
                    </div>
                </div>
            </div>
            <div class="v-modal" @click="hide" style="z-index: 2000;"></div>
        </div>
    </div>
</template>

<script>

import { Indicator,Toast } from 'mint-ui';

export default {
    props: {
        placeholder:{
            type: String,
            default: '情况说明'
        },
        message: {
            type: String,
            default: ''
        },
        max: {
            type: Number,
            default: 100
        },
        today: {
            type: String,
            required: true
        }
    },
    data(){
        return {
            //情况说明的输入内容
            situationInput: '',
            //显示状态,  true显示  false隐藏
            state: false,
            //在组件中显示值得保存
            situationText: ''
        }
    },
    watch: {
        situationInput(val, oldVal){
            if(val.length > this.max){
                this.situationInput = oldVal;
            }
        }
    },
    methods: {
        onConfirm(){
            this.$emit('update:message', this.situationInput);
            this.situationText = this.situationInput;
            this.save();
        },
        show(){
            if(this.message){
                this.situationInput = this.message;
            }
            this.state = !0;
        },
        hide(){
            this.state = !1;
        },
        save(){
            let _this = this;
            if(!_this.situationText.length){
                Toast('请填写情况说明!!!');
                return;
            }
            Indicator.open();
            let date = _this.today.replace(/(年|月)/g ,'-').split('-').map((item)=>{
                return _this.zeroPad(item);
            }).join('-');
            _this.Api.ATTENCE.addMessage({
                date: date,
                message: _this.situationText
            }).then((res) => {
                Indicator.close();
                _this.hide();
                if (res.data.code === '000000') {
                    Toast('保存成功');
                } else {
                    Toast(res.data.errormsg);
                }
                //打卡成功
            }).catch(() => {
                _this.hide();
                Indicator.close();
            })
        },
        zeroPad(n) {
            let num = parseInt(n)
            return num > 9 ? num : '0' + num;
        }
    },
    directives: {
        focus: {
            // 指令的定义
            inserted: function(el) {
                el.focus()
            }
        }
    }
}
</script>

<style>
</style>
