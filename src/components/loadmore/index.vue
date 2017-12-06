<template>
    <div ref="mescroll" class="mescroll" id="loadMoreDataList">
        <slot></slot>
    </div>
</template>

<script>
//http://www.mescroll.com/api.html
import MeScroll from './mescroll.js';

export default {
    props: {
        initScroll: {
            type: Function,
            default: undefined,
            required: false
        },
        options: {
            type: Object,
            default: null
        },
        onRefresh: {
            type: Function,
            default: undefined,
            required: false
        },
        onInfinite: {
            type: Function,
            default: undefined,
            require: false
        }
    },
    mounted(){
        let _this = this;
        let totop_img = require('./mescroll-totop.png');
        let empty_img = require('./mescroll-empty.png');
        let opt = {
            up: {
                callback: _this.upCallback, //上拉回调
                //以下参数可删除,不配置
                page: {
                    size: 10//可配置每页8条数据,默认10
                }, 
                toTop: { //配置回到顶部按钮
                    src : totop_img, //默认滚动到1000px显示,可配置offset修改
                    offset: 700
                },
                empty:{ //配置列表无任何数据的提示
                    warpId:"loadMoreDataList",
                    icon : empty_img, 
                    // tip : "亲,暂无相关数据哦~" , 
                    // btntext : "去逛逛 >" , 
                    // btnClick : function() {
                    //     alert("点击了去逛逛按钮");
                    // } 
                }
            },
            down: {
                use: false,
                //是否在初始化完毕之后自动执行下拉回调callback; 默认true
                auto: false,
                //下拉刷新的回调
                callback: _this.downCallback
            }
        };

        let newOpt = MeScroll.extend(_this.options ,opt);
        _this.mescroll = new MeScroll(_this.$refs.mescroll, newOpt);
        _this.initScroll(_this.mescroll);
    },
    methods: {
        upCallback(page){
            this.onInfinite(page);
        },
        downCallback(){
            this.onRefresh();
        }
    }
}
</script>

<style lang="scss">
    @import './mescroll.scss';
</style>