/**
 * Created by zhangliyuan on 16/9/9.
 */
require("../../styles/about/companyProfile.css");

var $ = require("jquery"),
    juicer = require('juicer'),
    L = require('../core/core.js');

$(function() {
    function CompanyProfile() {
        this.init();
    }
    $.extend(CompanyProfile.prototype,{
        init : function () {
            var self = this;
            self.bindEvent();

            self.renderBanner();



        },
        bindEvent : function () {
            var self = this;
            $(".company-li-title").on("click",function () {
                var $this = $(this),
                    $par = $this.parent(".company-li"),
                    $con = $par.find(".company-li-con");
                
                if($par.hasClass("show")){
                    $par.removeClass("show");
                    $con.slideUp(300);
                }else{
                    $par.addClass("show");
                    $con.slideDown(300);

                }
            });
            $(".company-progress-time").on("click",function () {
                var $this = $(this),
                    year = $this.data("year");
                if(!$this.hasClass("active")){
                    $(".company-progress-time").removeClass("active");
                    $this.addClass("active");
                    $(".company-progress-con").hide();
                    $(".company-progress-con.con"+year).show();
                }
            });


        },
        renderBanner : function () {            
            var $body = $("body"),
                $bannerCon = $(".company-banner"),
                bodyWidth = $body.width(),
                $bannerList = $(".company-banner-li"),
                bannerListLength = $bannerList.length,
                bannerConWidth = bodyWidth*(bannerListLength-1),
                bannerListWidth = bannerConWidth*(1/bannerListLength),
                bannerConLeft = - bannerListWidth + ((bodyWidth - bannerListWidth)/2);
            $bannerCon.css({
                "width" : bannerConWidth + "px",
                "-webkit-transform": "translate("+bannerConLeft+"px,0)",
                "-moz-transform": "translate("+bannerConLeft+"px,0)",
                "-ms-transform": "translate("+bannerConLeft+"px,0)",
                "-o-transform": "translate("+bannerConLeft+"px,0)",
                "transform": "translate("+bannerConLeft+"px,0)"
            });
            $bannerList.css({
                width : bannerListWidth + "px"
            });


            var startPos={},
                endPos={},
                transformArr, $bannerActive, bannerActiveIndex;

            $(".company-banner").on("touchstart",function(event){
                $bannerActive = $(".company-banner-li.active");
                bannerActiveIndex = Number($bannerActive.data("index"));
                transformArr = $(".company-banner").css('transform').replace(/[^0-9\-,]/g,'').split(',');

                event.preventDefault();                      // 阻止触摸事件的默认行为，即阻止滚屏
                var touch = event.originalEvent.touches[0];                // touches数组对象获得屏幕上所有的touch，取第一个touch
                startPos = {                                 // 取第一个touch的坐标值
                    x: touch.pageX,
                    y: touch.pageY,
                    time: +new Date
                };
            });
            $(".company-banner").on("touchmove",function(event){
                event.preventDefault();                      // 阻止触摸事件的默认行为，即阻止滚屏
                // 当屏幕有多个touch或者页面被缩放过，就不执行move操作
                if (event.originalEvent.touches.length > 1 || event.scale && event.scale !== 1) return;
                var touch = event.originalEvent.touches[0];
                endPos = {
                    x: touch.pageX - startPos.x,
                    y: touch.pageY - startPos.y
                };
                var moveTransform = Number(transformArr[4]) + endPos.x,
                    moveX = Math.abs(endPos.x),
                    nextScale = 0.8 + ((moveX*0.2)/bodyWidth),
                    scaleNow = 1 - ((moveX*0.2)/bodyWidth),
                    nextOpacity= 0.6 + ((moveX*0.4)/bodyWidth),
                    opacityNow = 1 - ((moveX*0.4)/bodyWidth),
                    nextIndex;
                if (endPos.x > 0) {
                    nextIndex = bannerActiveIndex - 1;
                } else if(endPos.x < 0) {
                    nextIndex = bannerActiveIndex + 1;
                }
                $(".company-banner").css({
                    "-webkit-transform": "translate("+ moveTransform +"px,0)",
                    "-moz-transform": "translate("+ moveTransform +"px,0)",
                    "-ms-transform": "translate("+ moveTransform +"px,0)",
                    "-o-transform": "translate("+ moveTransform +"px,0)",
                    "transform": "translate("+ moveTransform +"px,0)"
                });
                $bannerActive.css({
                    "-webkit-transform": "scale("+scaleNow+","+scaleNow+")",
                    "-moz-transform": "scale("+scaleNow+","+scaleNow+")",
                    "-ms-transform": "scale("+scaleNow+","+scaleNow+")",
                    "-o-transform": "scale("+scaleNow+","+scaleNow+")",
                    "transform": "scale("+scaleNow+","+scaleNow+")",
                    "-ms-filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity="+(opacityNow*100)+")",
                    "filter": "alpha(opacity="+(opacityNow*100)+")",
                    "moz-opacity": opacityNow,
                    "-khtml-opacity": opacityNow,
                    "opacity": opacityNow
                });
                $(".company-banner-li.li"+nextIndex).css({
                    "-webkit-transform": "scale("+nextScale+","+nextScale+")",
                    "-moz-transform": "scale("+nextScale+","+nextScale+")",
                    "-ms-transform": "scale("+nextScale+","+nextScale+")",
                    "-o-transform": "scale("+nextScale+","+nextScale+")",
                    "transform": "scale("+nextScale+","+nextScale+")",
                    "-ms-filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity="+(nextOpacity*100)+")",
                    "filter": "alpha(opacity="+(nextOpacity*100)+")",
                    "moz-opacity": nextOpacity,
                    "-khtml-opacity": nextOpacity,
                    "opacity": nextOpacity
                });


            });
            $(".company-banner").on("touchend",function(event){
                var duration = +new Date - startPos.time;    // 滑动的持续时间

                if (Number(duration) > 100) {
                    var moveTransform;
                    // 判断是左移还是右移，当偏移量大于50时执行
                    if (endPos.x > 50) {
                        bannerActiveIndex--;
                    } else if(endPos.x < -50) {
                        bannerActiveIndex++;
                    }

                    if( bannerActiveIndex <= 1){
                        bannerActiveIndex = 1;
                        moveTransform = (bodyWidth - bannerListWidth)/2;
                    }else if( bannerActiveIndex > bannerListLength){
                        bannerActiveIndex = bannerListLength;
                        moveTransform = ((bodyWidth - bannerListWidth)/2) - bannerListWidth*(bannerActiveIndex-1) ;
                    }else{
                        moveTransform = ((bodyWidth - bannerListWidth)/2) - bannerListWidth*(bannerActiveIndex-1) ;
                    }



                    $(".company-banner-li").removeClass("active")
                    .css({
                        "-webkit-transform": "scale(0.8,0.8)",
                        "-moz-transform": "scale(0.8,0.8)",
                        "-ms-transform": "scale(0.8,0.8)",
                        "-o-transform": "scale(0.8,0.8)",
                        "transform": "scale(0.8,0.8)",
                        "-ms-filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=60)",
                        "filter": "alpha(opacity=60)",
                        "moz-opacity": "0.6",
                        "-khtml-opacity": "0.6",
                        "opacity": "0.6"
                    });

                    $(".company-banner-li.li" + bannerActiveIndex).addClass("active")
                    .css({
                        "-webkit-transform": "scale(1,1)",
                        "-moz-transform": "scale(1,1)",
                        "-ms-transform": "scale(1,1)",
                        "-o-transform": "scale(1,1)",
                        "transform": "scale(1,1)",
                        "-ms-filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)",
                        "filter": "alpha(opacity=100)",
                        "moz-opacity": "1",
                        "-khtml-opacity": "1",
                        "opacity": "1"
                    });

                    $(".company-banner").css({
                        "-webkit-transform": "translate("+ moveTransform.toFixed(0) +"px,0)",
                        "-moz-transform": "translate("+ moveTransform.toFixed(0) +"px,0)",
                        "-ms-transform": "translate("+ moveTransform.toFixed(0) +"px,0)",
                        "-o-transform": "translate("+ moveTransform.toFixed(0) +"px,0)",
                        "transform": "translate("+ moveTransform.toFixed(0) +"px,0)"
                    });

                }
            });

            
        }
    });
    new CompanyProfile();
});