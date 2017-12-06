<template>

<div>
    <!-- 
        日历插件使用指南
        @params events [Object]  自定义事件, 对象的key对应事件的天字符串
        @params lunar  [Boolean] 是否显示农历及节假日 ,农历和事件的回显信息位置冲突,谨慎同时使用
        @params value  [Array]   默认回显值, [2017,9,18]
        @params serverDay [Number] 服务器时间戳, 保证回到今天是服务器时间
        @params weeks  [Array]   星期标题['日', '一', '二', '三', '四', '五', '六']
        @params months [Array]   显示月份标题['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
        @params select [Function]选中天后回调事件 
            @return Array 返回选中天数的数组[2017,9,18]
     -->
    <calendar 
        :events="calendar.events" 
        :value="calendar.value"
        @select="calendar.select"></calendar>

    <mt-button type="primary" @click="changeEvents">异步更新Price</mt-button>
    <router-link to="picker" style="text-decoration: none;">
        <mt-button plain type="primary">跳转日期页面</mt-button>
    </router-link>
</div>

</template>

<script>

import calendar from '@/components/calendar';

export default {
    components: {
        calendar
    },
    data(){
        let day = new Date();
        return {
            calendar: {
                value:[day.getFullYear(), day.getMonth() + 1, day.getDate()], //默认日期
                events:{
                    '2017-9-14':'$408','2017-9-15':'$460','2017-9-16':'$500',
                },
                select(value){
                    console.log(value.toString());
                }
            }
        }
    },
    methods: {
        changeEvents(){
            this.calendar.events = {};
            this.calendar.events['2017-9-' + this.randomNumBoth(1,31)] = '$';
        },
        randomNumBoth(Min,Max){
            var Range = Max - Min;
            var Rand = Math.random();
            var num = Min + Math.round(Rand * Range); //四舍五入
            return num;
        }
    }
}
</script>

<style>
</style>
