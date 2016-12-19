/**
 * 顶部提示
 */
 (function($) {
    $(function() {
        var tipsContainer = false; // 提示容器

        var tipsTimeout = false; // 提示定时器

        var TOP_TIPS_DELAY = 3000; // 默认延迟时间

        var isShow = false;

        var lastShowTime = null;

        var TIPS_TYPE = {   // 提示类型
            loading : 'loading',
            success : 'success',
            error : 'error',
            warning : 'warning'
        };

        /**
         * 显示提示
         * @param type
         * @param text
         * @param delay
         */
        var show = function( type, text, delay ) {

            if( !tipsContainer ) createContainer();

            var t = TIPS_TYPE,

                container = tipsContainer,

                o = container.children(),

                closeBtn = o.children("a"),

                span = o.find("span"),

                type = type || t.loading;

            delay = delay || TOP_TIPS_DELAY;

            if (type === t.loading) {
                span.css("margin", "0 20px");
                closeBtn.hide();
                text = text || '数据加载中...';
                o.css({
                    borderColor: "#99ccff",
                    backgroundColor: "#cae1fe"
                });

            } else {
                span.css("margin", "0 30px 0 10px");
                closeBtn.show().removeClass().addClass("icon-common-image");
                if (type === t.success) {
                    o.css({
                        borderColor: "#34cb00",
                        backgroundColor: "#ccffcc"
                    });
                    closeBtn.addClass("icon-close-success");

                } else if (type === t.error) {
                    o.css({
                        borderColor: "#ff9999",
                        backgroundColor: "#ffcccc"
                    });
                    closeBtn.addClass("icon-close-fail");

                } else if (type === t.warning) {
                    o.css({
                        borderColor: "#f3c302",
                        backgroundColor: "#ffffd5"
                    });
                    closeBtn.addClass("icon-close-warning");
                }

                if (tipsTimeout) {
                    tipsTimeout = clearTimeout(tipsTimeout);
                }

                tipsTimeout = setTimeout(function() {
                    container.hide();
                    tipsTimeout = null;
                }, delay);
            }
            o.find("span").html(text);
            container.show();
        };

        /**
         * 隐藏提示
         * @return {Boolean}
         */
        var hide = function() {
            if( !tipsContainer ) return false;

            if (tipsTimeout) {
                tipsTimeout = clearTimeout(tipsTimeout);
            }

            tipsContainer.hide();
        };

        /**
         * 插入提示容器
         */
        var createContainer = function() {

            tipsContainer = $( TIPS_HTML );

            $( 'body' ).append( tipsContainer );

            tipsContainer.find( '#tips_top_container_close' ).click( hide );
        };

        // 提示容器HTML
        var TIPS_HTML = '<div id="tips_top_container">' +
            '<div class="inline-block tips-top" style="font-family:宋体">' +
                '<span class="tips-top-text"></span>' +
                '<a id="tips_top_container_close" href="javascript:;" class="inline-block icon-tips-close"></a>' +
            '</div>' +
        '</div>';


        /**
         * 显示顶部提示信息
         * @param type{String} 类型
         * @param text{String} 提示文字
         * @param delay{Number} 提示显示时间(s)
         */
        L.showTopTips = function( type, message, delay ) {
            isShow = true;
            lastShowTime = new Date().getTime();
            show( type, message, delay );
        };

        /**
         * 隐藏顶部提示
         */
        var hideTopTips = function() {
            isShow = false;
            hide();
        }
        L.hideTopTips = hideTopTips;

        // 起个定时程序检查并清除toptips
        window.setInterval(function() {
            if (isShow) {
                var currentTime = new Date().getTime();
                // 显示的超过10秒，自动消失
                if (null == lastShowTime ||
                        (currentTime - lastShowTime > 3 * 1000)) {
                    hideTopTips();
                }
            }
        }, 3000);

        // 设置成为ajax的异常处理器
        //window.globalAjaxErrorHandler = exports.showTopTips;
       // window.globalAjaxSuccessHandler = exports.showTopTips;
    });
 })(jQuery);

