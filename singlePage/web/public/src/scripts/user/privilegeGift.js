/**
 * Created by lishuxia on 16/8/26.
 */
require("../../styles/user/privilege.css");
var $ = require("jquery"),
    juicer = require('juicer'),
    L = require('../core/core.js');

var getButtonImage = require('../../images/user/privilege/privilege_button.png'),
    noGetImage = require('../../images/user/privilege/privilege_receive.png'),
    hasGetImage = require('../../images/user/privilege/privilege_defult.png');

var drawalsTmp = [
    '{@if data == 1}',
        '<div class="privilege-title color-white">升级礼物</div>',
        '<img src="'+ getButtonImage +'" alt="" class="mt5 w80p getDrawals"/>',
        '<div class="privilege-rule mt50">',
    '{@else if data == 0}',
        '<div class="privilege-title color-black">升级礼物</div>',
        '<div class="mt10 color-red font18">已领取</div>',
        '<div class="privilege-rule mt70">',
    '{@else if data == -1}',
        '<div class="privilege-title1 color-white">升级礼物</div>',
        '<div class="privilege-rule mt80">',
    '{@/if}',
            '<div class="privilege-rule-title">特权内容</div>',
            '<div>V2：一张0.1%加息券</div>',
            '<div>V3：一张0.2%加息券</div>',
            '<div>V4：一张0.3%加息券</div>',
            '<div>V5：一张0.5%加息券</div>',
        '</div>',
    '{@if data == 1 || data == -1}',
    '<img src="'+ noGetImage +'" alt="" class="privilege-bg"/>',
    '{@else if data == 0}',
    '<img src="'+ hasGetImage +'" alt="" class="privilege-bg"/>',
    '{@/if}'
].join("");

var dialogTmpl = [
    '<div class="dialog-header">${data}</div>',
    '<div class="dialog-button">确定</div>'
].join("");

$(function () {
    function Gifts() {
        this.access_token = null;
        this.init();
    }

    $.extend(Gifts.prototype, {
        init: function () {
            var self = this;

            if (self.getUrlParameter("access_token") && self.getUrlParameter("access_token") != "null") {
                self.access_token = self.getUrlParameter("access_token");
            }else if(self.getUrlParameter("token") && self.getUrlParameter("token") != "null"){
                self.access_token = self.getUrlParameter("token");
            }
            
            if(self.access_token){
                self.PageInit();    
            }
            
        },
        bindEvent:function () {
            var self = this;
            $('.getDrawals').on('click',function () {
                self.getDrawalsAjax();
            });
            $('.dialog').on('click','.dialog-button',function () {
                $('.mask').hide();
                $('.dialog').hide().html('');
                self.PageInit();
            })
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
        PageInit:function () {
            var self = this;
            $.ajax({
                url:'/v2/user/vip/privilege/3/status',
                type:'GET',
                data:'access_token='+self.access_token,
                success:function (res) {
                    if(res.code == 200){
                        var drawalsHtml = juicer(drawalsTmp,{data: res.data});
                        $('.giftsPage').html(drawalsHtml);
            
                        self.bindEvent();
                    }
                },
                error:function () {}
            });
        },
        showDialog: function (data) {
            var dialogHtml = juicer(dialogTmpl,{data: data});
            $('.mask').show();
            $('.dialog').show().html(dialogHtml);
        },
        getDrawalsAjax:function () {
            var self = this;
            $.ajax({
                url:'/v2/user/vip/privilege/draw',
                type:'POST',
                data:'prizeType=3&access_token='+self.access_token,
                success:function (res) {
                    self.showDialog(res.message);
                },
                error:function (res) {
                    self.showDialog('服务器傲娇了');
                }
            });
        }
    });

    new Gifts();

});