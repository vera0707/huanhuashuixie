
require("../../styles/longFortuna/longFortuna.css");
require("sweetCss");

var $ = require("jquery"),
    juicer = require('juicer'),
    sweetJs = require("sweetJs");

$(function () {
    
    var timeTmpl = [
        '<div class="long-fortuna-title">',
            '<div class="long-fortuna-title-con">申请时间</div>',
        '</div>',
        '<div class="long-fortuna-con">',
            '<div>${startTime} — ${endTime}</div>',
            '{@if status == 1}',
                '<span class="long-fortuna-btn long-fortuna-apply-now">立即申请</span>',
            '{@else}',
                '<span class="long-fortuna-btn btn2">暂未开放申请</span>',
            '{@/if}',
        '</div>'
    ].join('');



    function LongFortuna() {
        this.access_token = false;
        this.init();
    }
    $.extend(LongFortuna.prototype, {
        init: function () {
            var self = this;

            if (self.getUrlParameter("access_token") && self.getUrlParameter("access_token") != "null") {
                self.access_token = self.getUrlParameter("access_token");
            }else if(self.getUrlParameter("token") && self.getUrlParameter("token") != "null"){
                self.access_token = self.getUrlParameter("token");
            }

            self.getApplyTime();

            $(".long-fortuna-li-more").on("click",function () {
                var $this = $(this),$txt = $this.parents(".long-fortuna-li-txt");
                if($txt.hasClass("show")){
                    $txt.removeClass("show").addClass("hide");
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
        render:function(renderData){
            var self = this;



            $(".long-fortuna-apply-time").html(juicer(timeTmpl,renderData));

            self.bindEvent();

        },
        bindEvent:function () {
            var self = this;            
            $(".long-fortuna-apply-now").on("click",function () {
                self.sendApply();
            });
            
        },
        getApplyTime : function () {
            var self = this;


            $.ajax({
                url: "/v2/dragonWealthGod/detail",
                type: "GET",
                data: {},
                success: function (res) {
                    if( res.code == 200 ){
                        self.render(res.data);
                    }else{
                        swal({
                            title: "",
                            text: res.message,
                            timer: 600,
                            showConfirmButton: false
                        });

                    }
            
            
                },
                error: function (res) {
                    swal({
                        title: "",
                        text: "服务器傲娇了!",
                        timer: 600,
                        showConfirmButton: false
                    });


                }
            });
        },
        sendApply : function () {
            var self = this;
            
            if(!self.access_token){
                swal({
                    title: "",
                    text: "请先登录!",
                    type: "",
                    showCancelButton: false,
                    confirmButtonColor: "#24b26f",
                    confirmButtonText: "确定",
                    closeOnConfirm: true
                });
                
                return false;
            }


            $.ajax({
                url: "/v2/user/dragonWealthGod?access_token="+self.access_token,
                type: "POST",
                data: {},
                success: function (res) {
                    if( res.code == 200 ){
                        swal({
                            title: "",
                            text: res.message,
                            type: "",
                            showCancelButton: false,
                            confirmButtonColor: "#24b26f",
                            confirmButtonText: "确定",
                            closeOnConfirm: true
                        });
                    }else{
                        swal({
                            title: "",
                            text: res.message,
                            type: "",
                            showCancelButton: false,
                            confirmButtonColor: "#24b26f",
                            confirmButtonText: "确定",
                            closeOnConfirm: true
                        });
                    }


                },
                error: function (res) {
                    swal({
                        title: "",
                        text: "服务器傲娇了!",
                        type: "",
                        showCancelButton: false,
                        confirmButtonColor: "#24b26f",
                        confirmButtonText: "确定",
                        closeOnConfirm: true
                    });

                }
            });
        }
    });
    
    new LongFortuna();
});