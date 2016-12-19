var $ = require("jquery");
var juicer = require('juicer');    

var L = {};
        // param 方法 序列化对象
        function paramFn( o, beanName ) {
            var target = {};

            if (beanName && !_.isArray(o)) {
                $.each(o, function(n, v){
                    n = beanName + "." + n;
                    target[n] = v;
                });

            } else {
                target = o;
            }

            return param(target, beanName);
        }

        function param(obj, beanName) {
            var ret = [],

                add = function(key, value) {
                    value = $.isFunction(value) ? value() : value;
                    ret.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
                };

            // Serialize the form elements
            if (_.isArray(obj)) {
                $.each(obj, function(i, v) {
                    var name = beanName ? beanName + "." + v.name : v.name;
                    add(name, v.value);
                });

            } else {
                for (var prefix in obj) {
                    buildParams(prefix, obj[prefix], add);
                }
            }

            return ret.join("&");
        }

        function buildParams(prefix, obj, add) {
            if (_.isArray(obj)) {
                $.each(obj, function(i, v) {
                    buildParams(prefix + "[" + i + "]", v, add);
                });

            } else if (obj != null && typeof obj === "object") {
                for (var name in obj) {
                    buildParams(prefix + "." + name, obj[name], add);
                }

            } else {
                add(prefix, obj);
            }
        }



        var coreFunctions = {
             /**
             * 显示蒙板
             */
            showMask: function(boo) {
                var $mask = $("#mask");

                    if( $mask.length === 0 ) {
                        $('body').append("<div id='mask' class='mask'></div>");
                    }

                if( !boo ) {
                    $("#mask").css({
                        width: Math.max(document.documentElement.scrollWidth, document.documentElement.clientWidth),
                        height: Math.max(document.documentElement.scrollHeight, document.documentElement.clientHeight),
                        opacity:"0.5",
                        filter:"alpha(opacity=50)"
                    }).show();
                } else {
                    $("#mask").css({
                        width: Math.max(document.documentElement.scrollWidth, document.documentElement.clientWidth),
                        height: Math.max(document.documentElement.scrollHeight, document.documentElement.clientHeight),
                        opacity:"0.9",
                        filter:"alpha(opacity=90)"
                    }).show();
                }

            },

            /**
             * 隐藏蒙板
             */
            hideMask: function() {
                $("#mask").hide();
            },
            /**
             * 定位在某个目标元素下方,没有目标元素则定位在屏幕中间
             * @param $elem{JQuery} 要定位的元素
             * @param options{JSON} 其中的属性：target{JQuery}: 相对定位的目标对象，offset{JSON}: 偏移值，container{JQuery}：要插入的容器
             * @return void
             */
            setPosition: function(elem, options){
                var defaults = {target: null, offset: {left: 0, top: 0}, container: $(document.body), position: "bottom"},

                    opts = $.extend({}, defaults, options),

                    left, top;

                if (null !== opts.target) {
                    var offset = opts.target.offset(),

                        position = opts.position;

                    if (position === "left") {
                        left = offset.left - elem.width();
                        top = offset.top;

                    } else if (position === "right") {
                        left = offset.left + opts.target.outerWidth();
                        top = offset.top;

                    } else if (position === "top") {
                        left = offset.left;
                        top = offset.top - elem.height();

                    } else {
                        left = offset.left;
                        top = offset.top + opts.target.outerHeight();
                    }

                    left += opts.offset.left;
                    top += opts.offset.top;

                } else {
                    var cwidth = document.documentElement.clientWidth,

                        cheight = document.documentElement.clientHeight,

                        width = elem.width(),

                        height = elem.height();

                    left = Math.max(0, (cwidth - width)/2) + document.documentElement.scrollLeft + document.body.scrollLeft;
                    top = Math.max(0, (cheight - height)/2) + document.documentElement.scrollTop + document.body.scrollTop;
                }

                elem.css({
                    position: 'absolute',
                    zIndex: '101'
                });
                elem.offset({
                    left : left,
                    top : top
                })
            },
            /**
             *
             * @param $doms
             * @param fn
             */
            bodyClick : function( $doms, fn ) {

                _.each( $doms, function( dom ) {
                    dom.click( function( e ) { e.stopPropagation() } );
                });

                $( 'html' ).click( function( e ) {
                    fn.apply( null, arguments );
                });
            },
            getRandomId: function (n) {
                var chars = ['0','1','2','3','4','5','6','7','8','9','0','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
                var id = "", index;
                for (var i = 0; i < n; i++) {
                    index = Math.floor(Math.random()*35);
                    id += chars[index];
                }
                return id;
            },
            isToJson: function (str) {
                var obj = {};
                if( _.isObject(str) ){
                    obj = str;
                }else{
                    obj = JSON.parse(str);
                }
                return obj;
            },
            /**
             * 判断是否在longdai应用内打开,时间3s
             * @param url 客户端跳转链接地址
             * @param mUrl m站点跳转链接地址
             */
            testApp : function (url,mUrl) {
                var timeout, t = 1000, hasApp = true;
                setTimeout(function () {
                    if (hasApp) {
                        location.href = url;
                    } else {
                        location.href = mUrl;
                    }
                    document.body.removeChild(ifr);
                }, 2000);

                var t1 = Date.now();
                var ifr = document.createElement("iframe");
                ifr.setAttribute('src', url);
                ifr.setAttribute('style', 'display:none');
                document.body.appendChild(ifr);
                timeout = setTimeout(function () {
                    var t2 = Date.now();
                    if (!t1 || t2 - t1 < t + 100) {
                        hasApp = false;
                    }
                }, t);
            }
            

        }



        L = coreFunctions;
        L.param = paramFn;

    module.exports = L;