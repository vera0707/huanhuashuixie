require("../../styles/longCoin/longCoinProduct.css");
var $ = require("jquery"),
    juicer = require('juicer'),
    swal = require('sweetJs'),
    tixian = require('../../images/longCoin/quan@3x.png'),
    jiaxi = require('../../images/longCoin/quan2@3x.png'),
    hongbao = require('../../images/longCoin/hongbao@3x.png');

var proDetailTmpl = [
    '<div class="longcoin-product-top clearfloat">',
        '<div class="f-l longcoin-product-image {@if data.productType == 1} icon-hongbao {@else if data.productType == 2} icon-tixian {@else if data.productType == 3} icon-jiaxi {@/if}">',
            '<img class="longcoin-product-image-icon" src="{@if data.productType == 1}' + hongbao + '{@else if data.productType == 2} ' + tixian + '{@else if data.productType == 3}' + jiaxi + '{@/if}"/>',
            '<div class="longcoin-product-image-amount">${data.productType,data.productName | mainTitle}</div>',
            '<div class="longcoin-product-image-name">${data.productName}</div>',
        '</div>',
        '<div class="f-l longcoin-product-info">',
            '<div class="longcoin-product-info-name">${data.productName}</div>',
            '<div class="pdl15">[使用龙币]</div>',
            '<div class="longcoin-product-price">',
                '<span class="c-f75419 font16">${data.coins}</span>',
                '<span> 龙币</span>',
            '</div>',
        '</div>',
    '</div>',
    '<div class="longcoin-product-title">',
        '<span class="longcoin-product-title-con">商品介绍</span>',
    '</div>',
    '<div class="longcoin-product-con">${data.productDescribe}</div>',
    '<div class="longcoin-product-title">',
        '<span class="longcoin-product-title-con">可兑换期限</span>',
    '</div>',
    '<div class="longcoin-product-con">${data.saleStartTime | timeTrans}至${data.saleEndTime | timeTrans}</div>'
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

juicer.register("timeTrans", function(time) {
    time = new Date(time);
    var year = time.getFullYear(),
        months = time.getMonth() + 1,
        days = time.getDate();
    return year + '年' + months + '月' + days + '日';
});

$(function () {
    function CoinProducts() {
        this.access_token = null;
        this.goodId = null;
        this.canChange = true;
        this.productType = null;
        this.init();
    }

    $.extend(CoinProducts.prototype, {
        init: function () {
            var self = this;
            if (self.getUrlParameter("access_token") && self.getUrlParameter("access_token") != "null") {
                self.access_token = self.getUrlParameter("access_token");
                self.ajaxUserCoin();
            }else if(self.getUrlParameter("token") && self.getUrlParameter("token") != "null"){
                self.access_token = self.getUrlParameter("token");
                self.ajaxUserCoin();
            }
            
            var localString = location.pathname,localStr;
            if(localString.indexOf("product") > -1){
                localStr = localString.split('product/')[1];     //现在str是一个数组了
            }

            if(!!localStr){
                self.goodId = localStr;
                self.ajaxGoodDetail();
            }
        },
        bindEvent: function () {
            var self = this;
            $('.longcoin-product-buy-add').on('click', function () {
                var $count = $('.longcoin-product-buy-num'),
                    total = $count.html();
                $count.html(++total);
            });

            $('.longcoin-product-buy-sub').on('click', function () {
                var $count = $('.longcoin-product-buy-num'),
                    total = $count.html();
                total <= 1 ? 0 : --total;
                $count.html(total);
            });
            $('.longcoin-product-btn').on('click', function () {
                if(!!self.access_token){
                    if(self.canChange){
                        self.canChange = false;
                        self.ajaxExchange();
                    }
                }else{
                    location.href = "longdai://login";
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
                    if (res.code == 200) {
                        $('.longcoin-product-buy-t').show();
                        $('.longcoin-product-useamount').html(res.data.userCoinsCount);
                    }
                },
                error: function (res) {}
            })
        },
        ajaxGoodDetail:function(){
            var self = this;
            $.ajax({
                url: '/v2/dragonCoins/goods/' + self.goodId,
                type: 'GET',
                data: {},
                success: function (res) {
                    if(res.code == 200){
                        var proDetailHtml = juicer(proDetailTmpl, {data: res.data});
                        $('.longcoin-product-detail').html(proDetailHtml);
                        if( res.data.status != 1 || res.data.count <= 0){
                            $('.longcoin-product-buy').hide();
                        }
                            self.productType = res.data.productType;
                    }

                    $('.longcoin-product').show();
                    self.bindEvent();
                },
                error: function (res) {}
            })
        },
        ajaxExchange: function () {
            var self = this;
            var count = $('.longcoin-product-buy-num').html();
            $.ajax({
                url: '/v2/dragonCoins/exchange',
                type: 'PUT',
                data: {
                    access_token: self.access_token,
                    count : count,   
                    goodId : self.goodId    
                },
                success: function (res) {
                    if (res.code == 200) {
                        if (res.data == -2) {
                            swal({
                                    title: '',
                                    text: res.message,
                                    showCancelButton: true,
                                    cancelButtonText: '关闭',
                                    confirmButtonColor: "#DD6B55",
                                    confirmButtonText: "赚龙币",
                                    closeOnConfirm: false
                                },
                                function () {
                                    location.href = '/v2/dragonCoins/user?access_token=' + self.access_token;
                                });
                        } else if (res.data == 1) {
                            swal({
                                    title: '',
                                    text: res.message,
                                    showCancelButton: true,
                                    cancelButtonText: '关闭',
                                    confirmButtonColor: "#DD6B55",
                                    confirmButtonText: "查看详情",
                                    closeOnConfirm: false
                                },
                                function () {
                                    if(self.productType == 1){
                                        location.href = '/v2/user/couponPackage?access_token=' + self.access_token + '&show_type=red';
                                    }else{
                                        location.href = '/v2/user/couponPackage?access_token=' + self.access_token;
                                    }
                                });
                            self.ajaxUserCoin();
                        } else{
                            swal({
                                title: '',
                                text: res.message,
                                confirmButtonText: '我知道了'
                            });
                        }
                    } else {
                        swal({
                            title: '',
                            text: res.message,
                            confirmButtonText: '我知道了'
                        });
                    }
                    self.canChange = true;
                },
                error: function (res) {
                    swal({
                        title: '',
                        text: '服务器傲娇了',
                        confirmButtonText: '我知道了',
                    });
                    self.canChange = true;
                }
            })
        }
    });

    new CoinProducts();

});