<template>
    <div id="app">
        <jc-header :showback="showback" class="header" v-if="headerState"></jc-header>
        <main :style="{paddingTop: headerState ? '40px' : ''}">
            <transition :name="transitionName">
                <keep-alive>
                    <router-view class="animated"></router-view>
                </keep-alive>
            </transition>
        </main>
    </div>
</template>
 
<script>
import JcHeader from "@/components/layout/header.vue";
import UTIL from "@/libs/util.js";
//使用状态管理
import { mapState } from 'vuex';
 
export default {
    name: 'app',
    components: {
        JcHeader
    },
    data() {
        return {
            headerState: true,
            transitionName: 'slideInLeft',
            showback: false
        }
    },
    computed: {
        ...mapState({
            isLoading: state => state.JCFE.isLoading,
        })
    },
    watch: {
        '$route' (to, from) {
            const toDepth = to.path.length;
            this.showback = !(toDepth === 1);
            const fromDepth = from.path.length;
            this.transitionName = toDepth < fromDepth ? 'slideInRight' : 'slideInLeft'
        }
    }
}
</script>
 
<style lang="scss">

    @import 'pages/style.scss';
</style>