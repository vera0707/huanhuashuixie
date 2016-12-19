/*******************************************************************************
 * Copyright (c) 2005-2016 Gozap, Inc.
 * description:
 * Contributors:
 * sundongzhi  on 16/6/13
 *******************************************************************************/
require("../../styles/activity/olympicGames.css");

var $ = require("jquery"),
    juicer = require('juicer'),
    L = require('../core/core.js');
var image61 = require('../../images/activity/olympicGames/icon_61.png'),
    image55 = require('../../images/activity/olympicGames/icon_55.png'),
    image52 = require('../../images/activity/olympicGames/icon_52.png'),
    image49 = require('../../images/activity/olympicGames/icon_49.png'),
    image06 = require('../../images/activity/olympicGames/icon_06.png'),
    image19 = require('../../images/activity/olympicGames/icon_19.png'),
    image16 = require('../../images/activity/olympicGames/icon_16.png'),
    image32 = require('../../images/activity/olympicGames/icon_32.png'),
    image23 = require('../../images/activity/olympicGames/icon_23.png'),
    image34 = require('../../images/activity/olympicGames/icon_34.png'),
    image25 = require('../../images/activity/olympicGames/icon_25.png'),
    image36 = require('../../images/activity/olympicGames/icon_36.png'),
    image27 = require('../../images/activity/olympicGames/icon_27.png'),
    image29 = require('../../images/activity/olympicGames/icon_29.png'),
    image55 = require('../../images/activity/olympicGames/icon_55.png');

$(function () {

    var dataTmpl = [
        '<div>',
            '<div class="olypic-date-header">',
                '<div class="font12">',
                '{@if !!data.userName}',
                '${data.userName}',
                '{@/if}',
                '</div>',
                '<div class="olypic-date-tody">2016年8月</div>',
            '</div>',
            '<div class="pdb10">',
                '<div class="olypic-date-row font12 mb5 clearfloat">',
                    '<div>日</div>',
                    '<div>一</div>',
                    '<div>二</div>',
                    '<div>三</div>',
                    '<div>四</div>',
                    '<div>五</div>',
                    '<div>六</div>',
                '</div>',
                '{@each data.singInHistory as item,index}',
                    '{@if index == 0 || index == 7 || index == 14 || index == 21 || index == 28}<div class="olypic-date-row clearfloat">{@/if}',
                    '{@if item.isLogin}',
                        '<div class="po-rel color6da6be">${item.day}<img src="'+ image19 +'" alt="" class="olypic-date-right"/></div>',
                    '{@else}',
                    '<div class="po-rel">${item.day}</div>',
                '{@/if}',
                '{@if index == 6 || index == 13 || index == 20 || index == 27 || index == 34}</div>{@/if}',
                '{@/each}',
        '</div>',
        '<img src="'+ image16 +'" alt="" class="olypic-date-bg"/>',
        '<div class="olypic-date-user">',
        '{@if !!data.headImg}',
            '<img src="${data.headImg}" alt="" class="olypic-user-img"/>',
        '{@else}',
            '<img src="http://cdn.longdai.com/img/e50de2b0dfb842f2ade46d67f192bab0.png" alt="" class="olypic-user-img"/>',
        '{@/if}',
        '</div>'
    ].join('');

    var investTmpl = [
        '{@each data.invest as item,index}',
        '{@if index <= 2}',
        '<div class="olypic-game-list clearfloat">',
            '<div class="w35 f-l">',
                '<div>${item.userName}</div>',
                '<div>&yen;<span>${item.investAmount}</span></div>',
            '</div>',
            '<div class="w65 f-l clearfloat">',
                '{@if index == 0}',
                '<img src="'+ image32 +'" alt="" class="f-r olypic-game-number-icon"/>',
                '<img src="'+ image23 +'" alt="" class="f-r olypic-game-people mr10"/>',
                '{@/if}',
                '{@if index == 1}',
                '<img src="'+ image34 +'" alt="" class="f-r olypic-game-number-icon"/>',
                '<img src="'+ image25 +'" alt="" class="f-r olypic-game-people mr50"/>',
                '{@/if}',
                '{@if index == 2}',
                '<img src="'+ image36 +'" alt="" class="f-r olypic-game-number-icon"/>',
                '<img src="'+ image27 +'" alt="" class="f-r olypic-game-people mr90"/>',
                '{@/if}',
            '</div>',
        '</div>',
        '{@/if}',
        '{@/each}',
        '{@if !!data.myInvest}',
        '<div class="h75">',
            '<img src="'+ image29 +'" alt="" class="olypic-game-user f-l"/>',
            '<div class="f-l olypic-game-user-data">',
                '<div>我</div>',
                '<div>&yen;${data.myInvest.investAmount}</div>',
                '<div>第{@if data.myInvest.myRank}${data.myInvest.myRank}{@else}&nbsp;&nbsp;{@/if}名</div>',
            '</div>',
        '</div>',
        '{@/if}'
    ].join("");

    var dialogTmpl = [
        '{@if opts.type == "answerRight"}',
        '<img class="w100" src="' + image61 + '"/>',
        '<div class="dialog-bottom">',
           '<div class="dialog-con">${opts.message}</div>',
            '{@if opts.status == 1}',
            '<span class="dialog-btn dialog-btn-sure getMoreQueetion">试试下一题</span>',
            '{@/if}',
        '</div>',
        '{@/if}',
        '{@if opts.type == "getQuestion"}',
        '<div class="dialog-bottom">',
            '<div class="dialog-con mt15">答题签到</div>',
            '<div class="dialog-con1">',
                '<div>${opts.question}</div>',
                '<div class="mt15">',
                    '{@each opts.options as item}',
                    '<div class="dialog-checked-con h35">',
                        '{@if item.name == "A"}',
                        '<img src="' + image55 + '" alt="" class="dialog-checked checked" data-choose="${item.name}"/>',
                        '{@else}',
                        '<img src="' + image52 + '" alt="" class="dialog-checked unchecked" data-choose="${item.name}"/>',
                        '{@/if}',
                        '<span class="dialog-checked-text" >${item.name}. ${item.title}</span>',
                    '</div>',
                    '{@/each}',
                '</div>',
            '</div>',
            '<span class="dialog-btn dialog-btn-sure olympic-submit-question" data-id="${opts.id}" data-key="${opts.questionKey}" data-col="adajsahdfsd">提交</span>',
        '</div>',
        '{@/if}',
        '{@if opts.type == "answerWrong"}',
        '<div class="dialog-icon2">',
            '<div class="clearfloat">',
                '<img src="' + image49 + '" alt=""  class="f-l dialog-mis-user"/>',
                '<div class="f-l">',
                    '<div>很遗憾,未答对!</div>',
                    '<div>${opts.message}</div>',
                '</div>',
            '</div>',
            '{@if opts.status == 1}',
            '<span class="dialog-btn dialog-btn-sure getMoreQueetion">试试下一题</span>',
            '{@/if}',
        '</div>',
        '{@/if}',
        '{@if opts.type == "general"}',
        '<div class="dialog-top">${opts.message}',
        '{@if !!opts.loginButton}<a href="longdai://login"><span  class="dialog-btn dialog-btn-sure">登 录</span></a>{@/if}',
        '</div>{@/if}',
        '<img src="' + image06 + '" alt="" class="dialog-close"/>'
    ].join("");

    function OlypicGames() {
        this.access_token = null;
        this.data = {};
        this.init();

    }

    $.extend(OlypicGames.prototype, {
        init: function () {
            var self = this,
                opts = {};
            if (self.getUrlParameter("access_token") && self.getUrlParameter("access_token") != "null") {
                self.access_token = self.getUrlParameter("access_token");
            }else if(self.getUrlParameter("token") && self.getUrlParameter("token") != "null"){
                self.access_token = self.getUrlParameter("token");
            }
            else{
                opts = {
                            type: 'general',
                            message: '请先登录',
                            loginButton: true
                            };
                        self.dialog(opts);
            }

            self.data.singInHistory = [];
            self.data.singDays = null;

            for(var i=0;i<35;i++){
                if(i >0 && i< 32){
                        self.data.singInHistory.push({
                            day: i,
                            isLogin:false
                        });
                }
                else{
                        self.data.singInHistory.push({
                            day:'',
                            isLogin:false
                        });
                }
            }

             if(!!self.access_token){
                 self.getCurrentUser();
             }else{
                 self.render();
             }
            self.getInvests();
            self.bindEvent();
        },
        render:function(){
            var self = this;
            var dataHtmp = juicer(dataTmpl, {data: self.data});
            $('.olypic-date').html(dataHtmp);
            if(self.data.singDays){
                $('.olypic-days').html(self.data.singDays);
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
        bindEvent: function () {
            var self = this,opts;

            $('.anwserQuestion').on('click',function(){
                if(self.access_token && self.access_token != ''){
                    self.getQuestion();
                }else {
                     opts = {
                        type: 'general',
                         message: '登录后才能答题'
                    };
                    self.dialog(opts);
                }
            });

            $('.olypic').on('click','.getMoreQueetion',function(){
                self.getQuestion();
            });

            $('.olympic-share').on('click',function(){
                self.shareOlympic();
            });

            $('.olypic').on('click','.dialog-checked-con',function (e) {
                e.preventDefault();
                var $currChecked = $(this).find('.dialog-checked'),
                    $checked = $('.dialog-checked');

                    $checked.attr({
                        'class': 'dialog-checked unchecked',
                        'src': image52
                    });
                    $currChecked.attr({
                        'class': 'dialog-checked checked',
                        'src': image55
                    });
            });

            $('.olypic').on('click','.olympic-submit-question',function () {
                var submitKey = {},
                    $submit = $('.olympic-submit-question');
                submitKey.id = $submit.data('id');
                submitKey.questionKey = $submit.data('key');
                submitKey.answer = $('.checked').data('choose');

                self.PostUserAnswer(submitKey);
            });

            $('.olypic').on('click', '.dialog-close',function () {
                self.dialogClose();
            });
        },
        dialog: function (opts) {
            var self = this,
                $dialog = $(".dialog"),
                $mask = $(".mask");
            var dialogHtml = juicer(dialogTmpl, {opts: opts}),
                Width = document.body.scrollWidth;

            $dialog.html(dialogHtml);
            $mask.show();

            if(Width > 750){
                $dialog.css('left',(Width - 500)/2 + 'px');
            }
        },
        dialogClose: function () {
            $(".mask").hide();
            $(".dialog").html("");
        },
        shareOlympic : function () {
              var self = this,
                  opts = {};
              $.ajax({
                  url : '/v2/user/shareInfo',
                  type: 'POST',
                  data: 'access_token=' + self.access_token,
                  success: function (res) {
                      if(res.code == 200){
                          var localHref = encodeURIComponent(res.data.url),
                              title = encodeURIComponent(res.data.title),
                              image = encodeURIComponent(res.data.image);
                          window.location.href = 'longdai://share?url='+ localHref +'&title='+ title +'&image='+ image +"&content=%20";
                      }else{
                          opts = {
                              type: 'general',
                              message: '服务器傲娇了!'
                          };
                          self.dialog(opts);
                      }
                  },
                  error: function () {
                      opts = {
                          type: 'general',
                          message: '服务器傲娇了!'
                      };

                      self.dialog(opts);
                  }
              })
        },
        getCurrentUser: function(){
            var self = this;
            $.ajax({
                url: '/v2/olympicActivity/singInHistory',
                type: 'GET',
                data: 'access_token='+self.access_token,
                success: function (res) {
                    if(res.code == 200){
                        self.data.headImg = res.data.headImg;
                        if(res.data.userName.length > 6){
                            self.data.userName = res.data.userName.slice(0,6) + '...';
                        }else{
                            self.data.userName = res.data.userName;
                        }

                        self.data.singDays = res.data.singInHistory.length;

                        $.each(res.data.singInHistory,function(k,v){
                            var logDay = new Date(Number(v.date)).getDate();
                            $.each(self.data.singInHistory,function(key,value){
                                if(value.day == logDay){
                                    value.isLogin = true;
                                }
                            })
                        });
                        self.render();
                    }else{
                        self.render();
                    }
                },error:function () {
                    self.render();
                }
            })
        },
        getInvests: function () {
            var self = this;
            $.ajax({
                url: '/v2/olympicActivity/invests',
                type: 'GET',
                data: 'access_token=' + self.access_token,
                success: function (res) {
                   if(res.code == 200){
                       self.data.invest = res.data.slice(1);
                       if(!!self.access_token){
                           self.data.myInvest = res.data[0];
                       }else{
                           self.data.myInvest = null;
                       }

                       var investHtml = juicer(investTmpl, {data: self.data});
                       $('.olypic-game').html(investHtml);
                   }
                }
            })
        },
        getQuestion: function () {
            var self = this,
                opts = {};
            $.ajax({
                url:'/v2/olympicActivity/question',
                type:'GET',
                data:'access_token='+self.access_token,
                success:function (res) {
                    if(res.code == 200){
                        self.data.userQuestion = res.data;
                        opts = {
                            type: 'getQuestion',
                            question: self.data.userQuestion.question.question,
                            options: self.data.userQuestion.question.options,
                            id: self.data.userQuestion.question.id,
                            questionKey: self.data.userQuestion.questionKey
                        };
                    }
                    else{
                        opts = {
                            type: 'general',
                            message: res.message
                        };
                    }
                    self.dialog(opts);
                },
                error:function(){
                    opts = {
                        type: 'general',
                        message: '服务器傲娇了!'
                    };
                    self.dialog(opts);
                }
            })
        },
        PostUserAnswer: function (submitKey) {
            var self = this,opts;
            $.ajax({
                url: '/v2/olympicActivity/answer',
                type: 'GET',
                data: 'access_token='+self.access_token+'&question_key='+submitKey.questionKey+'&questionId='+submitKey.id+'&answer='+submitKey.answer,
                success: function (res) {
                    if(res.code == 200){
                        if(res.data.result == 'bingo'){
                            opts = {
                                type: 'answerRight',
                                status: res.data.status,
                                message: res.data.msg.slice(6)
                            };

                            self.getCurrentUser();
                        }
                        else if(res.data.result == 'error'){
                            opts = {
                                type: 'answerWrong',
                                status: res.data.status,
                                message: res.data.msg
                            };
                        }else{
                            opts = {
                                type: 'general',
                                message: res.message
                            };
                        }
                    }else{
                        opts = {
                            type: 'general',
                            message: res.message
                        };
                    }
                    self.dialog(opts);
                },
                error: function () {
                    opts = {
                        type: 'general',
                        message: '服务器傲娇了!'
                    };
                    self.dialog(opts);
                }
            })
        }

    });
    new OlypicGames();
});
