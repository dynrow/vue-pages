var jcmp = {};

(function () {

    jcmp._getParameter = function (key) {
        var url = location.search; //获取url中"?"符后的字串
        var params = [];
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            var strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                if (key === strs[i].split("=")[0])
                    return decodeURIComponent(strs[i].split("=")[1]);
            }
        }
    }

    var appId = jcmp._getParameter("client_app_id");
    if (appId && appId.length > 0) {
        window.sessionStorage.setItem("client_app_id", appId);
    }
    var deviceId = jcmp._getParameter("client_device_id");
    if (deviceId && deviceId.length > 0) {
        window.sessionStorage.setItem("client_device_id", deviceId);
    }
    var token = jcmp._getParameter("access_token");
    if (token && token.length > 0) {
        window.sessionStorage.setItem("access_token", token);
    }
    var jcmpUrl = jcmp._getParameter("jcmp_url");
    if (jcmpUrl && jcmpUrl.length > 0) {
        window.sessionStorage.setItem("jcmp_url", jcmpUrl);
    }

    jcmp.version = '0.0.1';
    jcmp.baseUrl = window.sessionStorage.getItem("jcmp_url");//"JCMP_BASE_URL";//默认jcmp地址，可被客户端拦截到
    jcmp.gatewayUrl = jcmp.baseUrl + '/gateway/api/v1/'
    jcmp.convertUrl = jcmp.baseUrl + '/gateway/api/v1/resource?uri=';

    jcmp.isAndroid = (/android/gi).test(navigator.appVersion);
    jcmp.isIOS = (/iphone|ipad/gi).test(navigator.appVersion);

     jcmp.connectWebViewJavascriptBridge=function(callback) {
        if (window.WebViewJavascriptBridge) {
            callback(WebViewJavascriptBridge)
        } else {
            document.addEventListener(
                'WebViewJavascriptBridgeReady'
                , function() {
                    callback(WebViewJavascriptBridge)
                },
                false
            );
        }
    }

    jcmp.fetchData = function (options) {
        jcmp._fetch(options);
    };

    /**
     * 图片与视频地址转换...
     * 传入图片全路径，返回
     */
    jcmp.convertResourceUrl = function (resourceUrl) {
        return (jcmp.convertUrl + window.btoa(resourceUrl)).replace('uri=' ,'uri%3D');
    };

    /**
     * 调用客户端原生方法--登出
     */
    jcmp.logout = function () {
        jcmp.invokeClientMethod("logout");
    };

    /**
     * 调用客户端原生方法--检查更新
     */
    jcmp.updateAndroidApk = function () {
        jcmp.invokeClientMethod("checkUpdate");
    };

    /**
     * 调用客户端原生方法--拨打电话
     * @param phone
     */
    jcmp.callPhone = function (phone) {
        jcmp.invokeClientMethod("callPhone", phone);
    };
    /**
     * 调用客户端原生方法--在浏览器打开
     * @param url
     */
    jcmp.openInBrowser = function (url) {
        jcmp.invokeClientMethod("openInBrowser", url);
    };
    /**
     * 调用客户端原生方法--录音
     * @param callback
     */
    jcmp.audioRecord=function (callback) {
        //register a callback function first.
        jcmp.connectWebViewJavascriptBridge(function(bridge) {
            bridge.registerHandler("audioRecordCallback", function(data, responseCallback) {
                callback(data);
                responseCallback("Got it -->"+data);
            });
        });

        //call native audio record
        console.log("invoke native method.")
        jcmp.invokeClientMethod("audioRecord");
    }

    jcmp.invokeClientMethod = function (methodName, parameter, callback) {
        if (typeof(parameter) === "undefined") {
            parameter = "000";
        }

        if (jcmp.isAndroid) {
            if (window.WebViewJavascriptBridge) {
                WebViewJavascriptBridge.callHandler(
                    methodName
                    , parameter
                    , callback
                );
            } else {
                document.addEventListener(
                    'WebViewJavascriptBridgeReady'
                    , function () {
                        WebViewJavascriptBridge.callHandler(
                            methodName
                            , parameter
                            , callback
                        );
                    },
                    false
                );
            }

        } else if (jcmp.isIOS) {
            window.location.href = "jcmp://jiachengnet.com/" + methodName + "?param=" + window.btoa(parameter);
        } else {
            alert("当前运行环境不允许调用此方法！");
        }
    };

    /**
     *
     * @param options
     *          {type:"POST"/"GET",默认为GET
     *          url:url,
     *          data:postData,
     *          dataType:"json""text""document" 默认json
     *          success:function,
     *          error:function
     *          }
     * @private
     */
    jcmp._fetch = function (options) {

        var formData = new FormData();
        if (options.type && options.type.toUpperCase() === "POST" && options.data) {
            for (var key in options.data) {
                //构造表单数据
                formData.append(key, options.data[key]);
            }
        }
        //创建xhr对象
        var xhr = new XMLHttpRequest();


        //设置xhr请求的超时时间
        xhr.timeout = 10000;
        //设置响应返回的数据格式
        xhr.responseType = options.dataType ? options.dataType : "json";
        //创建一个 post 请求，采用异步
        xhr.open(options.type ? options.type.toUpperCase() : "GET", jcmp.baseUrl + options.url, true);
        xhr.setRequestHeader('client_app_id', jcmp._appId());
        xhr.setRequestHeader('client_device_id', jcmp._deviceId());
        xhr.setRequestHeader('access_token', jcmp._jcmpToken());
        //注册相关事件回调处理函数
        xhr.onload = function (e) {
            if (this.status >= 200 && this.status < 300 || this.status === 304) {
                // alert(this.responseText);
                if (options.success) {
                    var data = (typeof this.response === 'string') ? JSON.parse(this.response) : this.response;
                    options.success(data);
                }
            }
        };

        xhr.ontimeout = function (e) {
            console.error(e)
            if (options.error) {
                options.error(e);
            }
        };
        xhr.onerror = function (e) {
            console.error(e)

            if (options.error) {
                options.error(e);
            }
        };

        xhr.upload.onprogress = function (e) {
            console.log(e)
        };
        try {
            //发送数据
            xhr.send(formData);

        }
        catch (e) {
            console.error(e);
            if (options.error) {
                options.error(e);
            }
        }
    }

    jcmp._fetchNative = function () {

    }

    jcmp._appId = function () {
        return window.sessionStorage.getItem("client_app_id");
    }

    jcmp._deviceId = function () {
        return window.sessionStorage.getItem("client_device_id");
    }

    jcmp._jcmpToken = function () {
        return window.sessionStorage.getItem("access_token");
    }

})();

export default jcmp;