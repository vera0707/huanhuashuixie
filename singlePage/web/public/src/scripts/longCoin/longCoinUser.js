/**
 * Created by lishuxia on 16/11/3.
 */
require("../../styles/longCoin/longCoinUser.css");
var $ = require("jquery"),
    juicer = require('juicer');

var earnWayTmpl = [
    '{@each data as item}',
        '<div class="longcoin-user-list clearfloat">',
            '<div class="f-l">',
                '<div class="longcoin-user-list-name">${item.earnWay.name}<span class="longcoin-list-red">{@if item.earnWay.coinsType == 1}+${item.earnWay.coins}{@else if item.earnWay.coinsType == 2}+${item.earnWay.coinsTitle}{@/if}</span></div>',
                '<div class="longcoin-text-grey">{@if item.earnWay.startTime == 0 && item.earnWay.endTime == 0}长期有效',
                '{@else if item.earnWay.startTime == 0 && item.earnWay.endTime != 0}${item.earnWay.endTime | timeTrans}前有效',
                '{@else if item.earnWay.startTime != 0 && item.earnWay.endTime != 0}${item.earnWay.startTime | timeTrans}-${item.earnWay.endTime | timeTrans}有效',
                '{@else if item.earnWay.startTime != 0 && item.earnWay.endTime == 0}${item.earnWay.startTime | timeTrans}起有效',
                '{@/if}</div>',
            '</div>',
            '{@if item.earnWayStatus == 0}',
                '<div class="f-r longcoin-list-grey">已下线</div>',
            '{@else}',
                '{@if item.userEarnStatus}<div class="f-r longcoin-list-grey">已赚取</div>',
                '{@else}<a  {@if !!item.earnWay.actionUrl} href="${item.earnWay.actionUrl}"{@/if} class="f-r longcoin-list-blue">${item.earnWay.action}</a>{@/if}',
            '{@/if}',
        '</div>',
    '{@/each}'
].join("");

var logCoinTmpl = [
    '{@each data as item}',
    '<div class="longcoin-user-list clearfloat">',
        '<div class="f-l">',
            '<div class="longcoin-user-list-name">${item.description}</div>',
            '<div class="longcoin-text-grey">${item.createTime | timeTransDetail}</div>',
        '</div>',
        '<div class="f-r">',
            '{@if !!item.earnId}<div class="longcoin-user-detail-total c-f75619">+ ${item.coins}.00</div>',
            '{@else}<div class="longcoin-user-detail-total c-00a753">- ${item.coins}.00</div>{@/if}',
        '</div>',
    '</div>',
    '{@/each}'
].join("");

window.add0 = function (m) {
    return m<10?'0'+m:m
};
juicer.register("timeTrans", function(time) {
    time = new Date(time);
    var year = time.getFullYear(),
        months = time.getMonth() + 1,
        days = time.getDate();
    return year + '.' + add0(months) + '.' + add0(days);
});
juicer.register("timeTransDetail", function(time) {
    time = new Date(time);
    var year = time.getFullYear(),
        months = time.getMonth() + 1,
        days = time.getDate(),
        h = time.getHours(),
        mm = time.getMinutes(),
        s = time.getSeconds();
    return year + '.' + add0(months) + '.' + add0(days) + " " + add0(h) + ":" + add0(mm) + ":" + add0(s);
});
$(function () {
    function CoinUser() {
        this.access_token = null;
        this.isLogin = false;
        this.init();
    }

    $.extend(CoinUser.prototype, {
        init: function () {
            var self = this;
            if (self.getUrlParameter("access_token") && self.getUrlParameter("access_token") != "null") {
                self.access_token = self.getUrlParameter("access_token");
                self.ajaxUserCoin();
            }else if(self.getUrlParameter("token") && self.getUrlParameter("token") != "null"){
                self.access_token = self.getUrlParameter("token");
                self.ajaxUserCoin();
            }else{
                $('.user-nologin').show();
            }
            self.bindEvent();
        },
        bindEvent: function () {
            var self = this;
            $('.longcoin-nav-head').on('click',function(){
                if($(this).hasClass('checked')){
                    return false;
                }else{
                    $('.longcoin-nav-head').removeClass('checked');
                    $(this).addClass('checked');
                    if(self.isLogin){
                        var $makeCoin = $('.makeCoin'),
                            $coinDetail = $('.coinDetail');
                        if ($(this).html() == '赚龙币') {
                            $makeCoin.show();
                            $coinDetail.hide();
                        } else {
                            $makeCoin.hide();
                            $coinDetail.show();
                        }
                    }
                }     
            
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
        ajaxUserCoin: function () {
            var self = this,
                $noLogin = $('.user-nologin'),
                $isLogin = $('.user-islogin');
            $.ajax({
                url: '/v2/dragonCoins/coins', 
                type: 'GET',
                data: 'access_token=' + self.access_token,
                success: function (res) {
                    if(res.code == 200){
                        var userCoin = res.data;
                        self.ajaxLogCoin();
                        self.ajaxEarnCoin();
                        self.isLogin = true;
                        $isLogin.show();
                        $('.longcoin-user-amount').html(userCoin.userCoinsCount);
                        if(userCoin.willExpireCount > 0){
                            $('.longcoin-text-grey').html(userCoin.expireNotify);
                        }
                    }else{
                        $noLogin.show();
                    }
                },
                error: function (res) {
                    $noLogin.show();
                }
            })
        },
        ajaxEarnCoin: function () {
            var self = this;
            $.ajax({
                url: '/v2/dragonCoins/earnWay',
                type: 'GET',
                data: 'access_token=' + self.access_token,
                success: function (res) {
                    if(res.code == 200){
                        if(!!res.data && res.data.length > 0){

                            var earnWayHtml = juicer(earnWayTmpl, {data: res.data});
                            $('.makeCoin').html(earnWayHtml);
                            
                        }else{
                            $('.make-coin-warn').show();
                        }
                    }
                },
                error: function () {}
            })
        },
        ajaxLogCoin: function () {
            var self = this;
            $.ajax({
                url: '/v2/dragonCoins/exchange/log',
                type: 'GET',
                data: 'access_token=' + self.access_token,
                success: function (res) {
                    if(res.code == 200){
                        var $conDetail = $('.coinDetail');
                        if(!!res.data && res.data.length > 0){
                            var logCoinHtml = juicer(logCoinTmpl, {data: res.data});
                            $conDetail.html(logCoinHtml).hide();
                        }else{
                            $('.coin-detail-warn').show();
                            $conDetail.hide();
                        }
                    }
                },
                error:function (res) {}
            })
        }

    });

    new CoinUser();

});