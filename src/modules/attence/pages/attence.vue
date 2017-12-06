<template>
<div>
    <div class="attence-panel" :style="{ height: wrapperHeight + 'px' }">
        <div class="attence">
            <div class="attence-geog">
                <router-link class="record" to="/record">
                    <i class="jcm-rile"></i>
                </router-link>
                <div class="attence-marker">
                    <p class="attence-day">{{todayDate}}</p>
                    <div class="attence-place">
                        <i class="jcm-place"></i>
                    </div>
                    <div class="attence-loading" v-if="loading">
                        定位中...
                    </div>
                    <div class="attence-location" v-show="!loading">
                        <p class="attence-title">{{current && current.name}}
                            <router-link to="map">
                                <i class="jcm-youjiantou1"></i>
                            </router-link>
                        </p>
                        <p class="attence-lieu">{{current && current.address}}</p>
                    </div>
                </div>
            </div>
            <div class="attence-card" :class="{'active': !isCard}">
                <div @click="signIn">
                    <span class="time">{{todayTime}}</span>
                    <span class="slot">{{afternoon ? '下班' : '上班'}}签到</span>
                </div>
            </div>
        </div>
        <note :today="todayDate"></note>
        <div style="height: 20px;"></div>
    </div>
    <mt-actionsheet :actions="actions" v-model="sheetVisible" :cancelText="''"></mt-actionsheet>
</div>
</template>
 
<script>
    import { Toast, MessageBox, Actionsheet } from 'mint-ui';
    import { mapGetters } from 'vuex';
    import Vue from 'vue';
    import VueAMap from 'vue-amap';
    import Note from './note.vue';
    import { lazyAMapApiLoaderInstance } from 'vue-amap';

    Vue.use(VueAMap);
    VueAMap.initAMapApiLoader({
        key: '57cf654c08f036263991d0f13fd1fa38',
        plugin: ['AMap.Geolocation', 'AMap.PlaceSearch']
    });

    let $textarea = null;
    export default {
        components: {
            Note
        },
        activated() {
            this.getData();
        },
        data() {
            this.now = new Date();
            return {
                //容器的高度 
                wrapperHeight: 500,
                //今天日期
                todayDate: this.now.getFullYear() + '年' + (this.now.getMonth() + 1) + '月' + this.now.getDate() + '日',
                //显示定位置loading
                loading: true,
                //上午下午
                afternoon: false,
                //现在时间
                todayTime: '',
                //当前时间是否可以打卡
                isCard: true,
                //打卡提示弹出状态
                sheetVisible: false,
                //提示信息配置参数
                actions: []
            }
        },
        mounted() {
            this.wrapperHeight = document.documentElement.clientHeight - this.$el.getBoundingClientRect().top;
            this.getLocation();
        },
        methods: {
            getData() {
                let _this = this;   
                _this.Api.ATTENCE.initAttence().then((res) => {
                    if (res.data.code === '000000') {
                        _this.parseTime(res.data.body);
                    } else {
                        Toast(res.data.errormsg);
                        _this.isCard = false;
                    }
                }).catch((e) => {
                    _this.isCard = false;
                    Toast('获取数据失败!!!');
                });
            },
            //解析时间, 判断当前
            parseTime(obj) {
                let _this = this;
                //缓存初始化对象
                _this.nowObj = obj;
                //缓存到vuex  考勤记录页面使用
                _this.$store.commit('updateToday', _this.nowObj);
                //服务器时间
                let now = new Date(obj.time);
                //打卡时间
                _this.todayTime = obj.hour + ':' + obj.minute;
                /**
                 * -1 不能打卡
                 * 0 正常上班打卡
                 * 1 正常下班那打卡
                 * 2 早退打卡
                 * 3 迟到打卡
                 */
                //先判断是否定位成功, 如果定位失败,则直接禁止打卡
                _this.isCard = _this.isCard ? parseInt(obj.signFlag) >= 0 : false;
                //上午下午
                _this.afternoon = obj.signFlag == 1;
                //今天得服务器日期
                _this.todayDate = now.getFullYear() + '年' + (now.getMonth() + 1) + '月' + now.getDate() + '日';
                //初始化打卡提示消息
                _this.actionsheet();
            },
            //初始化打卡提示消息
            actionsheet() {
                const ATTENCEMESSAGES = {
                    '0': '上班打卡',
                    '1': '下班打卡',
                    '2': '你已迟到,是否继续打卡',
                    '3': '你是早退,是否继续打卡'
                }
                this.actions = [{
                    name: ATTENCEMESSAGES[this.nowObj.signFlag],
                }, {
                    name: '是',
                    method: this.attenceIn
                }, {
                    name: '否'
                }];
            },
            //定位
            getLocation() {
                let _this = this;
                lazyAMapApiLoaderInstance.load().then(() => {
                    _this.map = new AMap.Map('map-container', {
                        resizeEnable: true,
                        zoom: 11,
                        center: [125.250554, 43.79853]
                    });
                    _this.map.plugin('AMap.Geolocation', function() {
                        let geolocation = new AMap.Geolocation({
                            enableHighAccuracy: true, //是否使用高精度定位，默认:true
                            timeout: 10000, //超过10秒后停止定位，默认：无穷大
                            maximumAge: 0, //定位结果缓存0毫秒，默认：0
                            convert: true, //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
                            showButton: true, //显示定位按钮，默认：true
                            buttonPosition: 'LB', //定位按钮停靠位置，默认：'LB'，左下角
                            buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                            showMarker: true, //定位成功后在定位到的位置显示点标记，默认：true
                            showCircle: true, //定位成功后用圆圈表示定位精度范围，默认：true
                            panToLocation: true, //定位成功后将定位到的位置作为地图中心点，默认：true
                            zoomToAccuracy: true //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                        });
                        _this.map.addControl(geolocation);
                        geolocation.getCurrentPosition();
                        AMap.event.addListener(geolocation, 'complete', _this.onComplete); //返回定位信息
                        AMap.event.addListener(geolocation, 'error', _this.onError); //返回定位出错信息
                    });
                });
            },
            //定位成功回调
            onComplete(data) {
                //当前经纬度
                this.coordinates = {};
                this.coordinates.lng = data.position.getLng();
                this.coordinates.lat = data.position.getLat();
                this.service();
            },
            //定位失败回调
            onError() {
                //定位失败,禁止打卡
                this.isCard = false;
                Toast('获取位置失败,请刷新页面从新获取...');
            },
            //创建高德地图的搜索服务
            service() {
                let _this = this;
                AMap.service('AMap.PlaceSearch', () => { //回调函数
                    //实例化PlaceSearch
                    _this.placeSearch = new AMap.PlaceSearch({
                        type: '公司企业',
                        pageSize: 16
                    });
                    _this.searchKeyWord()
                })
            },
            //搜索附近的公司, 把数组中第一个显示,其余保存,留置定位页面使用
            searchKeyWord() {
                let _this = this;
                _this.placeSearch.searchNearBy('', [_this.coordinates.lng, _this.coordinates.lat], 300, (status, result) => {
                    if (status === 'complete' && result.info === 'OK') {
                        if (result.poiList.pois.length) {
                            _this.$store.commit('updatePositions', result.poiList.pois)
                        }else{
                            this.isCard = false;
                        }
                    }else{
                        this.isCard = false;
                    }
                    _this.loading = false;
                });
            },
            //点击签到
            signIn() {
                if (this.isCard) {
                    if (parseInt(this.nowObj.signFlag) > 1) {
                        this.sheetVisible = true;
                    } else {
                        this.attenceIn();
                    }
                }
            },
            attenceIn() {
                let _this = this;
                _this.Api.ATTENCE.attenceIn({
                    lat: _this.current.location.lat, //维度
                    lng: _this.current.location.lng, //经度
                    position: _this.current.address, //打卡位置详细描述
                    companyName: _this.current.name, //打卡简要地址描述（公司名称）
                    message: '' //情况说明
                }).then((res) => {
                    if (res.data.code === '000000') {
                        _this.$router.push({
                            name: 'Success',
                            params: {
                                time: res.data.body,
                                name: _this.current.name
                            }
                        });
                    } else {
                        Toast('打卡失败...');
                    }
                    //打卡成功
                }).catch(() => {})
            }
        },
        computed: {
            ...mapGetters(['current'])
        }
    }
</script>
 
<style>
</style>