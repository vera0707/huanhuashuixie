/*******************************************************************************
 * Copyright (c) 2005-2016 Gozap, Inc.
 * description:
 * Contributors:
 * sundongzhi  on 16/6/13
 *******************************************************************************/

    require("../../styles/activity/newer.css");

    var $ = require("jquery"),
        juicer = require('juicer'),
        L = require('../core/core.js'),
        wen = require("../../images/wen.png");
    var dialogTmpl = [
        '{@if opts.type == "success"}',
            '<div class="dialog-top">',
                // '<img class="gift-icon" src="' +  image + '"/>',
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

    var list2Tmpl = [
        '{@if status == 1}',
            '<a class="btn" href="longdai://regiser">注册账户</a>',
            '<span class="ml10">领取双份红包</span>',
        '{@else if status > 1}',
            '<span>已注册账户,红包已放入账户</span>',
        '{@else}',
            '<a class="btn" href="longdai://regiser">注册账户</a>',
            '<span class="ml10">领取双份红包</span>',
        '{@/if}'
    ].join('');


    var list3Tmpl = [
        '{@if status == 1 }',
            '<a class="btn btn-auth-un" href="javascript:;">实名认证</a>',
            '<span class="ml10">领取万元体验金</span>',
            '<a class="wen" href="/v2/testBorrows/describe"><img class="wen-icon" src="'+wen+'"/></a>',
        '{@else if status == 2}',
            '<a class="btn" href="longdai://authentication">实名认证</a>',
            '<span class="ml10">领取万元体验金</span>',
            '<a class="wen" href="/v2/testBorrows/describe?access_token=${access_token}"><img class="wen-icon" src="'+wen+'"/></a>',
        '{@else if status == 3}',
            '<div class="pdb10">',
                '<span>已实名认证，可使用1万元体验金</span>',
                '<a class="wen" href="/v2/testBorrows/describe?access_token=${access_token}"><img class="wen-icon" src="'+wen+'"/></a>',
            '</div>',
            '<div><a class="btn ml10" href="longdai://testBorrow?id=20000">立即使用</a></div>',
        '{@else if status == 4}',
            '<div class="pdb10">',
                '<span>已使用1万元体验金，请等待收到奖品</span>',
                '<a class="wen" href="/v2/testBorrows/describe?access_token=${access_token}"><img class="wen-icon" src="'+wen+'"/></a>',
            '</div>',
            '<div><a class="btn ml10" href="longdai://testBorrow?id=20000{@if investId}&investId=${investId}{@/if}">查看体验项目</a></div>',
        '{@else if status == 5}',
            '<div class="pdb10">',
                '<span>体验已完成，可到我的券包查看奖品</span>',
                '<a class="wen" href="/v2/testBorrows/describe?access_token=${access_token}"><img class="wen-icon" src="'+wen+'"/></a>',
            '</div>',
            '<div><a class="btn" href="longdai://testBorrow?id=20000{@if investId}&investId=${investId}{@/if}">查看体验项目</a></div>',
        '{@else if status == 6}',
            '<span>体验金已过期</span>',
            '<a class="btn bg-999 ml10" href="javascript:;">体验金已过期</a>',
        '{@else}',
            '<a class="btn" href="longdai://authentication">实名认证</a>',
            '<span class="ml10">领取万元体验金</span>',
            '<a class="wen" href="/v2/testBorrows/describe"><img class="wen-icon" src="'+wen+'"/></a>',
        '{@/if}'
    ].join("");


    $(function() {        

        function Newer() {
            this.status = 1;
            this.testBorrowId = false;
            this.investId = false;
            this.access_token = false;
            this.init();
        }

        $.extend(Newer.prototype, {
            init: function () {
                var self = this;

                if (self.getUrlParameter("access_token") && self.getUrlParameter("access_token") != "null") {
                    self.access_token = self.getUrlParameter("access_token");
                    self.getStatus();
                }else{
                    self.render();
                }
            },
            bindEvent: function () {
                var self = this, $listMore2 = $(".newer-list.list2").find(".newer-more"),$listMore3 = $(".newer-list.list3").find(".newer-more");
                if(self.status == 1){
                    $listMore2.removeClass("hide").show();
                    $listMore2.on("click",function () {
                        location.href = "longdai://regiser";
                    });
                    $listMore3.removeClass("hide").show();
                    $listMore3.on("click",function () {
                        self.dialog({
                            type: "error",
                            message: "请先注册并登录"
                        });
                    });
                }else if(self.status == 2){
                    $listMore3.removeClass("hide").show();
                    $listMore3.on("click",function () {
                        location.href = "longdai://authentication";
                    });
                }


                $(".btn-auth-un").on("click",function () {
                    self.dialog({
                        type: "error",
                        message: "请先注册并登录"
                    });
                });
                $("#about_more").on("click",function () {
                    location.href = "https://m.longdai.com/v2/about/guide";
                });


                
            },
            render : function () {
                var self = this,
                    rendData = {
                        status: self.status
                    };
                // if(!!self.testBorrowId){
                //     rendData.testBorrowId = self.testBorrowId;
                // }
                if(!!self.investId){
                    rendData.investId = self.investId;
                }

                if(!!self.access_token){
                    rendData.access_token = self.access_token;
                }
                $(".newer-list-con2").html(juicer(list2Tmpl,rendData));
                $(".newer-list-con3").html(juicer(list3Tmpl,rendData));

                if( self.status > 1 ){
                    $('body,html').animate({scrollTop:364},500);
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
            getStatus : function () {
                var self = this;
                $.ajax({
                    url:'/v2/user/newerTask/status?access_token='+self.access_token,
                    type:'GET',
                    data:{},
                    success:function (res) {
                        if(res.code == 200 && res.data && res.data.status){
                            self.status = res.data.status;
                            if( ( self.status == 4 || self.status == 5 ) && res.data.invests && res.data.invests.length > 0 ){
                                self.investId = res.data.invests[0].id;
                            }
                        }


                        self.render();


                    },
                    error:function(){
                        self.render();

                    }
                })
            },
            getTestBorrows : function () {
                var self = this;
                if(self.status < 3){
                    self.render();
                    return false;
                }
                $.ajax({
                    url: "/v2/testBorrows",
                    type: "POST",
                    data: {
                        access_token : self.access_token,
                        type : 2,
                        testType : 2,
                        page : 1,
                        pages : 10
                    },
                    success: function (res) {

                        if(res.code == 200 && res.data && res.data.length > 0){
                            self.testBorrowId = res.data[0].id;
                        }
                        self.render();


                    },
                    error: function (res) {
                        self.render();


                    }
                })
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

        new Newer();
    });