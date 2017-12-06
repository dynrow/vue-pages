//http插件
import axios from 'axios';
//获取配置信息
import config from '../../../config';

//const REQROOTPATH = 'http://'+config.dev.ip+':'+config.dev.port+'/server/';
const REQROOTPATH = 'http://172.16.3.77:7120/goa';

const HTTP = axios.create({
    baseURL: REQROOTPATH,
    //timeout: 5000,
    params: {},
    data: {}
});

const URL_MAPPING = {
    'getInfoAll': '/im/info4rtx/managerMainPage.action',
    'getInfoDetail': '/im/info4rtx/getInfoById.action',
    'getTodoList': '/im/info4rtx/manageInfoTodoList.action',
    'getTodoSize': '/im/info4rtx/manageInfoTodoSize.action',
    'getInfoList': '/im/info4rtx/managerInfoViewList.action',
    'commitApproval': '/im/info4rtx/updateFromRtx.action'
}

// 添加请求拦截器
HTTP.interceptors.request.use(function (config) {
    Object.keys(URL_MAPPING).forEach((intefaceName)=>{
        if(config.url.lastIndexOf(intefaceName) >= 0){
            let suffix = '',index = config.url.indexOf('?');
            if(index >= 0) suffix = config.url.substring(index ,config.url.length);
            config.url = config.baseURL + URL_MAPPING[intefaceName] + suffix;
        }
    });
   
    if(config.method.toLocaleLowerCase() === 'get'){
        config.params.userId = '200001';
    }
    if(config.method.toLocaleLowerCase() === 'post'){
        config.data.userId = '200001';
    }
    config.data['login-at'] = true;
    // 在发送请求之前做些什么
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});


export { HTTP };