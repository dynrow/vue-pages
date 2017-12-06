<template>
    <div class="normal">
        <div class="title">
            <h2>{{info.title}}</h2>
            <span>{{info.author_unit}}</span> <span>{{info.author}}</span> <span class="date">{{paresDate(info.sendTime)}}</span>
        </div>
        <div class="journalism-content">
            <div v-if="info.picUrl" class="info-img">
                <img alt="" :src="info.picUrl" style="display: block;margin: 0 auto;"/>
            </div>
            <div>
                <div v-html="noTableHtml1"></div>
                <div style="overflow-x: scroll;" v-html="tableHtml"></div>
                <div v-html="noTableHtml2"></div>
            </div>
        </div>
        <div class="info-attach" v-if="showAttach">
            <div>附件：</div>
            <p class="attach-list" v-for="info in info.attachUrlList">
                <a :href="info.url">{{info.attachName}}</a>
            </p>
        </div>
        <div class="info-comment" v-if="showReview">
            <h2>评论（<span>2</span>）</h2>
            <div class="review-list clearfix">
                <div class="img"><img src="../sources/bg.png" alt=""></div>
                <div class="info">
                    <p><span class="user">张晓楠</span></p>
                    <p class="review-content">真是个好消息！！！</p>
                    <p class="date"><span>2017-12-11</span><span class="time">16:43:52</span></p>
                </div>
            </div>
            <div class="review-list clearfix">
                <div class="img"><img src="../sources/bg.png" alt="" width="50px" height="50px"></div>
                <div class="info">
                    <p><span class="user">张晓楠</span></p>
                    <p class="review-content">真是个好消息！！！</p>
                    <p class="date"><span>2017-12-11</span><span class="time">16:43:52</span></p>
                </div>
            </div>
            <textarea placeholder="评论">

            </textarea>
            <div class="btn"><input type="submit" value="确定"></div>
        </div>
    </div>
</template>

<script>

    import {Toast, Indicator} from 'mint-ui';
    import Util from '@/libs/util.js'; 
    export default {
        beforeRouteEnter(to, from, next) {
            next(vm => {
                vm.getDetail();
            })
        },
        data() {
            return {
                info: {},
                showAttach: false, //是否显示附件
                showReview: true, //是否显示评论
                noTableHtml1: '', //非table内容
                noTableHtml2: '', //非table内容
                tableHtml: '', //table内容
            }
        },
        methods: {
            getDetail: function () {
                let _this = this;
                _this.showLoading();
                if (this.$route.query && this.$route.query.id) {
                    _this.Api.INFO.getInfoById({
                        id: _this.$route.query.id,
                        nodeId: _this.$route.query.nodeId,
                        definitionId: _this.$route.query.definitionId,
                        instanceId: _this.$route.query.instanceId,
                        businessKey: _this.$route.query.businessKey,
                    }).then(function (res) {
                        if (res.data.code === '000000') {
                            _this.$set(_this, 'info', res.data.body);
                            if(_this.info.attachUrlList.length){
                                _this.showAttach = true;
                            }
                            
                        } else {
                            Toast({message: res.data.errormsg});
                        }
                        _this.$nextTick(() => {
                            _this.settableWidth();
                            _this.hideLoading();
                        })
                    }).catch(function (error) {
                        _this.hideLoading();
                    });
                }
            },
            showLoading() {
                Indicator.open();
            },
            hideLoading() {
                Indicator.close();
            },
            paresDate(stamp){
                return Util.format(new Date(stamp) ,'yyyy-MM-dd');
            },
            //如果信息内容中包含table,table中一行td大于4，就会出横向滚动条，并且table的宽度设置为600px;
            settableWidth: function(){
                let _this = this;
                if(_this.info.infoContent.indexOf('<table>') != -1){
                    let tdLength = _this.info.infoContent.split('<td').length - 1;
                    let trLength = _this.info.infoContent.split('<tr').length - 1;
                    let tableContent = _this.info.infoContent.split('table');
                    tableContent[0] = tableContent[0].substring(0,tableContent[0].length - 1);
                    tableContent[2] = tableContent[2].substr(1);
                    _this.noTableHtml1 = tableContent[0];
                    _this.noTableHtml2 = tableContent[2];
                    if(tdLength/trLength > 4){
                        _this.tableHtml = '<table style="width:600px"' + tableContent[1] + 'table>';
                    }else{
                        _this.tableHtml = '<table' + tableContent[1] + 'table>';
                    }
                }else{
                    _this.noTableHtml1 = _this.info.infoContent;
                }
            }
        }
    }
</script>

<style>

</style>
