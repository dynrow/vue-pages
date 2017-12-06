//依赖jcmp的库
import jcmp from '../jcmp.js';

//http插件
import axios from 'axios';
//gg
import config from '../../../config';

const REQROOTPATH = config.build.server;

const HTTP = axios.create({
    baseURL: (jcmp.baseUrl ? jcmp.baseUrl : REQROOTPATH) + '/gateway/api/v1',
    //timeout: 5000,
    headers: {
        'client_app_id': jcmp._appId(),
        'client_device_id': jcmp._deviceId(),
        'access_token': jcmp._jcmpToken()
    },
    params: {},
    data: {},
    transformRequest: [function (data) {
        // Do whatever you want to transform the data
        let ret = ''
        for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
        }
        return ret
    }],
});

// 添加请求拦截器
HTTP.interceptors.request.use(function (config) {
    if(config.method.toLocaleLowerCase() === 'post'){
        config.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    }
    // 在发送请求之前做些什么
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

export { HTTP };