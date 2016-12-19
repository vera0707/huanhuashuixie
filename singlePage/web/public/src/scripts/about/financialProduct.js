/**
 * Created by lishuxia on 16/9/7.
 */
require("../../styles/about/userGuide.css");

var $ = require("jquery");

$(function () {
    function FinancialProduct() {
        this.init();
    }

    $.extend(FinancialProduct.prototype, {
        init: function () {
            var self = this;
            
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

            })
        }
    });

    new FinancialProduct();

});