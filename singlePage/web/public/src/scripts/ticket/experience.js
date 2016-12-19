/**
 * Created by lishuxia on 16/7/5.
 */
/*******************************************************************************
 * Copyright (c) 2005-2016 Gozap, Inc.
 * description:
 * Contributors:
 * sundongzhi  on 16/6/13
 *******************************************************************************/
require("../../styles/ticket/experience.css");

var iconTime = require("../../images/ticket/experience/icon_time.png");
var iconAmount = require("../../images/ticket/experience/icon_amount.png");
var $ = require("jquery");
var juicer = require('juicer');

var L = require('../core/core.js');

L.dialog = require('../core/dialog.js');

    $(function () {
        var  testBorrowsTmpl = [
            '{@each lists as list,index}',
                '<div class="experience-join clearfloat" data-id="${list.id}">',
                    '<div class="w70 f-l">',
                        '<div class="experience-j-i c-8e6776 clearfloat">',
                            '<div class="f-l experience-j-li1 clearfloat">$${list.annualRate|getAnnualRate}</div>',
                            '<div class="clearfloat f-l experience-j-li2">',
                                '<img src="'+ iconTime +'" alt="" class="experience-icon f-l" />',
                                '<div class="color-brown pl3 f-l">${list.dayDeadline}天</div>',
                            '</div>',
                            '<div class="clearfloat f-l experience-j-li3">',
                                '<img src="'+ iconAmount +'" alt="" class="experience-icon f-l" />',
                                '<div class="color-brown pl3 f-l">${list.borrowAmount|getBorrowAmountWan}万</div>',
                            '</div>',
                        '</div>',
                        '<div class="ex-ll _pl5">${list.borrowTitle}</div>',
                    '</div>',
                    '{@if list.borrowStatus == 1}',
                        '<div class="f-r w30 clearfloat">',
                            '<div class="f-r ex-status clearfloat">',
                                '<span class="f-l ex-status-line"></span>',
                                '<span class="f-l ex-status-text">审核中</span>',
                                '<span class="f-l ex-status-line"></span>',    
                            '</div>',
                        '</div>',
                    '{@else if list.borrowStatus == 2}',
                        '<div class="f-r clearfloat w30" data-amountscale="${list.amountScale}">',
                            '<div class="f-r circle">',
                                '<div class="circle-bg"></div>',
                                '<div class="left-and-right"></div>',
                                '<div class="circle-text">立即体验</div>',
                            '</div>',
                        '</div>',
                    '{@else if list.borrowStatus == 3}',
                        '<div class="f-r w30 clearfloat">',
                            '<div class="f-r ex-status clearfloat">',
                                '<span class="f-l ex-status-line"></span>',
                                '<span class="f-l ex-status-text">已满标</span>',
                                '<span class="f-l ex-status-line"></span>',
                            '</div>',
                        '</div>',
                    '{@else if list.borrowStatus == 4}',
                        '<div class="f-r w30 clearfloat">',
                            '<div class="f-r ex-status clearfloat">',
                                '<span class="f-l ex-status-line"></span>',
                                '<span class="f-l ex-status-text">还款中</span>',
                                '<span class="f-l ex-status-line"></span>',
                            '</div>',
                        '</div>',
                    '{@else if list.borrowStatus == 5}',
                        '<div class="f-r w30 clearfloat">',
                            '<div class="f-r ex-status clearfloat">',
                                '<span class="f-l ex-status-line"></span>',
                                '<span class="f-l ex-status-text">已还完</span>',
                                '<span class="f-l ex-status-line"></span>',
                            '</div>',
                        '</div>',
                    '{@/if}',
                '</div>',
            '{@/each}'
        ].join("");
        juicer.register("getAnnualRate",function (rate) {
           var rateN = (Number(rate)*100).toFixed(2),rateStr = rateN + "",rateNArr = rateStr.split(".");
            return '<span class="font-18">'+rateNArr[0] +'</span><span class="">.'+ rateNArr[1] +'%</span>';

        });
        juicer.register("getBorrowAmountWan",function (borrowAmount) {
            return Number(borrowAmount)/10000;
        });

        function Experience() {
            this.init();
        }

        $.extend(Experience.prototype, {
            init: function () {
                var self = this;
                
                self.getBeginTime();

                if (self.getUrlParameter("access_token") && self.getUrlParameter("access_token") != "null") {
                    self.access_token = self.getUrlParameter("access_token");
                    $('.experience-button').removeClass("hide").show();

                    self.getTestBorrows();
                }

                // self.bindEvent();


            },
            // bindEvent: function () {
            //     var self = this;
            //
            //     $('.experience-button').on('click',function(){
            //         if(self.access_token){
            //             location.href = "/v2/user/couponPackage?access_token=" + self.access_token;
            //         }
            //     });
            // },
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
            getTestBorrows : function () {
                var self = this;
                $.ajax({
                    url: "/v2/testBorrows",
                    type: "POST",
                    data: {
                        access_token : self.access_token,
                        type : 2,
                        page : 1,
                        pages : 10
                    },
                    success: function (res) {

                        if(res.code == 200 && res.data.length > 0){
                            $(".testBorrows-con").html(juicer(testBorrowsTmpl,{lists : res.data}));
                            $(".experience-join").on("click",function () {
                                var $this = $(this),id = $this.data("id");
                                location.href = "longdai://testBorrow?id="+id;
                            });
                        }

                    },
                    error: function (res) {


                    }
                })
            },
            getBeginTime : function () {
                var self = this;
                $.ajax({
                    url: "/v2/testBorrows/beginTime",
                    type: "GET",
                    data: {},
                    success: function (res) {

                        if(res.code == 200 && res.data){
                            $(".experience-begin-time").html(res.data);
                        }

                    },
                    error: function (res) {


                    }
                });
                
            },
            circle : function () {
                // $(".circle").each(function (k,v) {
                //     var $this = $(this),rate = Number($this.data("amountscale")).toFixed(2),$left=$this.find(".left"),$right=$this.find(".right");
                //     if(rate > 50){
                //         $left.css({
                //             "webkitTransform":"rotate(-180deg)",
                //             "MozTransform":"rotate(-180deg)",
                //             "msTransform":"rotate(-180deg)",
                //             "OTransform":"rotate(-180deg)",
                //             "transform":"rotate(-180deg)"
                //         });
                //         $right.css({
                //             "webkitTransform":"rotate(-180deg)",
                //             "MozTransform":"rotate(-180deg)",
                //             "msTransform":"rotate(-180deg)",
                //             "OTransform":"rotate(-180deg)",
                //             "transform":"rotate(-180deg)"
                //         });
                //     }else{
                //         $left.css({
                //             "webkitTransform":"rotate(-180deg)",
                //             "MozTransform":"rotate(-180deg)",
                //             "msTransform":"rotate(-180deg)",
                //             "OTransform":"rotate(-180deg)",
                //             "transform":"rotate(-180deg)"
                //         });
                //     }
                // });

            }

        });

         new Experience();


    });
