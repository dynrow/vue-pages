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


<style lang="scss">
@import 'pages/style.scss';
  #app ,.main{
      overflow: hidden;
  }

  .header .mint-header,.footer{
    height: 50px;
  }
  .footer{
    position:fixed;
    bottom: 0;
    right: 0;
    left: 0;
    z-index: 1;
  }
  .footer .mint-tab-item{
    padding: 10px 0;
  }
</style>
