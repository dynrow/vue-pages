<template>
    <div>
        <dl class="attence-detail">
            <dt>打卡时间</dt>
            <dd>{{signTime}}</dd>
        </dl>
        <dl class="attence-detail">
            <dt>打卡地点</dt>
            <dd>
                <label>
                    <h3>{{companyName}}</h3>
                    <p>{{position}}</p>
                </label>
            </dd>
        </dl>
        <dl class="attence-detail">
            <dt></dt>
            <dd>
                <div id="detail-map" style="height: 230px;width:100%"></div>
            </dd>
        </dl>
    </div>
</template>

<script>

export default {
    mounted(){
        let params = this.$route.query;
        //如果有值则
        if(!params.lng){
            params.lng = 125.250554;
            params.lat = 43.79853;
        }
        this.signTime = params.signTime ? params.signTime : '';
        this.position = params.position ? params.position : '';
        this.companyName = params.companyName ? params.companyName : '';
        this.initMap(params.lng ,params.lat);
    },
    data(){
        return {
            signTime: '',
            position: '',
            companyName: ''
        }
    },
    methods: {
        initMap(lng ,lat){
            let _this = this;
            _this.map = new AMap.Map('detail-map', {
                resizeEnable: true,
                zoom:13,
                center: [lng,lat],
                zoomEnable:false,
                dragEnable: false
            });
            //_this.map.setCenter([43.79853, 125.250554])
            //添加标记点
            _this.marker = new AMap.Marker({
                icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
                position: [lng ,lat]
            });
            _this.marker.setMap(_this.map);
        }
    }
}
</script>

<style>
</style>
