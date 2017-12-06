<template>
        <mt-header fixed :title="title" class="mgoa">
            <!-- <div slot="right">JCM</div> -->
            <mt-button v-show="showback" icon="back" slot="left" class="back" @click="goback"></mt-button>
        </mt-header>
</template>

<script>
    export default {
        props: {
            showback: {
                type: Boolean,
                default: true
            }
        },
        name: "jc-header",
        data() {
            return {
                title: document.title
            };
        },
        methods: {
            goback() {
                this.$router.go(-1);
            }
        },
        watch: {
            '$route' (to, from) {
                let _this = this;
                try{
                    _this.title = to.meta.title;
                }catch(e){
                    _this.title = 'JCFE';
                }
            }
        }
    };
</script>

<style lang="scss">
    @import "../../assets/sass/params";
    .mint-header.mgoa{
        background-color: $global-base-color;
        padding-left: 0;
    }
    .mint-button.back {
        width: 40px;
    }
    .mint-header-title{
        font-size: 18px;
    }
</style>
