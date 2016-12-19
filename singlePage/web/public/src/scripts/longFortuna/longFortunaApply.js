require("../../styles/core/iosSelect.css");
require("../../styles/longFortuna/longFortuna.css");
require("sweetCss");

var $ = require("jquery"),
    juicer = require('juicer'),
    sweetJs = require("sweetJs"),
    IosSelect = require('../core/iosSelect.js'),
    areaData = require('../core/areaData_v2.js').chinaArea;


$(function () {

    function getLocation(callBack) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                
                var longitude = position.coords.longitude,//经度                
                    latitude = position.coords.latitude;//纬度

                //根据经纬度获取地理位置，不太准确，获取城市区域还是可以的
                var map = new BMap.Map("allmap"), point = new BMap.Point(longitude, latitude), gc = new BMap.Geocoder();
                gc.getLocation(point, function(rs) {
                    var addComp = rs.addressComponents;
                    callBack("success",addComp);
                });
            },function (error) {
                callBack("error","");
            });
        } else{
            callBack("error","");
        }
    }

    var inputTmpl = [
        '<div class="long-fortuna-input-wrap">',
            '{@if realName}',
                '<div>${realName}</div>',
            '{@else}',
                '<input name="realName" type="text" class="long-fortuna-input" placeholder="姓名"/>',
            '{@/if}',
        '</div>',
        '<div class="long-fortuna-input-wrap">',
            '{@if phone}',
                '<div>${phone}</div>',
            '{@else}',
                '<input name="tel" type="tel" class="long-fortuna-input" placeholder="手机号"/>',
            '{@/if}',
        '</div>',
        '<div class="long-fortuna-input-wrap" id="select_contact">',
            '<label id="select_label" class="long-fortuna-input-label">常住地</label>',
            '<div id="show_address" class="long-fortuna-input-address clearfloat">',
                '<span id="show_contact" class="f-l"></span>',
                '<span id="show_cursor_blink" class="f-l cursor-blink"></span>',
            '</div>',
        '</div>'
    ].join("");


    function LongFortunaApply() {
        this.init();
    }

    $.extend(LongFortunaApply.prototype, {
        init: function () {
            var self = this;
            if (self.getUrlParameter("access_token") && self.getUrlParameter("access_token") != "null") {
                self.access_token = self.getUrlParameter("access_token");
                self.getUserInfo();
            }else if(self.getUrlParameter("token") && self.getUrlParameter("token") != "null"){
                self.access_token = self.getUrlParameter("token");
                self.getUserInfo();
            }else{
                self.render({realName : "", phone : ""})
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
        render:function(renderData){
            var self = this;

            $(".long-fortuna-message").html(juicer(inputTmpl,renderData));

            self.getLocation();


        },
        bindEvent:function () {
            var self = this;
            $('#select_contact').on('click', function () {
                $("#select_label").hide();
                $("#show_address").css("display","block");
                $("#show_cursor_blink").css("display","inline-block");
                // $('#show_contact').html("");

                var iosSelect = new IosSelect(3, 
                    [areaData.iosProvinces, areaData.iosCitys, areaData.iosCountys],
                    {
                        title: '',
                        oneTwoRelation: 1,
                        twoThreeRelation: 1,
                        addClassName:"long-fortuna-select",
                        oneLevelId: "110000",
                        twoLevelId: "110100",
                        threeLevelId: "110101",
                        callback: function (selectOneObj, selectTwoObj, selectThreeObj) {
                            $("#show_cursor_blink").css("display","none");

                            $('#show_contact').html(selectOneObj.value + ' ' + selectTwoObj.value + ' ' + selectThreeObj.value);
                        },
                        cancelCallback : function () {
                            $("#show_cursor_blink").css("display","none");

                        }
                    });
            });
            $("#apply_sure").on("click",function () {
                var sendData = {};
                if(!!self.access_token){
                    sendData.realName = self.userInfoData.realName;
                    sendData.phone = self.userInfoData.phone;
                }else{
                    sendData.realName = $("input[name=realName]").val();
                    sendData.phone = $("input[name=tel]").val();
                }

                sendData.address = $('#show_contact').text();

                if(sendData.realName == ""){
                    swal({
                        title: "",
                        text: "请输入姓名!",
                        type: "",
                        showCancelButton: false,
                        confirmButtonColor: "#24b26f",
                        confirmButtonText: "确定",
                        closeOnConfirm: true
                    },function () {
                        if(!self.access_token) {
                            $("input[name=realName]").val("").focus();
                        }
                    });
                    return false;
                }
                if(sendData.phone == "" || sendData.phone.length != 11){
                    swal({
                        title: "",
                        text: "请输入正确的手机号码!",
                        type: "",
                        showCancelButton: false,
                        confirmButtonColor: "#24b26f",
                        confirmButtonText: "确定",
                        closeOnConfirm: true
                    },function () {
                        if(!self.access_token) {
                            $("input[name=tel]").val("").focus();
                        }
                    });
                    return false;
                }
                if(sendData.address == ""){
                    swal({
                        title: "",
                        text: "请选择常住地!",
                        type: "",
                        showCancelButton: false,
                        confirmButtonColor: "#24b26f",
                        confirmButtonText: "确定",
                        closeOnConfirm: true
                    },function () {
                        $('#select_contact').click();
                    });
                    return false;
                }

                self.sendApply(sendData);

            });
            



        },
        getLocation : function () {
            var self = this;
            getLocation(function (type,data) {
                if(type == "success"){
                    $("#select_label").hide();
                    $("#show_address").css("display","block");
                    $('#show_contact').html(data.province + " " + data.city + " " +data.district);
                }
                self.bindEvent();
            });
        },
        sendApply : function (sendData) {
            var self = this;
            $.ajax({
                url: "/v2/testBorrows",
                type: "POST",
                data: sendData,
                success: function (res) {
                    if( res.code == 200 ){
                        swal({
                            title: "",
                            text: "申请已提交，请耐心等待",
                            type: "",
                            showCancelButton: false,
                            confirmButtonColor: "#24b26f",
                            confirmButtonText: "确定",
                            closeOnConfirm: true
                        });
                    }else if(res.code == 401){
                        swal({
                            title: "",
                            text: "您已提交申请，无需再次提交",
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
            })
        },
        getUserInfo : function () {
            var self = this;
            self.userInfoData = {
                realName : "张丽媛",
                phone : "15901344001"
            };

            self.render(self.userInfoData);


            // $.ajax({
            //     url: "/v2/testBorrows",
            //     type: "POST",
            //     data: self.access_token,
            //     success: function (res) {
            //         if( res.code == 200 ){
            //
            //             self.userInfoData = res.data;
            //
            //             self.render(self.userInfoData);
            //
            //         }else{
            //             swal({
            //                 title: "",
            //                 text: res.message,
            //                 timer: 600,
            //                 showConfirmButton: false
            //             });
            //         }
            //     },
            //     error: function (res) {
            //         swal({
            //             title: "",
            //             text: "服务器傲娇了!",
            //             timer: 600,
            //             showConfirmButton: false
            //         });
            //
            //     }
            // })
        }


    });
    
    new LongFortunaApply();
});