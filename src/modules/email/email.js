import Vue from 'vue';
import App from './App';
import router from './router';
import store from '@/store';

import JCFE from '@/libs/jcfe.common.js';

/* 初始化 */
new Vue({
    el: '#app',
    store,
    router,
    render: h => h(App)
    // template: '<App/>',
    // components: { App }
})
