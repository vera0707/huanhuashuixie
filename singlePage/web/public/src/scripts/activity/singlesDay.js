/**
 * Created by zhangliyuan on 16/10/28.
 */
    require("../../styles/activity/singlesDay.css");
    var $ = require("jquery");
    var juicer = require('juicer');

    var L = require('../core/core.js');



    var dialogConTmpl = [
        // '<div class="singlesday-dialog-t"></div>',
        '<div class="singlesday-dialog-con">',    
            '{@if type == "message"}',
                '<div class="singlesday-dialog-message">',
                    '$${container}',
                '</div>',
            '{@else if type == "gift"}',
                '{@each giftList as list}',
                '<div class="singlesday-dialog-gift clearfloat">',
                    '<div class="f-l singlesday-dialog-gift-icon">',
                        '<div class="singlesday-dialog-gift-image image${list.prizeType}"></div>',
                    '</div>',
                    '<div class="f-l singlesday-dialog-gift-con">' +
                        '<p class="">恭喜您</p>',
                        '<p>抽中${list.prizeName}!</p>',
                        '<p class="singlesday-dialog-gift-tips">${list.prizeType|getGiftTips}</p>',
                    '</div>',
                '</div>',
                '{@/each}',
            '{@/if}',
        '</div>',
        '{@if btnUrl}',
            '<a class="singlesday-dialog-btn" href="${btnUrl}">知道咯~</a>',
        '{@else}',
            '<div class="singlesday-dialog-btn">知道咯~</div>',
        '{@/if}'
    ].join("");
    
    
    
    var awardsListTmpl = [
        '{@each awardsLists as li,index}',
            '<div class="singlesday-lottery-awards-li clearfloat">',
                '<span class="f-l">恭喜<span class="pdl5">${li.userName}</span></span>',
                '<span class="f-l pdl5">获得<span class="pdl10">${li.prizeName}</span></span>',
            '</div>',
        '{@/each}'
    ].join('');
    
    
    var awardTmpl = [
        '<div class="singlesday-award-li li1">',
            '{@if fir.userName}',
                '<div class="singlesday-award-li-name">${fir.userName}</div>',
                '<div class="singlesday-award-li-amount">累计年化投资额 ￥${fir.yearAmountSum}</div>',
            '{@else}',
                '<div class="singlesday-award-null">${nullStr}</div>',
            '{@/if}',
        '</div>',
        '<div class="singlesday-award-li li2">',
            '{@if sec.userName}',
                '<div class="singlesday-award-li-name">${sec.userName}</div>',
                '<div class="singlesday-award-li-amount">累计年化投资额 ￥${sec.yearAmountSum}</div>',
            '{@else}',
                '<div class="singlesday-award-null">${nullStr}</div>',
            '{@/if}',
        '</div>',
        '<div class="singlesday-award-li li3">',
            '{@if thir.userName}',
                '<div class="singlesday-award-li-name">${thir.userName}</div>',
                '<div class="singlesday-award-li-amount">累计年化投资额 ￥${thir.yearAmountSum}</div>',
            '{@else}',
                '<div class="singlesday-award-null">${nullStr}</div>',
            '{@/if}',
        '</div>'
    ].join("");

    juicer.register('getMoney', function (m) {
        return parseInt(m);
    });
    juicer.register('getName', function (name) {
        return name.slice(0,1)+"***";
    });
    juicer.register('getGiftTips', function(type){
        if(type < 6){
            return "请至“我的券包”内进行查看";
        }else{
            return "奖品将于活动结束后10个工作日内给予寄送";
        }
    });

    var noDateTmpl = [
        '<div class="singlesday-lottery-null">${nullStr}</div>'
    ].join('');


    function SinglesDay() {
        this.access_token = false;
        this.isWindowScroll = false;
        this.canLottery = true;
        this.firstInit = true;
        this.lotteryCount = 0;
        this.nullStr = "暂无中奖记录";
        this.init();
    }
    $.extend(SinglesDay.prototype,{
        init : function () {
            var self = this;

            var activityTime = new Date("2016/12/06 10:00:00").getTime(),nowTime = new Date().getTime();

            if(activityTime > nowTime){
                self.nullStr = "活动即将开始";
                $(".singlesday-award-li-name").html(self.nullStr);
            }



            if (self.getUrlParameter("access_token") && self.getUrlParameter("access_token") != "null") {
                self.access_token = self.getUrlParameter("access_token");
            }else if(self.getUrlParameter("token") && self.getUrlParameter("token") != "null"){
                self.access_token = self.getUrlParameter("token");
            } else{
                
            }

            if(self.access_token){
                self.getTimes(function () {
                    $(".singlesday-lottery-times").html(self.lotteryCount);

                    var $lotteryTips = $(".singlesday-lottery-tips"),
                        $lotteryBtn = $(".singlesday-lottery-btn");

                    if(self.lotteryCount > 9){
                        $lotteryTips.css("display","none");
                        $lotteryBtn.css("display","block");
                    }else{
                        $lotteryTips.css("display","block");
                        $lotteryBtn.css("display","none");
                    }

                    if(self.lotteryCount < 10 && self.lotteryCount != 0){
                        $lotteryTips.html("<p>请单击拆开</p><p>您选择的钱袋</p>");
                    }else if(self.lotteryCount == 0){
                        $lotteryTips.html("<p>您可以通过投资</p><p>获取抽奖机会</p>");
                    }
                });
            }
    

    
            self.getAwardsList(function (awardsLists) {

                if (awardsLists.length > 0) {

                    $("#singlesday_lottery_awards_ul1").html(juicer(awardsListTmpl, { awardsLists: awardsLists }));



                    if (awardsLists.length > 5) {
                        self.awardsListsScroll(awardsLists.length);
                    }

                } else {
                    $("#singlesday_lottery_awards").html(juicer(noDateTmpl, {nullStr : self.nullStr}));
                }

            });
            self.awardsShow();
            self.awardsGiftScroll();
            self.renderAward();
    
            self.bindEvent();
    
    
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
        bindEvent : function () {
            var self = this,
                $lotteryLi = $(".singlesday-lottery-li"),
                $lotteryBtn = $(".singlesday-lottery-btn");
            $(window).scroll(function() {
                var top = $(window).scrollTop(),
                    starTop = 1000;
                $lotteryLi.removeClass("choose");

                if( top > starTop && self.firstInit) {

                    self.lotteryRoll();
                }
            });


            var count = 0, timer = null;
            var oldTop = $(window).scrollTop(),newTop = oldTop;
            function windowScroll(){
                self.isWindowScroll = true;
                if(timer) clearTimeout(timer);
                newTop = $(window).scrollTop();
                if(newTop === oldTop) {
                    clearTimeout(timer);
                    //已停止，写入业务代码
                    self.isWindowScroll = false;

                } else{
                    oldTop = newTop;
                    timer = setTimeout(windowScroll,100);
                }
            }
            $(window).on('touchmove',windowScroll);




            var scrollStartPos,scrollEndPos;
            
            
            $lotteryLi.on("touchstart",function (e) {
                var $this = $(this);

                if(!self.canLottery){
                    return false;
                }
                $lotteryLi.removeClass("choose");

                $this.addClass("choose");
            });
            $lotteryLi.on("touchmove",function (e) {
                if(self.isWindowScroll){
                    $lotteryLi.removeClass("choose");
                }
            });
            $lotteryLi.on("touchend",function (e) {

                if(self.isWindowScroll){
                    $lotteryLi.removeClass("choose");
                    return false;
                }
                if(!self.access_token){
                    self.dialogShow({
                        type : 'message',
                        container : '<p>请先登录!</p>'
                    });
                    return false;
                }

                if(!self.canLottery){
                    return false;
                }

                self.canLottery = false;


                if(self.lotteryCount > 0){
                    self.getLottery(1,function () {
                        self.canLottery = true;
                    });
                }else{
                    self.dialogShow({
                        type : 'message',
                        container : '<p>您还没有抽奖机会哦~</p><p>快去投资赢取抽奖机会吧!</p>'
                    });
                }
    
            });


            $lotteryBtn.on("touchstart",function (event) {
                var $this = $(this);

                if(!self.access_token){
                    self.dialogShow({
                        type : 'message',
                        container : '<p>请先登录!</p>'
                    });
                    return false;
                }

                if(!self.canLottery){
                    return false;
                }
                $this.addClass("press");
    

            });

            $lotteryBtn.on("touchend",function () {
                var $this = $(this);

                $this.removeClass("press");

                if(self.isWindowScroll){
                    return false;
                }

                if(!self.access_token){
                    self.dialogShow({
                        type : 'message',
                        container : '<p>请先登录!</p>'

                    });
                    return false;
                }

                if(!self.canLottery){
                    return false;
                }

                self.canLottery = false;

                self.getLottery(10,function () {
                    self.canLottery = true;
                });

            });


            $(".singlesday-dialog").on("click",".singlesday-dialog-btn",function () {
    
                self.dialogClose();

    
            });
    
    
        },
        awardsShow : function () {
            var self = this,
                awardsIndex = 0;


            var awardsTimer = setInterval(function () {


                var awardsLiTimer = setInterval(function () {

                    if(awardsIndex < 3){
                        awardsIndex++;
                        var $awardsLi = $(".singlesday-award-li.li"+awardsIndex),
                            $awardsLiFront = $awardsLi.find(".singlesday-award-li-front"),
                            $awardsLiBack = $awardsLi.find(".singlesday-award-li-back");
                        if($awardsLi.hasClass("front")){
                            $awardsLi.removeClass("front").addClass("back");
                            $awardsLiFront.hide();
                            $awardsLiBack.show().addClass("flipInY animated");
                        }else{
                            $awardsLi.removeClass("back").addClass("front");
                            $awardsLiBack.hide();
                            $awardsLiFront.show().addClass("flipInY animated");
                        }
                    }else{
                        clearInterval(awardsLiTimer);
                        awardsIndex = 0;

                        $(".singlesday-award-li-front").removeClass("flipInY animated");
                        $(".singlesday-award-li-back").removeClass("flipInY animated");
                    }

                },500);

                
            },3000);
        },
        lotteryRoll : function () {
            var self = this,
                lotteryCount = $(".singlesday-lottery-li").length,
                times = 2,
                startIndex = 1;
    
            self.firstInit = false;
    
            $(".singlesday-lottery-li.li1").addClass("choose");
    
            var lotteryTimer = setInterval(function () {
    
                $(".singlesday-lottery-li.li"+startIndex).removeClass("choose");
    
                startIndex ++;
    
                if(startIndex > lotteryCount){
                    startIndex = 1;
                    times --;
                }
    
                if(times == 0){
                    clearInterval(lotteryTimer);
                }else{
                    $(".singlesday-lottery-li.li"+startIndex).addClass("choose");
    
                }
    
            },50);
    
        },
        awardsGiftScroll: function () {
            var self = this,
                awardsGiftCount = $(".singlesday-lottery-gift").length;

            function Marquee() {
                var startIndex = Number($(".singlesday-lottery-gift.active").data("indexnum"));

                $(".singlesday-lottery-gift").removeClass("animated fadeOutUp fadeInUp")

                $(".singlesday-lottery-gift.gift"+startIndex).addClass("animated fadeOutUp");



                var setTimer = setTimeout(function () {

                    $(".singlesday-lottery-index").removeClass("active");

                    $(".singlesday-lottery-gift.gift"+startIndex).removeClass("active").hide();


                    startIndex ++;

                    if(startIndex > awardsGiftCount){
                        startIndex = 1;
                    }

                    $(".singlesday-lottery-gift.gift"+startIndex).show().addClass("animated fadeInUp active");
                    $(".singlesday-lottery-index.index"+startIndex).addClass("active");

                    clearTimeout(setTimer)

                },800);






            };

            var awardsGiftTimer = setInterval(Marquee, 3000);
            
    
        },
        awardsListsScroll: function (listNum) {
            var speed = 65,
                wap = document.getElementById("singlesday_lottery_awards"),
                ul1 = document.getElementById("singlesday_lottery_awards_ul1"),
                ul2 = document.getElementById("singlesday_lottery_awards_ul2");





            ul2.innerHTML = ul1.innerHTML;



            var leftHeight,
                $awardsList = $(".singlesday-lottery-awards-li"),
                listLength = $awardsList.length,
                times = 0,
                listIndex = 0;



            if (listNum > 4) {
                leftHeight = 0;
            } else if (listNum == 4) {
                leftHeight = 30;
            }

            function Marquee2() {
                

                if (ul2.offsetTop - wap.offsetTop - wap.scrollTop <= leftHeight) {
                    wap.scrollTop -= ul1.offsetHeight;
                } else {
                    wap.scrollTop++;
                }
            }
    
            var MyMar2 = setInterval(Marquee2, speed);

            var touchWap = false;
            wap.ontouchstart = function () {
                touchWap = true;
                clearInterval(MyMar2);
            };
            wap.ontouchmove = function () {
                if(touchWap){
                    MyMar2 = setInterval(Marquee2, speed);
                    touchWap = false;
                }
            };
    
        },
        getAwardsList: function (callBack) {
            var self = this;

            // var res = {"code":200,"systemTime":1477898856440,"data":[
            //     {"id":15062.0,"activityId":10004.0,"userId":58.0,"userName":"3**3","getSource":"双11活动","type":3.0,"prizeName":"双11活动提现券","createTime":"Oct 31, 2016 12:58:22 PM","prizeType":0.0},
            //     {"id":15061.0,"activityId":10004.0,"userId":58.0,"userName":"3**3","getSource":"双11活动","type":0.0,"prizeName":"谢谢参与","createTime":"Oct 28, 2016 6:36:59 PM","prizeType":0.0},
            //     {"id":15060.0,"activityId":10004.0,"userId":58.0,"userName":"3**3","getSource":"双11活动","type":0.0,"prizeName":"谢谢参与","createTime":"Oct 28, 2016 6:36:33 PM","prizeType":0.0},
            //     {"id":15059.0,"activityId":10004.0,"userId":58.0,"userName":"3**3","getSource":"双11活动","type":3.0,"prizeName":"双11活动提现券","createTime":"Oct 28, 2016 6:36:28 PM","prizeType":0.0},
            //     {"id":15056.0,"activityId":10004.0,"userId":58.0,"userName":"3**3","getSource":"双11活动","type":3.0,"prizeName":"双11活动提现券","createTime":"Oct 28, 2016 6:34:53 PM","prizeType":0.0},
            //     {"id":15057.0,"activityId":10004.0,"userId":58.0,"userName":"3**3","getSource":"双11活动抽奖","type":3.0,"prizeName":"双11活动50元红包","createTime":"Oct 28, 2016 6:34:53 PM","prizeType":0.0},
            //     {"id":15058.0,"activityId":10004.0,"userId":58.0,"userName":"3**3","getSource":"双11活动","type":3.0,"prizeName":"双11活动提现券","createTime":"Oct 28, 2016 6:34:53 PM","prizeType":0.0}
            //     ]
            // }
            //
            // if (callBack && $.isFunction(callBack)) {
            //     callBack(res.data);
            //     return false;
            // }

            $.ajax({
                url: "/v2/activity_1212/winners",
                type: "GET",
                data: {},
                success: function (res) {
                    if (res.code == 200) {
                        if (callBack && $.isFunction(callBack)) {
                            callBack(res.data);
                        }
                    } else {
                        self.dialogShow({
                            type : 'message',
                            container : '<p>'+res.message+'</p>'
                        });
                    }

                },
                error : function (res) {
                    self.dialogShow({
                        type : 'message',
                        container : '<p>'+res.message+'</p>'
                    });
                }
            });
        },
        renderAward : function () {
            var self = this;

            var awardData = {
                fir : {
                    userName : "",
                    yearAmountSum : "",
                    investAmountSum : ""
                },
                sec : {
                    userName : "",
                    yearAmountSum : "",
                    investAmountSum : ""
                },
                thir : {
                    userName : "",
                    yearAmountSum : "",
                    investAmountSum : ""
                }
            }

            $.ajax({
                url: "/v2/activity_1212/userInvestTop",
                type: "GET",
                data: {},
                success: function (res) {
                    if (res.code == 200) {
                        if(res.data.length > 0){                            
                            $(".singlesday-award-li-name.name1").html(res.data[0].userName);
                            $(".singlesday-award-li-amount.amount1").html('累计年化投资额 ￥<span class="helvetica">' + res.data[0].yearAmountSum + '</span>');
                        }
                        if(res.data.length > 1){
                            $(".singlesday-award-li-name.name2").html(res.data[1].userName);
                            $(".singlesday-award-li-amount.amount2").html('累计年化投资额 ￥<span class="helvetica">' + res.data[1].yearAmountSum + '</span>');
                        }
                        if(res.data.length > 2){
                            $(".singlesday-award-li-name.name3").html(res.data[2].userName);
                            $(".singlesday-award-li-amount.amount3").html('累计年化投资额 ￥<span class="helvetica">' + res.data[2].yearAmountSum + '</span>');
                        }

                    } else {
                        self.dialogShow({
                            type : 'message',
                            container : '<p>'+res.message+'</p>'
                        });
                    }



                },
                error : function (res) {
                    self.dialogShow({
                        type : 'message',
                        container : '<p>'+res.message+'</p>'
                    });
                }
            });
    
        },
        getLottery : function (chanceCount,callBack) {
            var self = this;

            $.ajax({
                url: "/v2/activity_1212/luckyDraw?chanceCount="+chanceCount+"&token="+self.access_token,
                type: "GET",
                data: {},
                success: function (res) {
                    if (res.code == 200) {
                        if(res.data && ( res.data.luckyCount || res.data.luckyCount == 0 )){
                            self.lotteryCount = Number(res.data.luckyCount);
                            $(".singlesday-lottery-times").html(self.lotteryCount);
                        }
                        
                        if(res.data && res.data.list){
                            self.dialogShow({
                                type : 'gift',
                                giftList : res.data.list
                            });
                            if (callBack && $.isFunction(callBack)) {
                                callBack();
                            }
                        }else{
                            self.dialogShow({
                                type : 'message',
                                container : '<p>'+res.message+'</p>'
                            });
                        }

                        
                    }else if(res.code == 201){

                        if(res.data && ( res.data.luckyCount || res.data.luckyCount == 0 ) ){
                            self.lotteryCount = Number(res.data.luckyCount);
                            $(".singlesday-lottery-times").html(self.lotteryCount);

                        }
                        
                        self.dialogShow({
                            type : 'message',
                            container : '<p>很遗憾</p><p>您与奖品擦肩而过 TAT...</p>'
                        });

                    }else {
                        self.dialogShow({
                            type : 'message',
                            container : '<p>'+res.message+'</p>'
                        });
                    }



                    var $lotteryTips = $(".singlesday-lottery-tips"),
                        $lotteryBtn = $(".singlesday-lottery-btn");

                    if(self.lotteryCount > 9){
                        $lotteryTips.css("display","none");
                        $lotteryBtn.css("display","inline-block");
                    }else{
                        $lotteryTips.css("display","inline-block");
                        $lotteryBtn.css("display","none");
                    }

                    if(self.lotteryCount < 10 && self.lotteryCount != 0){
                        $lotteryTips.html("<p>请单击拆开</p><p>您选择的钱袋</p>");
                    }else if(self.lotteryCount == 0){
                        $lotteryTips.html("<p>您可以通过投资</p><p>获取抽奖机会</p>");
                    }


                    self.canLottery = true;



                },
                error : function (res) {
                    self.dialogShow({
                        type : 'message',
                        container : '<p>服务器傲娇了!</p>'
                    });
                    self.canLottery = true;

                }
            });
    
    
    
    
    
        },
        getTimes : function (callBack) {
            var self = this;
    
            if(!self.access_token){
                self.dialogShow({
                    type : 'message',
                    container : '<p>请先登录!</p>'

                });
                return false;
            }
            $.ajax({
                url: "/v2/activity_1212/luckyDrawChanceCount?token="+self.access_token,
                type: "GET",
                data: {},
                success: function (res) {
                    if (res.code == 200) {
                        self.lotteryCount = Number(res.data);

                        if (callBack && $.isFunction(callBack)) {
                            callBack();
                        }
                    } else if(res.code == 400){

                        if(res.data == 0){
                            self.lotteryCount = 0;

                            if (callBack && $.isFunction(callBack)) {
                                callBack();
                            }

                        }else{
                            self.dialogShow({
                                type : 'message',
                                container : '<p>'+res.message+'</p>'
                            });
                        }

                    }


                },
                error : function (res) {
                    self.dialogShow({
                        type : 'message',
                        container : '<p>服务器傲娇了!</p>'
                    });
                }
            });
    
        },
        dialogShow : function (opts) {
            var $dialog = $(".singlesday-dialog");

            $dialog.show();

            $dialog.html(juicer(dialogConTmpl,opts));
    
            L.showMask();
            L.setPosition($(".singlesday-dialog"));
    
        },
        dialogClose : function () {
            var self = this, $dialog = $(".singlesday-dialog");
            
            $dialog.hide();
            
            $dialog.html("");
    
            L.hideMask();
            self.canLottery = true;


            $(".singlesday-lottery-li").removeClass("choose");
        }
    
    });
    new SinglesDay();

