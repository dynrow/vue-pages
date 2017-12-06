<template>
    <div class="position">
        <div class="search" :class="{'panel': panelState}" @click="togglePanel">
            <form v-on:submit.prevent="doop">
                <i class="mintui mintui-search"></i>
                <input type="search" placeholder="搜索" @focus="panelState = true" v-on:keyup.enter="onSubmit" v-model="searchText" @click.stop="doop"/>
                <a class="search-cancel" @click="hidePanel">取消</a>
            </form>
            <div id="listContainer" class="map-list" ref="listContainer" :class="{searchPanel: searchText.length}">
                <div v-for="company in searchResults" :key="company.id" @click="selectedCompany(company)">
                    <mt-cell :title="company.name" :label="company.address" is-link></mt-cell>
                </div>
            </div>
        </div>
        <div id="container"></div>
        <div class="map-list" ref="listContainer" :style="{ height: listHeight + 'px' }">
            <div v-for="company in positions" :key="company.id" @click="selectedCompany(company)">
                <mt-cell :title="company.name" :label="company.address">
                        <i v-if="current.id == company.id" class="selected jcm-check"></i>
                </mt-cell>
            </div>
        </div>
    </div>
</template>

<script>

import { Toast} from 'mint-ui';
import { mapGetters } from 'vuex';
import router from 'vue-router';

    export default {
        activated(){
            this.searchResults = [];
        },
        data(){
            return {
                searchText: '',
                selected: '',
                listHeight: 300,
                panelState: false,
                searchResults: []
            }
        },
        mounted(){
            let _this = this;

            _this.listHeight = document.documentElement.clientHeight - _this.$refs.listContainer.getBoundingClientRect().top;
            if(window.AMap){
                _this.map = new AMap.Map('container', {
                    resizeEnable: true,
                    zoom: 13,
                    center: [125.250554,43.79853]
                });

                _this.map.plugin('AMap.Geolocation', function () {
                let geolocation = new AMap.Geolocation({
                        enableHighAccuracy: true,//是否使用高精度定位，默认:true
                        timeout: 10000,          //超过10秒后停止定位，默认：无穷大
                        maximumAge: 0,           //定位结果缓存0毫秒，默认：0
                        convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
                        showButton: true,        //显示定位按钮，默认：true
                        buttonPosition: 'LB',    //定位按钮停靠位置，默认：'LB'，左下角
                        buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                        showMarker: true,        //定位成功后在定位到的位置显示点标记，默认：true
                        showCircle: true,        //定位成功后用圆圈表示定位精度范围，默认：true
                        panToLocation: true,     //定位成功后将定位到的位置作为地图中心点，默认：true
                        zoomToAccuracy:true      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                    });
                    _this.map.addControl(geolocation);
                    geolocation.getCurrentPosition();
                    AMap.event.addListener(geolocation, 'complete', _this.onComplete);//返回定位信息
                    AMap.event.addListener(geolocation, 'error', _this.onError);      //返回定位出错信息
                });
                
                AMap.service('AMap.PlaceSearch',function(){//回调函数
                    //实例化PlaceSearch
                    _this.placeSearch = new AMap.PlaceSearch({
                        type: '公司企业',
                        pageSize: 16
                    });
                });
            }else{
                Toast('定位失败,请从新进入此页面!!!'); 
            }
        },
        methods: {
            onComplete(data){
                this.lng = data.position.getLng();
                this.lat = data.position.getLat();
            },
            onError(msg){
                Toast('定位失败,请从新进入此页面!!!'); 
            },
            searchCompany(){
                let _this = this;
                _this.placeSearch.searchNearBy(_this.searchText, [_this.lng ,_this.lat], 300, function(status, result) {
                    if (status === 'complete' && result.info === 'OK') {
                        _this.searchResults = result.poiList.pois;
                    }
                });
            },
            /**
             * 选择公司触发事件
             */
            selectedCompany(company){
                this.$store.commit('updateCurrent', company);
                this.searchText = '';
                this.panelState = false;
                this.hidePanel()
            },
            /**
             * 搜索公司提交触发事件
             */
            onSubmit(){
                if(this.searchText){
                    this.searchCompany();
                }
            },
            hidePanel(){
                if(this.panelState == false && this.searchText == ''){
                    this.$router.go(-1);
                    return;
                }
                this.searchText = '';
                this.panelState = false;
                this.searchResults = [];
            },
            togglePanel(){
                if(this.panelState && this.searchText == ''){
                    this.panelState = false;
                }
            },
            doop(){},
        },
        computed: {
            ...mapGetters(['positions','current'])
        }
    }
</script>

<style>

</style>
