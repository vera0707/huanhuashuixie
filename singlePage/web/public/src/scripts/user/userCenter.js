/**
 * Created by lishuxia on 16/8/5.
 */
require("../../styles/user/userCenter.css");

var $ = require("jquery"),
    juicer = require('juicer'),
    L = require('../core/core.js'),
    images_s_v1_l = require('../../images/user/userCenter/hy_s_v1_l'),
    images_s_v2_l = require('../../images/user/userCenter/hy_s_v2_l'),
    images_s_v3_l = require('../../images/user/userCenter/hy_s_v3_l'),
    images_s_v4_l = require('../../images/user/userCenter/hy_s_v4_l'),
    images_s_v5_l = require('../../images/user/userCenter/hy_s_v5_l'),

    images_b_v1_l = require('../../images/user/userCenter/hy_b_v1_l'),
    images_b_v2_l = require('../../images/user/userCenter/hy_b_v2_l'),
    images_b_v3_l = require('../../images/user/userCenter/hy_b_v3_l'),
    images_b_v4_l = require('../../images/user/userCenter/hy_b_v4_l'),
    images_b_v5_l = require('../../images/user/userCenter/hy_b_v5_l'),

    images_s_v1_d = require('../../images/user/userCenter/hy_s_v1_d'),
    images_s_v2_d = require('../../images/user/userCenter/hy_s_v2_d'),
    images_s_v3_d = require('../../images/user/userCenter/hy_s_v3_d'),
    images_s_v4_d = require('../../images/user/userCenter/hy_s_v4_d'),
    images_s_v5_d = require('../../images/user/userCenter/hy_s_v5_d'),
    imageWen = require('../../images/wen.png'),
    imageText = require('../../images/user/userCenter/text_fireworks.png');

var userTmpl = [
    '{@each i in range(1, 6)}',
        '{@if i == data.level}',
            '<li class="userCenter-li">',
                '<img src="{@if data.level == 1}'+ images_b_v1_l +'{@else if data.level==2}'+ images_b_v2_l +'{@else if data.level==3}'+ images_b_v3_l +'{@else if data.level==4}'+ images_b_v4_l +'{@else if data.level==5}'+ images_b_v5_l +'{@/if}" alt="" class="userCenter-user-level w100"/>',
                '<div class="hyCenter-li-list clearfloat">',
                    '<span class="userCenter-li-circle userCenter-color2"></span>',
                    '<span class="userCenter-li-line  {@if i != 5}userCenter-color3{@/if}"></span>',
                '</div>',
                '<div class="text-note">{@if i == 1}0{@else if i == 2}100{@else if i == 3}1000{@else if i == 4}10000{@else if i == 5}100000{@/if}点</div>',
                '<div class="pro-rel height30 mt10">',
                    '<div class="userCenter-cursor-level">',
                        '<div>成长值: ${data.value}点</div>',
                            '{@if !!data.message}<div class="text-note">(${data.message})</div>{@/if}',
                        '<div  class="userCenter-wen"><img src="'+ imageWen +'" alt="" class="w100"></div>',
                    '</div>',
                '</div>',
            '</li>',
            '{@else}',
                '{@if i < data.level}',
                '<li class="userCenter-li">',
                    '<img src="{@if i==1}'+ images_s_v1_l +'{@else if i==2}'+ images_s_v2_l +'{@else if i==3}'+ images_s_v3_l +'{@else if i==4}'+ images_s_v4_l +'{@else if i==5}'+ images_s_v5_l +'{@/if}" alt="" class="userCenter-user-level hyCenter-li-img"/>',
                    '<div class="hyCenter-li-list clearfloat">',
                        '<span class="userCenter-li-circle userCenter-color2"></span>',
                        '<span class="userCenter-li-line userCenter-color2"></span>',
                    '</div>',
                    '<div class="text-note">{@if i == 1}0{@else if i == 2}100{@else if i == 3}1000{@else if i == 4}10000{@else if i == 5}100000{@/if}点</div>',
                '</li>',
                '{@else if i > data.level}',
                '<li class="userCenter-li">',
                    '<img src="{@if i==1}'+ images_s_v1_d +'{@else if i==2}'+ images_s_v2_d +'{@else if i==3}'+ images_s_v3_d +'{@else if i==4}'+ images_s_v4_d +'{@else if i==5}'+ images_s_v5_d +'{@/if}" alt="" class="userCenter-user-level hyCenter-li-img"/>',
                    '<div class="hyCenter-li-list clearfloat">',
                        '<span class="userCenter-li-circle userCenter-color1"></span>',
                        '<span class="userCenter-li-line {@if i != 5}userCenter-color1{@/if}"></span>',
                    '</div>',
                    '<div class="text-note">{@if i == 1}0{@else if i == 2}100{@else if i == 3}1000{@else if i == 4}10000{@else if i == 5}100000{@/if}点</div>',
                '</li>',
                '{@/if}',
        '{@/if}',
    '{@/each}'
].join("");

var dialogTmpl = [
    '<img src="{@if data ==1}'+ images_b_v1_l +'{@else if data == 2}' + images_b_v2_l + '{@else if data == 3}' + images_b_v3_l + '{@else if data == 4}'+ images_b_v4_l +'{@else if data == 5}' + images_b_v5_l + '{@/if}" alt="" class="w60"/>',
    '<img src="' + imageText+ '" alt="" class="w100" />'
].join("");

$(function () {
    function UserCenter() {
        this.access_token = null;
        this.userLerver = null;
        this.currentX = 0;
        this.init();
    }

    $.extend(UserCenter.prototype, {
        init: function () {
            var self = this;
            
            if (self.getUrlParameter("access_token") && self.getUrlParameter("access_token") != "null") {
                self.access_token = self.getUrlParameter("access_token");
            }else if(self.getUrlParameter("token") && self.getUrlParameter("token") != "null"){
                self.access_token = self.getUrlParameter("token");
            }
            
            if(self.access_token){
                self.ajaxIsFire();
                self.getGrowthValue();
                self.messageAjax();
            }

            self.bindEvent();
        },
        render:function(){
            var self = this,
                liWith = document.body.clientWidth*0.0671*5,
                liLevelLeft = (liWith - 130)/2;
            $('.userCenter-cursor-level').css({'left': liLevelLeft + 'px'});
            
            if(self.userLerver == 1){
                $('.moreGiftPage').show();
                $('.yearGet').addClass('hyRules-lt hyRules-lr');
                $('.morePrivilege').addClass("hyRules-lb");
                $('.morePrivilege1').addClass('hyRules-lb').removeClass('hyRules-lr');
                self.currentX = liWith;
            }else{
                $('.myGiftPage').show();
                self.currentX = -liWith*(self.userLerver-2);
            }
            self.move(self.currentX);
            self.moveAnimation();
            
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
        move:function (currLength) {
            $('.userCenter-header-con').css({
                'transition-property': 'transform',
                'transform-origin': '0px 0px 0px',
                'transform': 'translate(' + currLength + 'px, 0px) scale(1) translateZ(50px)',
                'transition': 'transform 0.5s',
                '-moz-transition': 'transform 0.5s',
                '-webkit-transition': 'transform 0.5s',
                '-o-transition': 'transform 0.5s'
            });
        },
        bindEvent:function () {
            var self = this;
            
            $('.historyCode').on('click',function () {
                 window.location.href = '/v2/user/vip/privilege/collectRecord?access_token='+self.access_token;
            });
            $('.drawalsPage').on('click',function () {
                self.pageChange('1');
            });
            $('.birthdayPage').on('click',function () {
                self.pageChange('2');
            });
            $('.giftPage').on('click',function () {
                self.pageChange('3');
            });
            $('.hyRulePage').on('click',function () {
                window.location.href = '/v2/user/vip/rule?access_token='+self.access_token;
            });
            $('.mask,.dialog').on('click',function () {
                $('.mask').hide();
                $('.dialog').html('');
            })
        },
        moveAnimation:function () {
              var self = this,
                  startPos={},
                  endPos={};

            document.getElementById('header-touch').addEventListener('touchstart', touchSatrtFunc, false);
            document.getElementById('header-touch').addEventListener('touchmove', touchMoveFunc, false);
            document.getElementById('header-touch').addEventListener('touchend', touchEndFunc, false);

            function touchSatrtFunc(evt) {
                if(evt && evt.stopPropagation){
                    evt.stopPropagation();
                }else{
                    window.event.cancelBubble = true;
                }

                var touch = evt.touches[0]; //获取第一个触点
                startPos = {
                    x: touch.pageX,
                    time: +new Date
                };

            }
            function touchMoveFunc(evt) {
                if(evt && evt.stopPropagation){
                    evt.stopPropagation();
                }else{
                    window.event.cancelBubble = true;
                }
                var touch = evt.touches[0]; //获取第一个触点

                if (evt.touches.length > 1 || evt.scale && evt.scale !== 1) return;

                endPos = {
                    x: touch.pageX - startPos.x
                };

            }
            function touchEndFunc(evt) {
                if(evt && evt.stopPropagation){
                    evt.stopPropagation();
                }else{
                    window.event.cancelBubble = true;
                }
                var duration = +new Date - startPos.time,
                    liWith = document.body.clientWidth*0.0671*5,
                    leftMaxX = 0,
                    rightMaxY = -liWith*2;

                if (Number(duration) > 100) {
                    if (endPos.x > 50) {
                        self.currentX += liWith;
                    } else if(endPos.x < -50) {
                        self.currentX -= liWith;
                    }
                    else{
                        return;
                    }
                }
                
                if(self.userLerver == 1){
                    leftMaxX = liWith;
                }

                if(self.userLerver == 5){
                    rightMaxY = -liWith*3
                }
                if(self.currentX > leftMaxX){
                    self.currentX = leftMaxX;
                }else if(self.currentX < rightMaxY){
                    self.currentX = rightMaxY;
                }
                self.move(self.currentX);
            }


        },
        getGrowthValue:function () {
            var self = this;
            $.ajax({
                url : '/v2/user/vip/privilege/growthValue',
                type: 'GET',
                data: 'access_token=' + self.access_token,
                success: function (res) {
                    if(res.code == 200){
                        self.userLerver = res.data.level;
                       
                        var userData = res.data;
                        userData.message = userData.message.trim();
                        
                        var userHtml = juicer(userTmpl,{data: userData});
                        $('#userlist').html(userHtml);
                        
                        $("#loading").hide();
                        $(".userCenter-ul").show();
                        self.render();
                        
                        $('.userCenter-wen').on('click',function(){
                            window.location.href = '/v2/user/vip/rule?access_token='+self.access_token;
                        });

                        var str = null,
                            number = self.userLerver;
                        if(number == 1){
                            $('.getLottery').html('可以领取一张');
                        }else {
                            if (number == 2) {
                                str = '一';
                            } else if (number == 3) {
                                str = '两';
                            } else if (number == 4) {
                                str = '三';
                            } else if (number == 5){
                                str = '四';
                            }

                            $('.getLottery').html('每年可以领取' + str + '张');
                        }
                    }
                }
            })
        },
        messageAjax:function () {
            var self = this;
            $.ajax({
                url:'/v2/user/vip/privilege/1/status?access_token='+self.access_token,
                type:'GET',
                cache: false,
                success:function (res) {
                    if(res.code == 200){
                        var code = $('.tixian-circle');
                        if(res.data == 1){
                            code.show();
                        }
                    }
                }
            });

            $.ajax({
                url:'/v2/user/vip/privilege/3/status?access_token='+self.access_token,
                type:'GET',
                cache: false,
                success:function (res) {
                    if(res.code == 200){
                        var code = $('.upgrade-circle');
                        if(res.data == 1){
                            code.show();
                        }
                    }
                }
            })
        },
        pageChange:function (type) {
            var self = this;
            $.ajax({
                url:'/v2/user/vip/privilege/'+type+'/status',
                type:'GET',
                data:'access_token='+self.access_token,
                success:function (res) {
                    if(res.code == 200){
                        var str = '/v2/user/vip/privilege/';
                        if(type == 1){
                            window.location.href = str+'drawals?access_token='+self.access_token;
                        }else if(type == 2){
                            window.location.href = str+'birthday?access_token='+self.access_token;
                        }else if(type == 3){
                            window.location.href = str+'gift?access_token='+self.access_token;
                        }
                    }
                },
                error:function () {
                    
                }
            })
        },
        ajaxIsFire:function () {
            var self = this;
            $.ajax({
                url: '/v2/user/vip/haveUpgrade',
                type: 'GET',
                cache: false,
                data: 'access_token=' + self.access_token,
                success: function (res) {
                    if(res.code == 200){
                        var fireDate = res.data;
                        if(!!fireDate.haveUpgrade && (0 < fireDate.level < 6)){
                            var dialogHtml = juicer(dialogTmpl,{data: fireDate.level});
                            $('.mask').show();
                            $('.dialog').html(dialogHtml);
                        }
                    }
                },
                error: function (res) {}
            });

        }
    });
    
    new UserCenter();
});