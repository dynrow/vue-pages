<template>
  <div id="app">
    <jc-header :showback="showback" class="header" v-if="headerState"></jc-header>
    <main :style="{bottom: footerState ? '53px' : '0',paddingTop: headerState ? '40px' : ''}" class="main">
      <!--动画-->
          <transition :name="transitionName">
            <!--<keep-alive>缓存-->
              <router-view  class="animated"></router-view>
          </transition>
    </main>
    <jc-footer class="writeEmail" v-if="footerState"></jc-footer>
    <!-- 页面切换时执行的动画 -->
    <div class="mint-indicator" v-if="isLoading">
        <div class="mint-indicator-wrapper" style="padding: 15px;">
            <span class="mint-indicator-spin">
                <div class="mint-spinner-snake" style="border-top-color: rgb(204, 204, 204); border-left-color: rgb(204, 204, 204); border-bottom-color: rgb(204, 204, 204); height: 32px; width: 32px;"></div>
            </span>
           <!--<span class="mint-indicator-text">加载中...</span> -->
        </div>
    </div>
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
            isLoading: state => state.JCFE.isLoading,
            footerState: state => state.MAIL.isfooterState,
        })
    },
    watch: {
        '$route' (to, from) {
            const toDepth = to.path.length;
            this.showback = !(toDepth === 1);
            const fromDepth = from.path.length;
            this.transitionName = toDepth < fromDepth ? 'slideInRight' : 'slideInLeft'
        }
    },
    methods: {}
  }
</script>


<style lang="scss">
    @import 'pages/style.scss';
 
</style>
