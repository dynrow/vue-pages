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
            name: 'Index',
            component: resolve => require(['@/modules/work/pages/index.vue'], resolve),
            meta: {
                title: '工作日程'
            }
        },{
            path: '/detail/:id',
            name: 'Detail',
            component: resolve => require(['@/modules/work/pages/detail.vue'], resolve),
            meta: {
                title: '日程详情'
            }
        },{
            path: '/new/:date',
            name: 'New',
            component: resolve => require(['@/modules/work/pages/detail.vue'], resolve),
            meta: {
                title: '新建日程'
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