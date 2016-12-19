/**
 * Created by lishuxia on 16/9/7.
 */
require("../../styles/about/userGuide.css");

var $ = require("jquery"),
    juicer = require('juicer'),
    L = require('../core/core.js');

$(function () {
    function UserGuide() {
        this.access_token = null;
        this.init();
    }

    $.extend(UserGuide.prototype, {
        init: function () {
            var self = this;
            if (self.getUrlParameter("access_token") && self.getUrlParameter("access_token") != "null") {
                self.access_token = self.getUrlParameter("access_token");
                $('.userGuideButton').hide();
                
            }
            self.bindEvent();
        },
        bindEvent:function () {
            $('.product-header').on('click',function(){
                var productCode = $(this).parent().find('.product-content'),
                    productCon = $(this).find('.product-list-btn');

                if(productCon.hasClass('triangle-b')){
                    productCon.removeClass('triangle-b').addClass('triangle-t');
                    productCode.addClass('hide');
                }else{
                    productCon.removeClass('triangle-t').addClass('triangle-b');
                    productCode.removeClass('hide');
                }

            });
            $(".userGuideButton").on('click',function(){
                L.testApp('longdai://regiser','https://m.longdai.com/landing');
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
    });

    new UserGuide();

});