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
            path: '/detail',
            name: 'Detail',
            component: resolve => require(['@/modules/info/pages/detail.vue'], resolve),
            meta: {
                title: '详细页面',
                keepAlive: false
            }
        },{
            path: '/',
            name: 'List',
            component: resolve => require(['@/modules/info/pages/list.vue'], resolve),
            meta: {
                title: '信息管理',
                keepAlive: true
            }
        },{
            path: '/todo',
            name: 'Todo',
            component: resolve => require(['@/modules/info/pages/todo.vue'], resolve),
            meta: {
                title: '待办列表',
                keepAlive: true
            }
        },{
            path: '/tododetail',
            name: 'TodoDetail',
            component: resolve => require(['@/modules/info/pages/todoDetail.vue'], resolve),
            meta: {
                title: '流程表单',
                 keepAlive: false
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