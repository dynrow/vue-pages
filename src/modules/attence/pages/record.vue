<template>
    <div class="record-panel" :style="{height: wrapperHeight + 'px'}">
        <!--
            日历插件使用指南
            @params events  [Object]  自定义事件, 对象的key对应事件的天字符串
            @params lunar   [Boolean] 是否显示农历及节假日 ,农历和事件的回显信息位置冲突,谨慎同时使用
            @params zero    [Boolean] 是否显示日期补位 如1月显示01 ,默认true
            @params timestamp[Number] 时间戳, 服务器时间,默认0
            @params jcmday  [Array]   默认选中值, [2017,9,18]
            @params weeks   [Array]   星期标题['日', '一', '二', '三', '四', '五', '六']
            @params months  [Array]   显示月份标题['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
            @params select  [Function]选中天后回调事件
                @return Array 返回选中天数的数组[2017,9,18]
            @params selectMonth [Function]选中天后回调事件
                @return Array 返回选中月的数组[2017,9]
            @params selectYear [Function]选中天后回调事件
                @return Number 返回选年
         -->
        <calendar
            :events="calendar.events"
            :timestamp="calendar.timestamp"
            @select="calendar.select"
            @selectMonth="calendar.month"
        ></calendar>

        <div class="job">
            <div @click="toDetail({
                companyName: information.companyName_in,
                position: information.positionIn,
                lng: information.lng_in,
                lat: information.lat_in,
                signTime: information.signInTime
            })">
                <h3>上班</h3>
                <div class="marker working">
                    <img src="../sources/working.png">
                    <span class="time">{{information.signInTime ? information.signInTime : ''}}</span>
                    <span class="caution">{{information.signInTime | violations('in')}}</span>
                </div>
                <div class="marker-footer">{{information.positionIn ? information.positionIn : ''}}</div>
            </div>
            <div @click="toDetail({
                companyName: information.companyName_out,
                position: information.positionOut,
                lng: information.lng_out,
                lat: information.lat_out,
                signTime: information.signOutTime
            })">
                <h3>下班</h3>
                <div class="marker">
                    <img src="../sources/offworking.png">
                    <span class="time">{{information.signOutTime ? information.signOutTime : ''}}</span>
                    <span class="caution">{{information.signOutTime | violations('out')}}</span>
                </div>
                <div class="marker-footer">{{information.positionOut ? information.positionOut : ''}}</div>
            </div>
        </div>
        <note :today="calendar.today.join('-')" :message="information.message"></note>
    </div>
</template>

<script>
    //日历组件
    import Calendar from '@/components/calendar';
    //vuex获取get数据
    import { mapGetters } from 'vuex';

    import Note from './note.vue';

    export default {
        mounted() {
            let _this = this;
            if (_this.today && _this.today.time) {
                //赋值给时间戳, 让日历组件的有一个初始的时间
                _this.timestamp = _this.today.time;
                //赋值给day,可以获得一个初始的默认选中天
                _this.day = new Date(_this.today.time);
            } else {
                _this.day = new Date();
            }
            //当天
            _this.calendar.today = [_this.day.getFullYear(), _this.day.getMonth() + 1, _this.day.getDate()]
        },
        activated(){
            //查询当月考勤记录
            this.getData(this.calendar.today[0], this.calendar.today[1]);
        },
        components: {
            Calendar,
            Note
        },
        data() {
            let _this = this;
            let day = new Date();
            return {
                calendar: {
                    today: [day.getFullYear(), day.getMonth() + 1, day.getDate()],
                    events: {},
                    timestamp: 0,
                    select(value) {
                        if (_this.calendar.events[value.join('-')]) {
                            _this.information = _this.calendar.events[value.join('-')];
                        }
                    },
                    month(value) {
                        //选中每月当前选中的天数, 如当前选中10号,切换月份默认选中每月的10号
                        //_this.calendar.today = value.concat([_this.calendar.today[2]]);
                        _this.getData(value[0], value[1]);
                    }
                },
                information: {},
                wrapperHeight: document.documentElement.clientHeight
            }
        },
        filters: {
            violations(val, type) {
                // let result = '迟到了';
                // if(val){
                //     let item = val.split(':');
                // }
                return '';
            }
        },
        methods: {
            getData(y, m) {
                let _this = this;
                //查询记录缓存,避免频繁切换月份频繁发送http请求
                _this.Api.ATTENCE.attenceHitory({
                    year: y,
                    month: m
                }).then((res) => {
                    if (res.data.code === '000000') {
                        _this.parseData(res.data.body);
                    }
                }).catch(() => {});
            },
            parseData(data) {
                let result = {}, _this = this;
                data.forEach((item, index) => {
                    if (item) {
                        let dayTime = _this.formatDate(item.time);
                        result[dayTime.join('-')] = item;
                    }
                });
                _this.calendar.events = Object.assign({}, _this.calendar.events, result)
                if (_this.calendar.events[_this.calendar.today.join('-')]) {
                    _this.information = _this.calendar.events[_this.calendar.today.join('-')];
                }
            },
            formatDate(time) {
                let date = new Date(time);
                return [date.getFullYear(), date.getMonth() + 1, date.getDate()];
            },
            toDetail(params) {
                if(params.position && params.signTime){
                    this.$router.push({
                        path: 'recorddetail',
                        query: params
                    })
                }
            }
        },
        computed: {
            ...mapGetters(['today'])
        }
    }
</script>

<style >
    
</style>
