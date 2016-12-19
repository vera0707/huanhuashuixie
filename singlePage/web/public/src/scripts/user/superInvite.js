/**
 * Created by lishuxia on 16/11/2.
 */
require('../../styles/user/superInvite.css');

var $ = require("jquery"),
    juicer = require('juicer');

var listTmpl = [
    '{@each data as item,index}',
        '<tr>',
            '<td>${index | incream}</td>',
            '<td>{@if !!item.createTime}${item.createTime | time}{@/if}</td>',
            '<td>{@if !!item.realName}${item.realName}{@/if}</td>',
            // '<td>{@if !!item.cellPhone}${item.cellPhone}{@/if}</td>',
            '<td>{@if !!item.rebateAmountTotal}${item.rebateAmountTotal}元{@else}0{@/if}</td>',
            '<td>{@if !!item.invitee}${item.invitee}元{@else}0{@/if}</td>',
        '</tr>',
    '{@/each}'
].join('');

juicer.register("incream", function(index) {
    return index + 1;
});
juicer.register("time", function(createTime) {
    var time = new Date(createTime),
        y =  time.getFullYear(),
        m = time.getMonth()+1,
        d = time.getDate();
    
    return y + '/' + m + '/' + d;
});

var totalTmp = [
    '<tr class="text-left">',
        '<td colspan="5" class="invite-table-td">',
            '<div>当月发生额总计: <span>{@if !!data.investAmountTotal}${data.investAmountTotal}元{@else}0{@/if}</span></div>',
            '<div>当月返利总计: <span>{@if !!data.rebateAmountTotal}${data.rebateAmountTotal}元{@else}0{@/if}</span></div>',
        '</td>',
    '</tr>'
].join('');

$(function () {
    function SuperInvite() {
        this.userId = null;
        this.init();
    }

    $.extend(SuperInvite.prototype, {
        init:function () {
            var self = this;

            var theMonth = new Date().getMonth() + 1;
            if(theMonth > 0 &&  theMonth < 13){
                $('option[value = ' + theMonth + ']').attr("selected",true);
            }

            if (self.getUrlParameter("userId") && self.getUrlParameter("userId") != "null") {
                self.userId = self.getUrlParameter("userId");
                self.ajaxList();
                self.ajaxTotal();
                // self.bindEvent();
            }

        },
        // bindEvent:function () {
        //     $('.invite-select').on('change',function () {
        //         var checkMonth = $(this).find('option:selected').val();
        //     })
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
        ajaxList:function () {
            var self = this;

            $.ajax({
                url: '/v1/superUser/queryRebateListByUserId/' + self.userId,
                type: 'GET',
                data: {},
                success:function (res) {
                    if(res.code == 200){
                        var listHtml = juicer(listTmpl,{data: res.data});
                        $('#inviteData').prepend(listHtml);
                    }else{
                        swal('',res.message);
                    }
                    
                },
                error:function (res) {
                    swal('','服务器傲娇了');
                }
            });
        },
        ajaxTotal : function () {
            var self = this;
            $.ajax({
                url: '/v1/superUser/queryRebateTotalByUserId/' + self.userId,
                type: 'GET',
                data: {},
                success: function (res) {
                    if(res.code == 200){
                        var totalHtml = juicer(totalTmp,{data: res.data});
                        $('#inviteData').append(totalHtml);
                    }else{
                        swal('',res.message);
                    }
                },
                error:function (res) {
                    swal('','服务器傲娇了');
                }
            });
        }
    });

    new SuperInvite();
});