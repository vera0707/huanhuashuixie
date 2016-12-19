/**
 * Created by lishuxia on 16/12/12.
 */
require("../../styles/activity/myFinancialLife.css");

var $ = require("jquery"),
       CountUp = require('CountUp');
!function($){

    var defaults = {
        sectionContainer: "section",
        easing: "ease",
        beforeMove: null,
        afterMove: null,
        animationTime: 1000,
        pagination: true,
        updateURL: false
    };

    /*------------------------------------------------*/
    /*  Credit: Eike Send for the awesome swipe event */
    /*------------------------------------------------*/

    $.fn.swipeEvents = function() {
        return this.each(function() {

            var startX,
                startY,
                $this = $(this);
            window.current = window.next = window.pos = window.deltaOfInterest = null;

            $this.bind('touchstart', touchstart);

            function touchstart(event) {
                var touches = event.originalEvent.touches;
                if (touches && touches.length) {
                    startX = touches[0].pageX;
                    startY = touches[0].pageY;
                    $this.bind('touchmove', touchmove);
                }
                //event.preventDefault();
            }

            function touchmove(event) {
                var touches = event.originalEvent.touches;
                if (touches && touches.length) {
                    var deltaX = startX - touches[0].pageX;
                    var deltaY = startY - touches[0].pageY;

                    if (deltaX >= 50) {
                        $this.trigger("swipeLeft");
                    }
                    if (deltaX <= -50) {
                        $this.trigger("swipeRight");
                    }
                    if (deltaY >= 50) {
                        $this.trigger("swipeUp");
                    }
                    if (deltaY <= -50) {
                        $this.trigger("swipeDown");
                    }
                    if (Math.abs(deltaX) >= 50 || Math.abs(deltaY) >= 50) {
                        $this.unbind('touchmove', touchmove);
                    }
                }
                event.preventDefault();
            }

        });
    };


    $.fn.onepage_scroll = function(options){
        var settings = $.extend({}, defaults, options),
            el = $(this),
            sections = $(settings.sectionContainer),
            total = sections.length,
            status = "off",
            topPos = 0,
            lastAnimation = 0,
            quietPeriod = 500,
            paginationList = "";

        $.fn.transformPage = function(settings, pos, index) {

            //if (typeof settings.beforeMove == 'function') settings.beforeMove(index);
            $(this).css({
                "-webkit-transform": "translate3d(0, " + pos + "%, 0)",
                "-webkit-transition": "all " + settings.animationTime + "ms " + settings.easing,
                "-moz-transform": "translate3d(0, " + pos + "%, 0)",
                "-moz-transition": "all " + settings.animationTime + "ms " + settings.easing,
                "-ms-transform": "translate3d(0, " + pos + "%, 0)",
                "-ms-transition": "all " + settings.animationTime + "ms " + settings.easing,
                "transform": "translate3d(0, " + pos + "%, 0)",
                "transition": "all " + settings.animationTime + "ms " + settings.easing
            });

            $(this).one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(e) {
                if (typeof settings.afterMove == 'function') settings.afterMove(index);
            });
        }

        $.fn.moveDown = function() {
            var el = $(this),
                index = $(settings.sectionContainer +".active").data("index"),
                $btn =  $('.go-btn');
            if(index == 2){
                $btn.hide();
            }else{
                $btn.show();
            }
            if(index < total) {
                current = $(settings.sectionContainer + "[data-index='" + index + "']");
                next = $(settings.sectionContainer + "[data-index='" + (index + 1) + "']");
                if(next) {
                    if (typeof settings.beforeMove == 'function') {
                        settings.beforeMove( next.data("index"));
                    }
                    current.removeClass("active")
                    next.addClass("active");
                    if(settings.pagination == true) {
                        $(".onepage-pagination li a" + "[data-index='" + index + "']").removeClass("active");
                        $(".onepage-pagination li a" + "[data-index='" + (index + 1) + "']").addClass("active");
                    }
                    $("body")[0].className = $("body")[0].className.replace(/\bviewing-page-\d.*?\b/g, '');
                    $("body").addClass("viewing-page-"+next.data("index"))

                    if (history.replaceState && settings.updateURL == true) {
                        var href = window.location.href.substr(0,window.location.href.indexOf('#')) + "#" + (index + 1);
                        history.pushState( {}, document.title, href );
                    }


                }
                pos = (index * 100) * -1;
                el.transformPage(settings, pos,index);
            }
        }

        $.fn.moveUp = function() {
            var el = $(this),
                index = $(settings.sectionContainer +".active").data("index");
                $('.go-btn').show();
            if(index <= total && index > 1) {
                current = $(settings.sectionContainer + "[data-index='" + index + "']");
                next = $(settings.sectionContainer + "[data-index='" + (index - 1) + "']");

                if(next) {

                    if (typeof settings.beforeMove == 'function') settings.beforeMove(next.data("index"));
                    current.removeClass("active")
                    next.addClass("active")
                    if(settings.pagination == true) {
                        $(".onepage-pagination li a" + "[data-index='" + index + "']").removeClass("active");
                        $(".onepage-pagination li a" + "[data-index='" + (index - 1) + "']").addClass("active");
                    }
                    $("body")[0].className = $("body")[0].className.replace(/\bviewing-page-\d.*?\b/g, '');
                    $("body").addClass("viewing-page-"+next.data("index"))

                    if (history.replaceState && settings.updateURL == true) {
                        var href = window.location.href.substr(0,window.location.href.indexOf('#')) + "#" + (index - 1);
                        history.pushState( {}, document.title, href );
                    }
                }
                pos = ((next.data("index") - 1) * 100) * -1;
                el.transformPage(settings, pos,index);

                //if (typeof settings.beforeMove == 'function') settings.beforeMove(index);
            }
        }

        function init_scroll(event, delta) {
            deltaOfInterest = delta;
            var timeNow = new Date().getTime();
            // Cancel scroll if currently animating or within quiet period
            if(timeNow - lastAnimation < quietPeriod + settings.animationTime) {
                event.preventDefault();
                return;
            }

            if (deltaOfInterest < 0) {
                el.moveDown()
            } else {
                el.moveUp()
            }
            lastAnimation = timeNow;
        }

        // Prepare everything before binding wheel scroll

        el.addClass("onepage-wrapper").css("position","relative");
        $.each( sections, function(i) {
            $(this).css({
                position: "absolute",
                top: topPos + "%"
            }).addClass("section").attr("data-index", i+1);
            topPos = topPos + 100;
            if(settings.pagination == true) {
                paginationList += "<li><a data-index='"+(i+1)+"' href='#" + (i+1) + "'></a></li>"
            }
        });

        el.swipeEvents().bind("swipeDown",  function(){
            el.moveUp();
        }).bind("swipeUp", function(){
            el.moveDown();
        });

        // Create Pagination and Display Them
        if(settings.pagination == true) {
            $("<ul class='onepage-pagination'>" + paginationList + "</ul>").prependTo("body");
            posTop = (el.find(".onepage-pagination").height() / 2) * -1;
            el.find(".onepage-pagination").css("margin-top", posTop);
        }

        if(window.location.hash != "" && window.location.hash != "#1") {
            init_index =  window.location.hash.replace("#", "")
            $(settings.sectionContainer + "[data-index='" + init_index + "']").addClass("active")
            $("body").addClass("viewing-page-"+ init_index)
            if(settings.pagination == true) $(".onepage-pagination li a" + "[data-index='" + init_index + "']").addClass("active");

            next = $(settings.sectionContainer + "[data-index='" + (init_index) + "']");
            if(next) {
                next.addClass("active")
                if(settings.pagination == true) $(".onepage-pagination li a" + "[data-index='" + (init_index) + "']").addClass("active");
                $("body")[0].className = $("body")[0].className.replace(/\bviewing-page-\d.*?\b/g, '');
                $("body").addClass("viewing-page-"+next.data("index"))
                if (history.replaceState && settings.updateURL == true) {
                    var href = window.location.href.substr(0,window.location.href.indexOf('#')) + "#" + (init_index);
                    history.pushState( {}, document.title, href );
                }
            }
            pos = ((init_index - 1) * 100) * -1;
            el.transformPage(settings, pos, init_index);

        }else{
            $(settings.sectionContainer + "[data-index='1']").addClass("active")
            $("body").addClass("viewing-page-1")
            if(settings.pagination == true) $(".onepage-pagination li a" + "[data-index='1']").addClass("active");
        }
        if(settings.pagination == true)  {
            $(".onepage-pagination li a").click(function (){
                var page_index = $(this).data("index");
                if (!$(this).hasClass("active")) {
                    current = $(settings.sectionContainer + ".active")
                    next = $(settings.sectionContainer + "[data-index='" + (page_index) + "']");
                    if(next) {
                        current.removeClass("active")
                        next.addClass("active")
                        $(".onepage-pagination li a" + ".active").removeClass("active");
                        $(".onepage-pagination li a" + "[data-index='" + (page_index) + "']").addClass("active");
                        $("body")[0].className = $("body")[0].className.replace(/\bviewing-page-\d.*?\b/g, '');
                        $("body").addClass("viewing-page-"+next.data("index"))
                    }
                    pos = ((page_index - 1) * 100) * -1;
                    el.transformPage(settings, pos, init_index);
                }
                if (settings.updateURL == false) return false;
            });
        }



        $(document).bind('mousewheel DOMMouseScroll', function(event) {
            event.preventDefault();
            var delta = event.originalEvent.wheelDelta || -event.originalEvent.detail;
            init_scroll(event, delta);
        });
        return false;

    }

}($);


$(function () {
    function Finanical() {
        this.token = null;
        this.billingKey = null;
        this.lastIndex = 1;
        this.userData = null;
        this.init();
    }

    $.extend(Finanical.prototype, {
        init: function () {
            var self = this;
            if (self.getUrlParameter("access_token") && self.getUrlParameter("access_token") != "null") {
                self.token = self.getUrlParameter("access_token");
                self.ajaxUserData(1);
            }else if(self.getUrlParameter("token") && self.getUrlParameter("token") != "null"){
                self.token = self.getUrlParameter("token");
                self.ajaxUserData(1);
            }else if (self.getUrlParameter("billingKey") && self.getUrlParameter("billingKey") != "null") {
                self.billingKey = self.getUrlParameter("billingKey");
                self.ajaxUserData(2)
            }else {
                $('.mast').html('用户不存在');
            }




        },
        bindEvent: function () {
            var self = this,
                url = self.userData.shareUrl,
                title = encodeURIComponent(self.userData.userName + '的龙贷理财生活'),
                image = encodeURIComponent('https://cdn.longdai.com/img/11aaad36a65045138fe25c65075fcfdc.png');
            
            $('.financial-share').on('click',function () {
                location.href = "longdai://share?url=" + url + "&title=" + title + "&image=" + image
            });
        },
        getUrlParameter: function (sParam) {

            var sPageURL = decodeURIComponent(window.location.search.substring(1)),
                sURLVariables = sPageURL.split('&'),
                sParameterName,
                i;

            for (i = 0; i < sURLVariables.length; i++) {
                sParameterName = sURLVariables[i].split('=');

                if (sParameterName[0] === sParam) {
                    return sParameterName[1] === undefined ? true : sParameterName[1];
                }
            }

        },
        onePageScroll: function () {
            var self = this;
            $(".financial").onepage_scroll({
                sectionContainer: "section",
                updateURL: false,
                pagination: false,
                animationTime: 600,
                beforeMove: function (index) {
                    self.clearImage();
                    if (self.lastIndex < index) {
                        $(".page" + index).show().addClass("animated fadeInUp");
                    } else {
                        $(".page" + index).show().addClass("animated fadeInDown");
                    }
                    self.lastIndex = index;
                }
            });
        },
        clearImage: function () {
            var self = this,
                $btn = $('.go-btn');
            $(".financial-page").hide().removeClass("animated fadeInUp fadeInDown");
            if (self.lastIndex == 1 && $('#active-number').html() == "") {
                self.countUpNum(self.userData.investCountSum, 0.5, 'active-number',0);
                self.countUpNum(self.userData.totalRebateSum, 1.5, 'rebate-number',2);
                self.countUpNum(self.userData.redRewardAmount, 1, 'getbao-number',2);
            }

            if (self.lastIndex == 2 && $("#income-number").html() == "") {
                    self.countUpNum(self.userData.totalInterest, 1.5, 'income-number',2);
                    self.countUpNum(self.userData.ratio, 1.5, 'win-number',0);
            }

        },
        countUpNum: function (endNum, times, targetElement,decimals) {
            var options = {
                useEasing: true,
                useGrouping: true,
                separator: ',',
                decimal: '.',
                prefix: '',
                suffix: ''
            };
            var countUp = new CountUp(targetElement, 0, endNum, decimals, times, options);
            countUp.start();
        },
        ajaxUserData: function (type) {
            var self = this,
                useType = null,
                $mast = $('.mast');
            if (type == 1) {
                useType = "token=" + self.token;
            } else if (type == 2) {
                useType = "billingKey=" + self.billingKey;
            }
            $.ajax({
                url: "/v2/myLongDaiBilling/detail",
                type: "GET",
                data: useType,
                success: function (res) {
                    if (res.code == 200) {
                        self.userData = res.data;
                        $('.progress-bar').width('100%');
                        $('.progress-value').html('100%');
                        self.bindEvent();
                        setTimeout(function () {
                            var clientWidth = document.body.clientWidth,
                                clientHeight = document.body.clientHeight,
                                pro = clientHeight / clientWidth;
                            if(pro < 1.5){
                                $('.financial-page').css({
                                    'width': '74%'
                                });
                                $('.financial-page-3').css({
                                    'width': '74%',
                                    'left' : '13%'
                                });
                            }
                            $('.financial,.financial-icon').show();
                            $('.landing').hide();
                            $(".page1").show().addClass("animated fadeInDown");
                            self.onePageScroll();
            
                            self.countUpNum(self.userData.diffDays, 2, 'join-number',0);
                        }, 500);
            
                    } else {
                        $mast.html(res.message);
                    }
            
                },
                error: function () {
                    $mast.html('服务器傲娇了');
                }
            });
            
        }
    });

    new Finanical();

});