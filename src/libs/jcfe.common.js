/**
 * 放入公共引入的文件或者自定义
 */

import Vue from 'vue';
import Mint from 'mint-ui';

import 'mint-ui/lib/style.css';

import '@/assets/sass/base.scss';

import '../../static/css/fontface.css';
//引用mint插件
Vue.use(Mint);

//设置为 false 以阻止 vue 在启动时生成生产提示。
Vue.config.productionTip = false;
//解决click点击300毫秒延时问题
import FastClick from 'fastclick';

import Api from './api';

FastClick.attach(document.body);

Vue.prototype.Api = Api;

import Config from '../../config';

export default Config