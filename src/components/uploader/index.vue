<template>
    <div ref="jcmuploader"></div>
</template>

<script>

import JCMUploader from './uploader.js';

export default {
    name: 'Uploader',
    props: {
       options: {
           type: Object
       }
    },
    data(){
        return {}
    },
    mounted(){
        let _this = this;
        let opt = Object.assign({} ,{
            el: _this.$refs.jcmuploader
        }, _this.options); 
        _this.uploader = new JCMUploader(opt);
    },
    methods: {
        removeFile(file){
            this.uploader.removeFile(file);
        }
    }
}
</script>

<style lang="scss">
    @import '../../assets/sass/params';


    .webuploader-container {
        position: relative;
    }

    .webuploader-element-invisible {
        position: absolute !important;
        clip: rect(1px 1px 1px 1px);
        /* IE6, IE7 */
        clip: rect(1px, 1px, 1px, 1px);
    }

    .webuploader-pick {
        position: relative;
        display: inline-block;
        cursor: pointer;
        background: $global-base-color;
        padding: 10px 15px;
        color: #fff;
        text-align: center;
        border-radius: 3px;
        overflow: hidden;
    }

    .webuploader-pick-hover {
        background: $global-base-color;
    }

    .webuploader-pick-disable {
        opacity: 0.6;
        pointer-events: none;
    }
</style>
