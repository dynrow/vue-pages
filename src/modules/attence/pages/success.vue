<template>
    <div class="success">
        <router-link class="record" to="/record" replace>
            <i class="jcm-calendar"></i>
        </router-link>
        <div class="success-img">
            <div class="success-bg"></div>
            <h1>打卡成功</h1>
        </div>
        <div class="success-info">
            <p>时间 <span>{{$route.params.time}}</span></p>
            <p>位置 <span>{{$route.params.name}}</span></p>
        </div>
    </div>

</template>

<script>

    export default {

    }

</script>

<style>
</style>
