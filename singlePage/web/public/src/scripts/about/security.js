/**
 * Created by zhangliyuan on 16/8/16.
 */
/*******************************************************************************
 * Copyright (c) 2005-2016 Gozap, Inc.
 * description:
 * Contributors:
 * sundongzhi  on 16/6/13
 *******************************************************************************/

require("../../styles/about/security.css");

var $ = require("jquery"),
    juicer = require('juicer'),
    L = require('../core/core.js');


$(function() {

    function Security() {
        this.init();
    }

    $.extend(Security.prototype, {
        init: function () {
            var self = this;

            self.bindEvent();
        },
        bindEvent: function () {
            var self = this;


            $('body,html').animate({scrollTop:0},500);


            self.showProgress();


            var startPos={},endPos={};

            $(".security-banner").on("touchstart",function(event){
                //event.preventDefault();                      // 阻止触摸事件的默认行为，即阻止滚屏
                var touch = event.originalEvent.touches[0];                // touches数组对象获得屏幕上所有的touch，取第一个touch
                startPos = {                                 // 取第一个touch的坐标值
                    x: touch.pageX,
                    y: touch.pageY,
                    time: +new Date
                };
            });
            $(".security-banner").on("touchmove",function(event){
                //event.preventDefault();                      // 阻止触摸事件的默认行为，即阻止滚屏
                // 当屏幕有多个touch或者页面被缩放过，就不执行move操作
                if (event.originalEvent.touches.length > 1 || event.scale && event.scale !== 1) return;
                var touch = event.originalEvent.touches[0];
                endPos = {
                    x: touch.pageX - startPos.x,
                    y: touch.pageY - startPos.y
                };


            });
            $(".security-banner").on("touchend",function(event){
                var duration = +new Date - startPos.time;    // 滑动的持续时间

                var $this = $(this),activeIndex = $this.find(".security-banner-li.active").data("index"),indexLenght = $this.find(".security-banner-li").length;

                if (Number(duration) > 100) {
                    // 判断是左移还是右移，当偏移量大于50时执行
                    if (endPos.x > 50) {
                        self.bannerUp($this,activeIndex,indexLenght);
                    } else if(endPos.x < -50) {
                        self.bannerDown($this,activeIndex,indexLenght);
                    }else{


                    }
                }
            });

            $(".security-info-title").on("click",function () {
                var $this = $(this),$par = $this.parent(".security-info-li"),$con = $par.find(".security-info-con");
                if($par.hasClass("active")){
                    $par.removeClass("active");
                    $con.slideUp(300);

                }else{
                    $par.addClass("active");
                    $con.slideDown(300);

                }
            });
            $(".security-progress-li").on("click",function () {
                var $this = $(this);
                if($this.find(".security-progress-txt-title").length == 0){
                    return false;
                }

                var title = $this.find(".security-progress-txt-title").html(),con = $this.find(".security-progress-txt-con").html();

                $(".security-dialog-title").html(title);
                $(".security-dialog-con").html(con);
                $(".security-mask").css("height",document.documentElement.clientHeight);
                $(".security-mask").show().removeClass("animated fadeOutUpBig").addClass("animated fadeInDownBig");
                $("body").css({
                    position : "fixed",
                    overflow : "hidden"
                })


            });

            $(".security-dialog-close").on("click",function () {
                var $this = $(this),title = $this.find(".security-progress-txt-title").html(),con = $this.find(".security-progress-txt-con").html();

                $(".security-mask").removeClass("animated fadeInDownBig").addClass("animated fadeOutUpBig");
                $(".security-dialog-title").html("");
                $(".security-dialog-con").html("");
                $("body").css({
                    position : "static",
                    overflow : "auto"
                })
            });

        },
        showProgress : function () {
            var self = this,progressIndex = 1;
            self.hasShowProgress = true;
            $(".security-progress-li.li"+progressIndex).show().addClass("zoomIn animated");
            $(".security-progress").find(".line"+progressIndex).show().addClass("fadeIn animated");
            var progressTime = setInterval(function () {
                if(progressIndex < 12){
                    progressIndex++;
                    $(".security-progress-li.li"+progressIndex).show().addClass("zoomIn animated");
                    $(".security-progress").find(".line"+progressIndex).show().addClass("fadeIn animated");
                }else{
                    clearInterval(progressTime);
                }
            },300);
        },
        bannerUp : function ($banner,activeIndex,indexLenght) {
            var showIndex = activeIndex;
            if(activeIndex > 1){
                showIndex -- ;
            }else{
                showIndex = indexLenght;
            }
            $banner.find(".security-banner-li").removeClass("active");
            $banner.find(".security-banner-point-icon").removeClass("active");

            $banner.find(".security-banner-li.li" + showIndex).removeClass("animated fadeInRight fadeInLeft").addClass("active animated fadeInLeft");
            $banner.find(".security-banner-point-icon.icon" + showIndex).addClass("active");
        },
        bannerDown : function ($banner,activeIndex,indexLenght) {
            var showIndex = activeIndex;
            if(activeIndex < indexLenght){
                showIndex ++ ;
            }else{
                showIndex = 1;
            }
            $banner.find(".security-banner-li").removeClass("active");
            $banner.find(".security-banner-point-icon").removeClass("active");

            $banner.find(".security-banner-li.li" + showIndex).removeClass("animated fadeInRight fadeInLeft").addClass("active animated fadeInRight");
            $banner.find(".security-banner-point-icon.icon" + showIndex).addClass("active");

        },
        render : function () {

        },
        dialog: function (opts) {
            var self = this,
                $dialog = $(".dialog");


            var dialogHtml = juicer(dialogTmpl, {opts: opts});

            $dialog.html(dialogHtml);


            L.showMask();
            L.setPosition($dialog);


            $(".dialog-btn-cancel,.dialog-btn-sure,#mask").off().on("click", function (e) {
                // e.preventDefault();
                self.dialogClose();

            });


        },
        dialogClose: function () {
            $(".mask").hide();
            $(".dialog").html("");
        }
    });

    new Security();
});