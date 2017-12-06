<template>
    <div id="app">
        <jc-header :showback="showback" class="header" v-if="headerState"></jc-header>
        <main :style="{marginTop: headerState ? '40px' : ''}">
            <transition>
                <keep-alive>
                    <router-view></router-view>
                </keep-alive>
            </transition>
        </main>
    </div>
</template>

<script>
import JcHeader from "@/components/layout/header.vue";
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
        }
    }
}
</script>


<style>
    #app {
        color: #2c3e50;
        height: 100vh;
        background: #fff;
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    }
</style>
