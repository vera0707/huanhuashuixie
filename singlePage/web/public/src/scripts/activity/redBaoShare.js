/**
 * Created by lishuxia on 16/7/7.
 */


require("../../styles/activity/redBaoShare.css");

require('sweetJs');
require('sweetCss');

var $ = require("jquery");

var _ = require("underscore");

var juicer = require('juicer');

var L = require('../core/core.js');

require('../core/regex.js');


var coupon1 = require('../../images/activity/redBaoShare/share_redBao_coupon1.png');
var coupon2 = require('../../images/activity/redBaoShare/share_redBao_coupon2.png');

var hash =  "Fb6rI3";

    $(function () {

        // 获取红包
        var getRedBaoTmpl = [
            '<div class="w90 center">',
                '<div class="shareBao-block2 clearfloat">',
                    '<img src="'+ coupon1 +'" alt="" class="shareBao-phone2 f-l">',
                    '<div class="shareBao-note1 mt34 f-l">理财红包</div>',
                    '<div class="color-red f-l mt34">&yen;</div>',
                    '<div class="shareBao-money f-l">${data.rewardAmount | numberFormat}</div>',
                '</div>',
            '</div>',
            '<div class="text-center center pdt15 w90">',
                '<div class="fz12">${phone} <span class="pl5">√ ${message}</span></div>',
                '<a href="/download" class="shareBao-download">下载龙贷客户端</a>',
            '</div>'
        ].join("");

        juicer.register("numberFormat", function(number) {
            return parseInt(number);
        })

        // 红包已抢光
        var redBaoEmpytTmpl = [
            '<div class="clearfloat shareBao-finished">',
                '<img src="'+ coupon2 +'" alt="" class="w13 f-l ml5w">',
                '<div class="">红包已经被抢光,下次早点来哦~</div>',
            '</div>'
        ].join("");

        function redBaoShare() {
            this.init();
        };

        $.extend(redBaoShare.prototype, {
            init: function () {
                var self = this;
                self.events();
            },
            events: function () {
                var phoneNumer = $('input[name="shareBao_phone"]'),
                    $button = $('.shareBao-button'),
                    $step = $('.redBaoStep');

                phoneNumer.on('focus', function () {
                    if ($button.hasClass('unchecked')) {
                        $button.removeClass('unchecked').addClass('checked');
                    }
                }).on('blur', function () {
                    if ($(this).val() == '') {
                        if ($button.hasClass('checked')) {
                            $button.removeClass('checked').addClass('unchecked');
                        }
                    }
                });

                $button.on('click',function(){
                    // var getRedBaoHtml = juicer(getRedBaoTmpl,{});
                    // $step.html(getRedBaoHtml);

                    var originUrl = location.href.split('/d/')[1];


                    var shortUrl = originUrl.indexOf('?') > 0? originUrl.split('?')[0] : originUrl  || hash;


                    var phone = $(".shareBao-input").val();

                    if( phone == "" || !window.isMobile(phone)) {
                        swal({title:"",text: "手机号码无效"});
                        return false;
                    }
                    $.ajax({
                        url:"/v2/d/shareRedReward",
                        type:"POST",
                        data: "shortUrl=" + shortUrl + "&phone=" + phone + "&type=2",
                        success: function(res) {
                            if( res.code == 200 ) {
                                if( res.data && !_.isEmpty(res.data) ) {
                                    var getRedBaoHtml = juicer(getRedBaoTmpl,{data : res.data, phone: phone,message:res.message});
                                    $step.html(getRedBaoHtml);
                                }
                            } else {

                                swal({title:"",text: res.message});


                            }
                        },
                        error: function() {
                            
                        }
                    })
                    

                    // var redBaoEmpytHtml = juicer(redBaoEmpytTmpl,{});
                    // $step.html(redBaoEmpytHtml);
                })
            }
        });

        new redBaoShare();


    });
