<template>
    <form v-on:submit.prevent="doop" class="jc-search">
        <i class="mintui mintui-search"></i>
        <input type="search" placeholder="搜索" v-on:keyup.enter="submit" v-model="searchText">
        <a class="close" @click.stop="clear" v-show="showClose">
            <em class="jcm-guanbi"></em>
        </a>
    </form>
</template>
<script>
    export default {
        name: 'jc-search',
        props: {
            onSubmit:{
                type: Function,
                default: undefined,
                required: false
            },
            onWatch:{
                type: Function,
                default: undefined,
                required: false
            }
        },
        data() {
            return {
                //搜索框
                searchText: ''
            }
        },
        methods: {
            clear(){
                this.searchText = '';
            },
            doop(){},
            submit(){
                if(this.onSubmit){
                    this.onSubmit(this.searchText);
                }
            },
            watch(){
                if(this.onWatch){
                    this.onWatch(this.searchText);
                }
            }
        },
        watch: {
            searchText:function (newQuestion){
                this.watch();
            }
        },
        computed:{
            showClose(){
                return this.searchText.length;
            }
        }
    }
</script>
<style lang="scss" scoped>
    //搜索框样式
    .jc-search {
        position: relative;
        padding: 7px 15px;
        height: 48px;
        background: #eee;
        
        input {
            width: 100%;
            height: 34px;
            text-indent: 30px;
            border: 1px solid #ddd;
            border-radius: 6px;
            -webkit-appearance: none !important;
            &::-webkit-search-cancel-button {
                -webkit-appearance: none; //此处去掉type=search默认的小×
            }
        }

         i {
            position: absolute;
            top: 13px;
            left: 22px;
            font-weight: bold;
            color: #999;
            font-size: 20px;
        }

        .close {
            position: absolute;
            top: 11px;
            right: 22px;
            color: #999;
            font-size: 20px;
            z-index: 1000;
        }
    }
</style>
