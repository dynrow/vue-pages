'use strict';

class EventBusClass {
    constructor(args) {
        this.listeners = {};
        this.EVENT_TYPE_PROPERTY = 'event_type_property_data';
        this.EVENT_TYPE_FIELD_NAME = 'event_type_field_name';
        this.EVENT_TYPE_FIELD_END_NAME = 'EVENT_TYPE_FIELD_END_NAME';
    }

    addEventListener(type, callback, scope) {
        var args = [];
        var numOfArgs = arguments.length;
        for (var i = 0; i < numOfArgs; i++) {
            args.push(arguments[i]);
        }
        args = args.length > 3 ? args.splice(3, args.length - 1) : [];
        if (typeof this.listeners[type] != "undefined") {
            this.listeners[type].push({ scope: scope, callback: callback, args: args });
        } else {
            this.listeners[type] = [{ scope: scope, callback: callback, args: args }];
        }
    }
    removeEventListener(type, callback, scope) {
        if (typeof this.listeners[type] != "undefined") {
            var numOfCallbacks = this.listeners[type].length;
            var newArray = [];
            for (var i = 0; i < numOfCallbacks; i++) {
                var listener = this.listeners[type][i];
                if (listener.scope == scope && listener.callback == callback) {

                } else {
                    newArray.push(listener);
                }
            }
            this.listeners[type] = newArray;
        }
    }
    hasEventListener(type, callback, scope) {
        if (typeof this.listeners[type] != "undefined") {
            var numOfCallbacks = this.listeners[type].length;
            if (callback === undefined && scope === undefined) {
                return numOfCallbacks > 0;
            }
            for (var i = 0; i < numOfCallbacks; i++) {
                var listener = this.listeners[type][i];
                if ((scope ? listener.scope == scope : true) && listener.callback == callback) {
                    return true;
                }
            }
        }
        return false;
    }
    dispatch(type, target) {
        var event = {
            type: type,
            target: target
        };
        var args = [];
        var numOfArgs = arguments.length;
        for (var i = 0; i < numOfArgs; i++) {
            args.push(arguments[i]);
        };
        args = args.length > 2 ? args.splice(2, args.length - 1) : [];
        args = [event].concat(args);


        if (typeof this.listeners[type] != "undefined") {
            var listeners = this.listeners[type].slice();
            var numOfCallbacks = listeners.length;
            for (var i = 0; i < numOfCallbacks; i++) {
                var listener = listeners[i];
                if (listener && listener.callback) {
                    var concatArgs = args.concat(listener.args);
                    listener.callback.apply(listener.scope, concatArgs);
                }
            }
        }
    }
    getEvents() {
        var str = "";
        for (var type in this.listeners) {
            var numOfCallbacks = this.listeners[type].length;
            for (var i = 0; i < numOfCallbacks; i++) {
                var listener = this.listeners[type][i];
                str += listener.scope && listener.scope.className ? listener.scope.className : "anonymous";
                str += " listen for '" + type + "'\n";
            }
        }
        return str;
    }
}
/**
 * 函数节流
 * 避免调用频率过高 ,对于必须在一些输入（多是一些用户操作）停止到达之后执行的行为有帮助
 * 
 * @param {any} func        要执行的函数
 * @param {any} wait        延时
 * @param {any} immediate   immediate 为 true， debounce会在 wait 时间间隔的开始调用这个函数 
 * @example
 *   UTIL.debounce(function(){
 *      //TODO
 *   }, 100) 
 */
function debounce(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function () {
        var last = Date.now() - timestamp;

        if (last < wait && last >= 0) {
            timeout = setTimeout(later, wait - last);
        } else {
            timeout = null;
            if (!immediate) {
                result = func.apply(context, args);
                if (!timeout) context = args = null;
            }
        }
    };

    return function () {
        context = this;
        args = arguments;
        timestamp = Date.now();
        var callNow = immediate && !timeout;
        if (!timeout) timeout = setTimeout(later, wait);
        if (callNow) {
            result = func.apply(context, args);
            context = args = null;
        }

        return result;
    };
}
/**
 * 日期对象转换
 * 
 * @param {any} stamp   日期对象     new Date()
 * @param {any} format  要转化的格式  yyyy-MM-dd hh:mm:ss
 * @returns 
 */
function format(stamp ,format) {
    var date = {
           "M+": stamp.getMonth() + 1,
           "d+": stamp.getDate(),
           "h+": stamp.getHours(),
           "m+": stamp.getMinutes(),
           "s+": stamp.getSeconds(),
           "q+": Math.floor((stamp.getMonth() + 3) / 3),
           "S+": stamp.getMilliseconds()
    };
    if (/(y+)/i.test(format)) {
           format = format.replace(RegExp.$1, (stamp.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in date) {
           if (new RegExp("(" + k + ")").test(format)) {
                  format = format.replace(RegExp.$1, RegExp.$1.length == 1
                         ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
           }
    }
    return format;
}

export default {
    //高频率触发函数解决方案
    debounce: debounce,
    //事件代理
    EventBus: new EventBusClass(),
    //日期转换
    format: format
}
