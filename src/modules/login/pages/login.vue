<template>
    <div class="login">
        <h1><i></i><span>嘉诚移动智能政务办公平台</span></h1>
        <form class="loginForm" action="" method="post">
            <a href="/info.html">gagfd</a>
            <div class="form">
                <div class="user">
                    <input type="text" class="username" name="username" placeholder="用户名" v-model="userName"/>
                    <label>
                        <i class="jcm-user7"></i>
                    </label>
                </div>
                <div class="psd">
                    <input type="password" class="password" name="password" placeholder="密 码" v-model="password"
                           v-on:keyup.enter="login"/>
                    <label>
                        <i class="jcm-psd"></i>
                    </label>
                </div>
                <!-- <div class="remember">
                    <input type="checkbox" value="1" id="checkbox1" name=""/>记住密码
                    <label for="checkbox1"></label>
                </div> -->
                <a href="#" class="submit" @click="login">登  录</a>
            </div>
        </form>
    </div>
</template>
<script>
    import axios from 'axios';
    import {Toast} from 'mint-ui';
    import config from '../../../../config';
    const uuid = (()=>{
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {

            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        }).toUpperCase();
    })();
    const JCMPLOGINURL = config.build.server;

    axios.interceptors.request.use(function (config) {
        if (config.method.toLocaleLowerCase() === 'post') {
            config.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
            config.headers['client_app_id'] = 'com.jc.android.app.goa';
            config.headers['client_device_id'] = uuid;
        }
        // 在发送请求之前做些什么
        return config;
    }, function (error) {
        // 对请求错误做些什么
        return Promise.reject(error);
    });

    export default {
        data() {
            return {
                userName: 'admin',
                password: 'admin'
            }
        },
        methods: {
            login() {
                //把参数更改成url形式, 否则后台接收不到数据
                let _this = this;
                if (_this.userName && _this.password) {
                    axios({
                        method: 'post',
                        url: JCMPLOGINURL + '/gateway/api/login',
                        data: {
                            userName: _this.userName,
                            password: _this.password
                        },
                        transformRequest: [function (data) {
                            let ret = ''
                            for (let it in data) {
                                ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                            }
                            return ret
                        }],
                    }).then((res) => {
                        if (res.data.code === '000000') {
                            _this.sign(res.data);
                        } else {
                            Toast({message: res.data.errormsg});
                        }
                    }).catch(() => {
                        Toast({message: res.data.errormsg});
                    })
                }
            },
            sign(data) {
                if (window && window.sessionStorage) {
                    sessionStorage.setItem("client_app_id", 'com.jc.android.app.goa');
                    sessionStorage.setItem("client_device_id", uuid);
                    sessionStorage.setItem("access_token", data.access_token);
                    sessionStorage.setItem("jcmp_url", JCMPLOGINURL);
                    window.location.pathname = config.dev.home;
                }
            }
        }
    }
</script>
<style lang="scss">
    @import '../../../assets/sass/params.scss';

    .login {
        height: 100vh;
        background: url("../image/login-bg.png") no-repeat;
        background-size: 100% 100%;
        h1 {
            position: absolute;
            top: 100px;
            line-height: 45px;
            overflow: hidden;
            padding: 0 20px;
            i {
                display: inline-block;
                width: 80px;
                height: 45px;
                margin-right: 15px;
                background: url("../image/logo-bg.png") no-repeat center;
                background-size: 100% 100%;
            }
            span {
                float: right;
                color: #fff;
                font-size: 26px;
            }
        }
        .form {
            width: 100%;
            position: absolute;
            top: 260px;
            padding: 0 20px;
            .user, .psd {
                position: relative;
                label {
                    font-size: 30px;
                    color: #fff;
                    position: absolute;
                    top: 0;
                    left: 10px;
                }
            }
            .username, .password {
                width: 100%;
                height: 45px;
                margin-bottom: 15px;
                border: 1px solid #fff;
                border-radius: 20px;
                background: transparent;
                padding-left: 45px;
                color: #999;
            }

            /*记住密码*/
            .remember {
                width: 80px;
                float: right;
                position: relative;
                input[type=checkbox] {
                    visibility: hidden;
                }
                label {
                    cursor: pointer;
                    position: absolute;
                    width: 20px;
                    height: 20px;
                    top: 0;
                    left: -20px;
                    background: #fff;
                    border: 1px solid #c3aba6;
                    -moz-border-radius: 3px; /* Gecko browsers */
                    -webkit-border-radius: 3px; /* Webkit browsers */
                    border-radius: 3px; /* W3C syntax */
                    opacity: 0.7;
                }
                label:after {
                    opacity: 0;
                    content: '';
                    position: absolute;
                    width: 9px;
                    height: 5px;
                    background: transparent;
                    top: 6px;
                    left: 6px;
                    border: 1px solid #333;
                    border-top: none;
                    border-right: none;
                    -webkit-transform: rotate(-45deg);
                    -moz-transform: rotate(-45deg);
                    -o-transform: rotate(-45deg);
                    -ms-transform: rotate(-45deg);
                    transform: rotate(-45deg);
                }
                label:hover::after {
                    opacity: 0.5;
                }
                input[type=checkbox]:checked + label:after {
                    opacity: 1;
                }
            }
        }

        .submit {
            display: block;
            width: 100%;
            height: 40px;
            line-height: 40px;
            border-radius: 20px;
            background: #1f8eff;
            text-align: center;
            color: #fff;
            box-shadow: 2px 2px 10px #000;
            margin-top: 45px;
            font-size: 18px;
            &:active {
                color: #fff;
            }
        }
    }

</style>
