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
            path: '/home',
            name: 'Home',
            component: resolve => require(['@/modules/email/pages/email/home.vue'], resolve),
            meta: {
                title: '邮件管理'
            }
        }, {
            path: '/compose',
            name: 'Compose',
            component: resolve => require(['@/modules/email/pages/email/compose.vue'], resolve),
            meta: {
                title: '写邮件'
            }
        }, {
            path: '/detail',
            name: 'Detail',
            component: resolve => require(['@/modules/email/pages/email/detail.vue'], resolve),
            meta: {
                title: '邮件详细'
            }
        }, {
            path: '*',
            redirect: '/home'
        }
    ]
});
store.registerModule('MAIL', {
        state: {
            isfooterState: true
        },
        mutations: {
            footerState(state, payload) {
                state.isfooterState = payload.isfooterState
            }
        }
    })
    //跳转到每个组件下时候,修改当前title, 在微信或RTX中可以直接显示在menubar中
router.beforeEach((to, from, next) => {
    document.title = to.meta.title || document.title;
    //移动端如果使用异步组件加载那么还是需要一点等待时间的，在网络慢时等待时间会更长。显示Loading状态缓解一下用户等待情绪就十分重要。
    store.commit('updateLoadingStatus', { isLoading: true })
    next();
});
router.afterEach(function(to) {
    store.commit('footerState', { isfooterState: to.name === 'Home' })
    store.commit('updateLoadingStatus', { isLoading: false })

})

export default router;