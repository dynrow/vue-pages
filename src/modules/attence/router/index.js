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
            name: 'Attence',
            component: resolve => require(['@/modules/attence/pages/attence.vue'], resolve),
            meta: {
                title: '考勤管理'
            }
        },{
            path: '/map',
            name: 'Map',
            component: resolve => require(['@/modules/attence/pages/position.vue'], resolve),
            meta: {
                title: '考勤位置'
            }
        },{
            path: '/record',
            name: 'Record',
            component: resolve => require(['@/modules/attence/pages/record.vue'], resolve),
            meta: {
                title: '考勤记录'
            }
        },{
            path: '/recorddetail',
            name: 'Detail',
            component: resolve => require(['@/modules/attence/pages/detail.vue'], resolve),
            meta: {
                title: '打卡详情'
            }
        },{
            path: '/with',
            name: 'Success',
            component: resolve => require(['@/modules/attence/pages/success.vue'], resolve),
            meta: {
                title: '打卡成功'
            }
        },{
            path:'*',
            redirect:'/'
        }
    ]
});

store.registerModule('ATTENCE', {
    state: {
        positions: [],
        current: {},
        today: {}
    },
    getters: {
        today: state => {
            return state.today
        },
        positions: state => {
            return state.positions
        },
        current: state => {
            let isNull = Object.keys(state.current).length;
            return isNull ? state.current : state.positions.length ? state.positions[0] : {};
        }
    },
    mutations: {
        updatePositions(state, positions) {
            state.positions = positions
        },
        updateCurrent(state, current) {
            state.current = current
        },
        updateToday(state, today){
            state.today = today
        }
    }
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
