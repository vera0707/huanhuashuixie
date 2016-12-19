 (function($) {
     $(function() {
     /**分享按键*/


            //默认参数
            var defaultParam = {

                size : 'big', //大小图标，默认大图标

                pic : '', //分享图片路径，默认为空（可选）

                url : 'https://www.longdai.com/',  //分享链接(可选),传入的url

                title : '龙贷在线',            //分享标题(可选)

                content : '', //分享内容（可选）

                defaultUrl : 'https://www.longdai.com/', //原始链接(内必须有地址)，默认的url

                shareUrl : '', //分享的链接，默认为空，需要url与defaultUrl匹配结果，最终确认的url

                shareToText : '分享到', //是否显示'分享到',默认显示

                windowOpen : true, //false:采用a-href链接方式打开窗口,true:采用window.open方式,默认为false

                fatherDom : $('body'), //父级dom（容器）（必填）

                //shareList : ['sina','tencent','kaixin','renren','qzone'] //分享列表
                shareList : ['sina','qzone','renren','tencent'] //分享列表

            };

            /**
             *构造函数
             *@param param{object} 自定义参数
             *@returns 返回dom
             */
            function Share( param, special ){

                this.option = $.extend({}, defaultParam, param );
                this.special = special || {};
                this._init();

            };

            /**
             * 扩展原型
             * */
            Share.prototype = {

                /**
                 *规范参数
                 */
                _init : function(){
                    var option = this.option,
                        special = this.special;

                    var shareParam = [];

                    option.shareUrl = option.defaultUrl;

                    if(option.url != ''){
                        option.shareUrl = option.url
                    }

                    $.each(option.shareList,function(i,n){
                        shareParam.push( shareFunctions[n]( option, special ) );
                    });

                    var option = this.option;

                    var domData = '';

                    if(option.windowOpen){
                        domData = this._windowOpen(shareParam);
                    }else{
                        domData =  shareParam;
                    }

                    //生成dom
                    var data = {
                        size : option.size,
                        shareToText : option.shareToText,
                        shareData : domData,
                        shareToText : option.shareToText
                    };

                    var tmpl =  [
                        '<div {@if size == "big"}',
                            'id="share_big"',
                            '{@else}',
                                    'id="share_small"',
                            '{@/if}',
                                    'class="font-0 clearfix">',
                            '{@if shareToText}',
                                        '<span class="share-text">${shareToText}</span>',
                            '{@/if}',
                            '{@each shareData as item}',
                                        '<a id=${item.id}  href=${item.href} title=${item.value}>${item.value}</a>',
                            '{@/each}',
                        '</div>'
                    ].join('');
                    var template = juicer(tmpl,data) ;

                    $(template).appendTo(option.fatherDom);
                    //$('#share_tmpl').tmpl(data).appendTo(option.fatherDom);

                },

                /**
                 * 采用window.open方式打开窗口
                 * @param shareParam{array}:整理后的参数*/
                _windowOpen : function(shareParam){

                    var self = this;

                    $.each(shareParam,function(i, n){

                        var url = n.href,
                            $fatherDom = self.option.fatherDom;

                        $fatherDom.delegate('#'+n.id, 'click', function(){
                            window.open(url,'_blank',"width=640,height=580");
                        });

                        n.href = 'javascript:;';
                    });

                    return shareParam;
                }
            };

            var shareFunctions = {
                /**
                 * 新浪微博
                 * @param option{object} 合并的参数
                 * */
                sina : function(option){

                    var sinaUrl = option.defaultUrl;

                    if( option.url ) {
                        sinaUrl = option.url;
                    }

                    var sinaData = {
                        appkey : '4129234106',
                        title : option.content,
                        url : sinaUrl,
                        pic : option.pic,
                        ralateUid : "",//'1833036580',
                        language : 'zh_cn',
                        rnd : new Date().valueOf()
                    };

                    var hrefData = 'http://v.t.sina.com.cn/share/share.php?' + L.param(sinaData);

                    var tmplData = {
                        size : option.size,
                        value : '新浪微博',
                        id : 'sina_share',
                        href : hrefData
                    };

                    return tmplData;
                },

                /**
                 * 腾讯微博
                 * @param option{object} 合并的参数
                 * @returns 格式化后的参数{array}
                 * */
                tencent : function(option){
                    var tencentData = {
                        appkey : '801111268',
                        url : option.url,
                        title : option.content,
                        pic : option.pic
                    };

                    var hrefData = 'http://v.t.qq.com/share/share.php?' + L.param(tencentData);

                    var tmplData = {
                        size : option.size,
                        value : '腾讯微博',
                        id : 'tencent_share',
                        href : hrefData
                    };

                    return tmplData;
                },

                /**
                 * 开心网
                 * @param option{object} 合并的参数
                 * @returns 格式化后的参数{array}
                 * */
                kaixin : function(option){

                    var kaixinData = {
                        appkey : '100028260',
                        aid : '100028260',
                        style : '11',
                        url : option.url,
                        content : option.content,
                        pic : option.pic
                    };

                    var hrefData = 'http://www.kaixin001.com/rest/records.php?' + L.param(kaixinData);

                    var tmplData = {
                        size : option.size,
                        value : '开心网',
                        id : 'kaixin_share',
                        href : hrefData
                    };

                    return tmplData;
                },

                /**
                 * 人人网
                 * @param option{object} 合并的参数
                 * @returns 格式化后的参数{array}
                 * */
                renren : function(option, special){
                    var renrenData = {
                        api_key : '183996',
                        resourceUrl : special.url || option.shareUrl,
                        title : option.title,
                        pic : option.pic,
                        description : option.content
                    }
                    var hrefData = 'http://widget.renren.com/dialog/share?' + L.param(renrenData);

                    var tmplData = {
                        size : option.size,
                        value : '人人网',
                        id : 'renren_share',
                        href : hrefData
                    };

                    return tmplData;
                },

                /**
                 * QQ空间
                 * @param option{object} 合并的参数
                 * @returns 格式化后的参数{array}
                 * */
                qzone : function(option){
                    var qzoneData = {
                        url : option.shareUrl,
                        title : option.title,
                        summary : option.content,
                        pics : option.pic,
                        site : ''
                    };

                    var hrefData = 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?' + L.param(qzoneData);

                    var tmplData = {
                        size : option.size,
                        value : 'QQ空间',
                        id : 'qzone_share',
                        href : hrefData
                    };

                    return tmplData;
                }
            }

            /**
             *对外接口
             *@param 自定义参数
             *@returns 实例
             */
            window.NS_share = function(param, special){
            	var shareInstance = new Share(param, special);

            	return shareInstance;
            };



    })
})(jQuery);