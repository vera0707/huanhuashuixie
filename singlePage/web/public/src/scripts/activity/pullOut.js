/*******************************************************************************
 * Copyright (c) 2005-2016 Gozap, Inc.
 * description:
 * Contributors:
 * sundongzhi  on 16/6/13
 *******************************************************************************/

 require("../../styles/activity/pullOut.css");

    var $ = require("jquery");
    var juicer = require('juicer');

    var L = require('../core/core.js');

    L.dialog = require('../core/dialog.js')


    var image = require('../../images/activity/haolonglin/gift_pack.png');

    $(function() {
        var dialogTmpl = [
            '{@if opts.type == "success"}',
                '<div class="dialog-top">',
                    '<img class="gift-icon" src="' +  image + '"/>',
                    '<div class="dialog-top-txt">恭喜您!</div>',
                '</div>',
                '<div class="dialog-con">获得$${opts.message}</div>',
            '{@else}',
                '<div class="dialog-con2">$${opts.message}</div>',
            '{@/if}',
            '<div class="dialog-bottom">',
                '{@if opts.showCancelBtn == true}',
                    '<span class="dialog-btn2 dialog-btn-cancel">取&nbsp;&nbsp;消</span>',
                '{@/if}',
                '{@if opts.sureBtnName && opts.sureBtnName != ""}',
                    '<a class="dialog-btn {@if opts.showCancelBtn == true} ml20{@/if} dialog-btn-sure" href="${opts.btnUrl}">$${opts.sureBtnName}</a>',
                '{@else}',
                    '{@if opts.btnUrl && opts.btnUrl != ""}',
                        '<a class="dialog-btn {@if opts.showCancelBtn == true} ml20{@/if} dialog-btn-sure" href="${opts.btnUrl}">确&nbsp;&nbsp;定</a>',
                    '{@else}',
                        '<span class="dialog-btn {@if opts.showCancelBtn == true} ml20{@/if} dialog-btn-sure">确&nbsp;&nbsp;定</span>',
                    '{@/if}',
                '{@/if}',
            '</div>'
        ].join("");

        function HaoLongLin() {
            this.canHao = true;
            this.flag = false;
            this.init();
        }

        $.extend(HaoLongLin.prototype, {
            init: function () {
                var self = this;
                if (self.getUrlParameter("oldVersion") && self.getUrlParameter("oldVersion") == 1) {
                    self.dialog({
                        type: "error",
                        message: "请升级到最新版APP来薅"
                    });
                    self.bindEvent();
                    return false;
                }

                if (self.getUrlParameter("access_token") && self.getUrlParameter("access_token") != "null") {

                    self.access_token = self.getUrlParameter("access_token");

                }else{
                    self.dialog({
                        type: "error",
                        message: "请先登录"
                    });
                }
                self.bindEvent();




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
            bindEvent: function () {
                var self = this;
                $(".hao-btn-icon").on("touchstart",function(e){
                    e.preventDefault();
                    $(".hao-btn-normal").hide();
                    $(".hao-btn-catch").show();

                    if (self.getUrlParameter("oldVersion") && self.getUrlParameter("oldVersion") == 1) {
                        self.dialog({
                            type: "error",
                            message: "请升级到最新版APP来薅"
                        });
                        return false;
                    }
                    if (!self.getUrlParameter("access_token") || self.getUrlParameter("access_token") == "null") {

                        self.dialog({
                            type: "error",
                            message: "请先登录"
                        });

                        return false;
                    }
                    if (self.flag || self.canHao == false) {
                        return false;
                    }

                    self.canHao = false;

                    if (self.access_token && self.access_token != "") {

                        self.flag = true;
                        self.dialogHasShow = false;

                        self.uncatchAnimation();

                        var timeId = setInterval(function () {

                            if (self.dialogHasShow == false) {

                                if (!self.flag) {

                                    clearInterval(timeId);
                                    self.showAwardDialog();

                                } else {
                                    self.uncatchAnimation();
                                }

                            } else {
                                clearInterval(timeId);

                            }


                        }, 1500);

                        self.getAward();

                    } else {

                        self.dialog({
                            type: "error",
                            message: "请先登录",
                            btnUrl: "longdai://login"
                        });
                    }


                });

                $(".hao-btn-icon").on("touchend",function(e) {
                    e.preventDefault();
                    $(".hao-btn-catch").hide();
                    $(".hao-btn-normal").show();
                });
            },
            getAward: function () {
                var self = this;

                $.ajax({
                    url: "/v2/activity/pullOut?access_token=" + self.access_token,
                    type: "POST",
                    data: {},
                    success: function (res) {

                        self.flag = false;

                        self.getAwardData = res;


                    },
                    error: function (res) {
                        self.flag = false;
                        self.getAwardData = res;

                    }
                })
            },
            showAwardDialog: function () {
                var self = this;

                self.dialogHasShow = true;

                if (self.getAwardData.code == 200) {

                    self.catchAnimation(self.getAwardData.message,self.getAwardData.data.prizeType);

                } else if (self.getAwardData.code == 403) {
                    self.dialog({
                        type: "error",
                        message: self.getAwardData.message,
                        btnUrl: "longdai://login"
                    });
                } else {

                    if (self.getAwardData.message) {
                        self.dialog({
                            type: "error",
                            message: self.getAwardData.message
                        });
                    } else {
                        self.dialog({
                            type: "error",
                            message: "服务器傲娇了!"
                        });
                    }
                }


            },
            initAnimation: function () {
                var self = this;

                $(".hao-long-eye-catch").hide();//哭泣表情隐藏
                $(".hao-person-catch").hide();//人手抓住动作隐藏

                $(".hao-long-hand").addClass("hao-long-hand-animate");//龙手恢复动作
                $(".hao-long-eye").show();//龙眼显示


                $(".hao-person-normal-cathch").hide().removeClass("hao-person-normal-cathch-animate");//人手抓住之前动作隐藏
                $(".hao-person-normal").show();// 上下移动手臂显示

            },
            catchAnimation: function (prizeName,prizeType) {
                var self = this;


                $(".hao-person-normal-cathch").hide();
                $(".hao-long-hand").removeClass("hao-long-hand-animate");

                $(".hao-long-eye").hide();
                $(".hao-long-eye-catch").show();
                $(".hao-person-catch").show();


                if( prizeType == 7 ) {
                    var timeOut = setTimeout(function () {

                        var shareUrl = encodeURIComponent(self.getAwardData.data.shareUrl || "");
                        var title = encodeURIComponent("分享红包");
                        var imageUrl = encodeURIComponent(self.getAwardData.data.shareIconUrl || "");
                        self.dialog({
                            type: "success",
                            message: prizeName,
                            btnUrl: "longdai://share?url=" + shareUrl +"&title="+ title +"&image=" + imageUrl +"&content=%20",
                            sureBtnName: "去&nbsp;&nbsp;分&nbsp;&nbsp;享",
                            showCancelBtn: true
                        });
                        clearTimeout(timeOut);
                    }, 500);

                } else {
                    var timeOut = setTimeout(function () {
                        self.dialog({
                            type: "success",
                            message: prizeName,
                            btnUrl: "/v2/user/couponPackage?access_token=" + self.access_token,
                            sureBtnName: "去&nbsp;&nbsp;查&nbsp;&nbsp;看",
                            showCancelBtn: true
                        });
                        clearTimeout(timeOut);
                    }, 500);
                }




            },
            uncatchAnimation: function () {
                var self = this;
                $(".hao-person-normal").hide();
                $(".hao-person-catch").hide();
                $(".hao-person-normal-cathch").addClass("hao-person-normal-cathch-animate").show();

                var timeOver = setTimeout(function () {
                    $(".hao-person-normal-cathch").removeClass("hao-person-normal-cathch-animate").hide();
                    $(".hao-person-catch").show();
                    clearTimeout(timeOver);

                    if (self.flag == false) {
                        self.showAwardDialog();
                    }
                }, 750);

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
                    self.initAnimation();
                    self.canHao = true;

                });


            },
            dialogClose: function () {
                $(".mask").hide();
                $(".dialog").html("");
            }
        });

        new HaoLongLin();
    });