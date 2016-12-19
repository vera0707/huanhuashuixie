require('../../styles/user/collectRecords.css');

var $ = require("jquery"),
    juicer = require('juicer');

var recordsTmpl = [
    '{@each data as item}',
    '<tr>',
    '<td>${item.drawTime |collectTime}</td>',
    '<td>${item.privilegeName}</td>',
    '<td class="${item.userLevel | levelClass}">V${item.userLevel}</td>',
    '</tr>',
    '{@/each}'
].join("");

juicer.register('collectTime', function (time) {
    var time = new Date(time),
        year = time.getFullYear(),
        month = time.getMonth() + 1,
        date = time.getDate();

    return year + '.' + month + '.' + date;
});
juicer.register('levelClass', function (number) {
    if (number == 1) {
        return 'color-v1';
    } else if (number == 2) {
        return 'color-v2';
    } else if (number == 3) {
        return 'color-v3';
    } else if (number == 4) {
        return 'color-v4';
    } else if (number == 5) {
        return 'color-v5';
    }
});

$(function () {
    function Records() {
        this.init();
    }

    $.extend(Records.prototype, {
        init: function () {
            var self = this;

            if (self.getUrlParameter("access_token") && self.getUrlParameter("access_token") != "null") {
                self.access_token = self.getUrlParameter("access_token");
            }else if(self.getUrlParameter("token") && self.getUrlParameter("token") != "null"){
                self.access_token = self.getUrlParameter("token");
            }

            if(!!self.access_token){
                self.collectAjax();
            }else{
                swal('请先登录');
            }
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
        collectAjax(){
            var self = this;
            $.ajax({
                url: '/v2/user/vip/privilege/record',
                type: 'GET',
                data: 'access_token=' + self.access_token + '&page=1&pages=1',
                success: function (res) {
                    if (res.code == 200) {
                        var recoredsHtml = juicer(recordsTmpl, {data: res.data});
                        $('.record-table-tbody').html(recoredsHtml);
                    } else {
                        swal(res.message);
                    }
                },
                error: function (res) {
                    swal(res.message);
                }
            })
        }
    });

    new Records();

});