<template>
    <transition name="pdfview-pop">
        <div>
            <iframe v-if="visible" :src="'../static/generic/web/viewer.html?file=' + url" :height="ph" :width="pw" style="position: fixed;top:0;"></iframe>
        </div>
    </transition>
</template>



<script>

//import $ from 'jquery';

const supportsPushState = (function() {
    const ua = window.navigator.userAgent
    if ((ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) &&
        ua.indexOf('Mobile Safari') !== -1 &&
        ua.indexOf('Chrome') === -1 &&
        ua.indexOf('Windows Phone') === -1) {
        return false
    }
    return window.history && 'pushState' in window.history
})()

export default {
    props: {
        url: {
            type: String,
            default: ''
        }
    },
    mounted(){
        this.ph = document.documentElement.clientHeight - this.$el.getBoundingClientRect().top;
    }, 
    data() {
        let _this = this;
        return {
            visible: false,
            uuid: _this.guid(),
            pw: document.documentElement.clientWidth,
            ph: 300
        }
    },
    methods: {
        historyAddEvent(e){
            e && e.preventDefault();
            window.history.pushState(null, null, this.oldUrl);
            this.hide();
            return false;
        },
        guid(){
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            }).toUpperCase();
        },
        show(url){
            let _this = this;
            _this.url = url;
            _this.oldUrl = document.URL;
            /**
             * 可以在当前使用vue-router的组件中 , 添加beforeRouteUpdate 或 beforeRouteLeave 路由守卫方法
             * 在方法中不调用next()函数
             * 
             * 使用
             */
            window.addEventListener(supportsPushState ? 'popstate' : 'hashchange' ,_this.historyAddEvent)
            _this.visible = true;
        },
        hide(){
            let _this = this
            window.removeEventListener(supportsPushState ? 'popstate' : 'hashchange' ,_this.historyAddEvent)
            this.visible = false;
        }
    }
};
</script>

<style>

</style>