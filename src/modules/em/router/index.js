/**
 * 路由配置文件
 */
import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store';
 
 
Vue.use(Router);
 
const router = new Router({
    routes: [
        {
            path: '/',
            component: resolve => require(['@/modules/em/pages/home.vue'], resolve),
            meta: {
                title: '邮件管理',
                keepAlive: true
            }
        },
        {
            path: '/write',
            name: 'Write',
            component: resolve => require(['@/modules/em/pages/write.vue'], resolve),
            meta: {
                title: '写邮件',
            }
        },
        {
            path: '/details',
            name: 'Details',
            component: resolve => require(['@/modules/em/pages/details.vue'], resolve),
            meta: {
                title: '邮件详情',
            }
        },
        
        {
            path:'*',
            redirect:'/'
        }
    ]
});
//跳转到每个组件下时候,修改当前title, 在微信或RTX中可以直接显示在menubar中
router.beforeEach((to, from, next) => {
    document.title = to.meta.title || document.title;
    //移动端如果使用异步组件加载那么还是需要一点等待时间的，在网络慢时等待时间会更长。显示Loading状态缓解一下用户等待情绪就十分重要。
    store.commit('updateLoadingStatus', {isLoading: true})
    next();
});
 
router.afterEach(function (to) {
    store.commit('updateLoadingStatus', {isLoading: false})
})
 
export default router;