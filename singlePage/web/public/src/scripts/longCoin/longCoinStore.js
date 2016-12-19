require("../../styles/longCoin/longCoinStore.css");
var $ = require("jquery"),
    juicer = require('juicer'),
    tixian = require('../../images/longCoin/quan@3x.png'),
    jiaxi = require('../../images/longCoin/quan2@3x.png'),
    hongbao = require('../../images/longCoin/hongbao@3x.png');

var productsTmpl = [
    '{@each data as item}',
        '<div  class="f-l longcoin-store-products-li" data-goods="${item.id}">',
            '<div class="longcoin-store-products-con">',
                '{@if item.productType == 1}',
                    '<div class="longcoin-store-products-icon icon-redbag">',
                    '<img class="longcoin-store-products-image" src="' + hongbao + '"/>',
                '{@/if}',
                '{@if item.productType == 2}',
                    '<div class="longcoin-store-products-icon icon-tixian">',
                    '<img class="longcoin-store-products-image" src="' + tixian + '"/>',
                '{@/if}',
                '{@if item.productType == 3}',
                    '<div class="longcoin-store-products-icon icon-jiaxi">',
                    '<img class="longcoin-store-products-image" src="' + jiaxi + '"/>',
                '{@/if}',
                    '<div class="longcoin-store-products-amount">${item.productType,item.productName | mainTitle}</div>',
                    '<div class="longcoin-store-products-name">${item.productName}</div>',
                '</div>',
                '<div class="longcoin-store-products-info clearfloat">',
                    '{@if item.status != 1 || item.count <= 0 }',
                        '<span class="f-l helvetica fz16">${item.coins}</span>',
                        '<span class="f-l pdl5 fz12">龙币</span>',
                        '<span class="f-r">已下架</span>',
                    '{@else}',
                        '<span class="f-l price-red helvetica fz16">${item.coins}</span>',
                        '<span class="f-l pdl5 fz12">龙币</span>',
                    '{@/if}',
                '</div>',
            '</div>',
        '</div>',
    '{@/each}'
].join('');

juicer.register("mainTitle", function(type,title) {
    var str = '';
    if(type == 1){
        str = parseInt(title) + '元';
    }else if(type == 2){
        str = "3元"
    }else if(type == 3){
        str = "+" + parseFloat(title) + '%';
    }
    return str;
});

$(function () {
    function CoinStore() {
        this.access_token = null;
        this.init();
    }

    $.extend(CoinStore.prototype, {
        init: function () {
            var self = this;
            if (self.getUrlParameter("access_token") && self.getUrlParameter("access_token") != "null") {
                self.access_token = self.getUrlParameter("access_token");
            }else if(self.getUrlParameter("token") && self.getUrlParameter("token") != "null"){
                self.access_token = self.getUrlParameter("token");
            }

            if(!!self.access_token){
                self.ajaxUserCoin();
                self.ajaxStatus();
            }

            self.ajaxProducts();
            self.bindEvent();
        },
        bindEvent:function () {
            var self = this;
            $('.page-to-user').on('click',function () {
                if(self.access_token){
                    location.href = '/v2/dragonCoins/user?access_token=' + self.access_token;
                }else{
                    location.href = '/v2/dragonCoins/user';
                }
            });
        },
        productEvent:function () {
            var self = this;
            $('.longcoin-store-products-li').on('click',function () {
                var goodsId = $(this).data('goods');
                if(self.access_token){
                    location.href = "/v2/dragonCoins/product/" + goodsId + '?access_token=' + self.access_token;
                }else{
                    location.href = "/v2/dragonCoins/product/" + goodsId;
                }
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
        ajaxUserCoin: function () {
            var self = this;
            $.ajax({
                url: '/v2/dragonCoins/coins',
                type: 'GET',
                data: 'access_token=' + self.access_token,
                success: function (res) {
                    if(res.code == 200){
                        var userCoin = res.data.userCoinsCount;
                        if(userCoin >= 0){
                            $('.longcoin-store-login').show();
                            $('.longcoin-store-unlogin').hide();
                            $('.longcoin-store-amount').html(userCoin);   
                        }
                    }
                },
                error: function (res) {}
            })
        },
        ajaxStatus:function () {
            var self = this;
            $.ajax({
                url: '/v2/dragonCoins/earn/guide/status',
                type: 'GET',
                data: 'access_token=' + self.access_token,
                cache: false,
                success: function (res) {
                    if(res.code == 200){
                        if(!!res.data){
                            $('.longcoin-store-status').addClass('longcoin-status-poniter');
                        }
                    }
                },
                error: function (res) {

                }
            })
        },
        ajaxProducts:function () {
            var self = this;
            $.ajax({
                url: '/v2/dragonCoins/goods/list',
                type: 'GET',
                data: {},
                success: function (res) {
                    if(res.code == 200){
                        var productsHtml = juicer(productsTmpl, {data: res.data});
                        $('.longcoin-store-products').html(productsHtml);
                        self.productEvent();
                    }
                },
                error: function(res){}
            });
        }
    });
    new CoinStore();
});