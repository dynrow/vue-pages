<template>
    <div id="app">
        <jc-header :showback="showback" class="header" v-if="headerState"></jc-header>
        <main :style="{paddingTop: headerState ? '40px' : ''}">
            <transition :name="transitionName">
                <keep-alive>
                    <router-view class="animated" v-if="$route.meta.keepAlive"></router-view>
                </keep-alive>
            </transition>
             <transition :name="transitionName">
                <router-view v-if="!$route.meta.keepAlive" class="animated"></router-view>
            </transition> 
        </main>
    </div>
</template>

<script>
window.addEventListener('touchmove', function(e){
    if ( window.cantouch ){
        e.preventDefault();
    }
});
import JcHeader from "@/components/layout/header.vue";
import JcFooter from "@/components/layout/footer.vue";
//使用状态管理
import {mapState} from 'vuex';

export default {
    name: 'app',
    components: {
        JcHeader,
        JcFooter
    },
    data(){
        return {
            headerState: true,
            transitionName: 'slideInLeft',
            showback: false
        }
    },
    computed: {
        ...mapState({
            isLoading: state => state.JCFE.isLoading
        })
    },
    watch: {
        '$route' (to, from) {
            const toDepth = to.path.length;
            this.showback = !(toDepth === 1);
            const fromDepth = from.path.length;
            this.transitionName = toDepth < fromDepth ? 'slideInRight' : 'slideInLeft';
        }
    }
  }
</script>
<style lang="scss">
    @import 'pages/style.scss';   
</style>
