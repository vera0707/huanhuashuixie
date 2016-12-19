/**
 * Created by zhangliyuan on 16/6/16.
 */
/**
 * Created by zhangliyuan on 16/6/15.
 */
require("../../styles/ticket/list.css");

var $ = require("jquery");
var juicer = require('juicer');

var L = require('../core/core.js');

L.dialog = require('../core/dialog.js');
$(function(){

        function getTime(time) {
            var timeNew = new Date(time),
                timeNewY = timeNew.getFullYear(),
                timeNewM = timeNew.getMonth() + 1,
                timeNewD = timeNew.getDate();
            if( timeNewM < 10 ){
                timeNewM = "0" + timeNewM;
            }
            if( timeNewD < 10 ){
                timeNewD = "0" + timeNewD;
            }
            var timeStr = timeNewY + '.' + timeNewM + '.' + timeNewD;

            return timeStr;
        }

        var tiketList = [
            '{@each lists as li,index}',
                '<div class="f-l w50">',
                    '<div class="ticket-li ${li.type,li.status,navType|getListClassName}" {@if navType == "jiaxi"} data-type=${li.type} data-rate=${li.label|getLabel} {@else} data-redid="${li.id}"{@/if}>',
                        '<div class="ticket-li-money">',
                            '{@if navType == "jiaxi"}',
                                '{@if li.type == 1}',
                                    '<span class="ticket-li-num">${li.label}</span>',
                                '{@else if li.type == 2}',
                                    '<span class="ticket-li-add">+</span>',
                                    '<span class="ticket-li-num">${li.label|getLabel}%</span>',
                                '{@else if li.type == 3}',
                                    '<span class="ticket-li-num">${li.label|getTiyanjinAmount}</span>',
                                '{@/if}',
                            '{@else}',
                                '<span>￥</span>',
                                '<span class="ticket-li-num">${li.rewardAmount|getNum}</span>',
                            '{@/if}',
                        '</div>',
                        '{@if navType == "jiaxi"}',
                            '<div class="ticket-li-name">${li.note}</div>',
                            '<div class="ticket-li-info">$${li.summary,li.status|getInfo}</div>',
                        '{@else if navType == "redbag"}',
                            '{@if li.type == 0}',
                                '<div class="ticket-li-name">${li.rewardName}</div>',                            
                            '{@/if}',
                        '{@/if}',
                        // '<div class="ticket-li-tip">即将可用</div>',
                        '<div class="ticket-li-time">',
                            '{@if navType == "jiaxi"}',
                                '$${navType,li.status,li.expirTime,li.useTime|getTimeTxt}',
                            '{@else}',
                                '$${navType,li.type,li.endTime,li.useTime|getTimeTxt}',
                            '{@/if}',
                        '</div>',
                        '{@if navType == "redbag" && li.type == 0}',
                            '<div class="ticket-li-rate">${li.rewardRate,li.fullAmount|getRedBagTxt}</div>',
                        '{@/if}',
                    '</div>',
                '</div>',
            '{@/each}'
        ].join("");

        var listNull = [
            '<div class="ticket-null">',
                '{@if navType == "jiaxi"}',
                    '<div class="ticket-li jiaxi-null">',
                        '<div class="ticket-li-money">',
                        '<span class="ticket-li-num">TAT...</span>',
                    '</div>',
                '{@else}',
                    '<div class="ticket-li redbag-null"></div>',
                '{@/if}',
                '</div>',
                '<div class="ticket-null-txt">',
                    '<div>$${type,navType|getNullTxt}</div>',
                    '{@if type == 0}',
                        '<div>请及时关注官方的活动吧</div>',
                    '{@/if}',
                '</div>',
            '</div>'
        ].join("");
        juicer.register("getNullTxt",function(type,navType){
            var txt = "";
            if(navType ==  "jiaxi"){
                if(type == 0){
                    txt = "您还没有可用的优惠券";

                }else{
                    txt = "您还没有已失效的优惠券";
                }
            }else{
                if(type == 0){
                    txt = "您还没有可用的红包";
                }else{
                    txt = "您还没有已失效的红包";
                }

            }

            return txt;
        });

        juicer.register("getNum",function(num){
            if(parseInt(Number(num)) ==  num){
                return parseInt(Number(num));
            }else{
                return Number(num);

            }
        });
        juicer.register("getRedBagTxt",function(rate,fullAmount){
            if(!!fullAmount && fullAmount > 0){
                return "满"+fullAmount+"元使用";
            }else{
                var rateN = Number(rate)*100;
                return "抵扣" +rateN+ "%";
            }
        });
        juicer.register("getRate",function(rate){
            return Number(rate)*100;
        });
        juicer.register("getLabel",function(label){
            return Number(label)*100;
        });
        juicer.register("getTiyanjinAmount",function(label){
            var tiyanjinAmount = Number(label),tiyanjinAmountStr;

            if( Number(label) >= 10000){
                tiyanjinAmount = ( Number(label)/10000);
                tiyanjinAmountStr = tiyanjinAmount + "万元";
            }else{
                tiyanjinAmount = Number(label);
                tiyanjinAmountStr = tiyanjinAmount + "元";
            }

            return tiyanjinAmountStr;

        });



        juicer.register("getListClassName",function (type,status,navType) {
            var className = navType + "-li "+navType, ticketStatus;

            if(navType == "jiaxi"){
                if(type == 1){
                    className = "tixian-li tixian";
                }else if(type == 3){
                    className = "tiyanjin-li tiyanjin";
                }
                ticketStatus = status;
            }else{
                ticketStatus = type;
            }

            switch(ticketStatus) {
                case 0:
                    className += "";//0未使用
                    break;
                case 1:
                    className += "-used";//1已使用
                    break;
                case 2:
                    className += "-passed";//2已过期
                    break;
                case 3:
                    className += "-passed";//3已失效
                    break;
                default:
                    className += "";
            }




            return className;


        });


        juicer.register("getTimeTxt",function (navType,type,endTime,useTime) {

            var useTimeStr = getTime(useTime), endTimeStr = getTime(endTime), returnTime = "";

            if(navType == "jiaxi"){
                switch(type) {
                    case 0:
                        returnTime = "有效期至"+endTimeStr;//0未使用
                        break;
                    case 1:
                        returnTime = "使用时间:"+useTimeStr;//1已使用
                        break;
                    case 2:
                        returnTime = "过期时间:"+endTimeStr;//2已过期
                        break;
                    default:
                        returnTime = "有效期至"+endTimeStr;
                }
            }else{
                switch(type) {
                    case 0:
                        returnTime = "有效期至"+endTimeStr;//0未使用
                        break;
                    case 1:
                        returnTime = "使用时间:"+useTimeStr;//1已使用
                        break;
                    case 2:
                        returnTime = "过期时间:"+endTimeStr;//2已过期
                        break;
                    case 3:
                        returnTime = "失效时间:"+endTimeStr;//3已失效
                        break;
                    default:
                        returnTime = "有效期至"+endTimeStr;
                }
            }


            return returnTime;

        });

        juicer.register("getInfo",function (summary,status) {

            var info = "";

            switch(status) {
                case 0:
                    info = summary;//0未使用
                    break;
                case 1:
                    info = "已使用";//1已使用
                    break;
                case 2:
                    info = "已过期";//2已过期
                    break;
                default:
                    info = summary;
            }

            return info;

        });






        function Ticket() {
            this.navType = "jiaxi";
            this.canGetList = true;
            this.type = 0;
            this.init();
        }
        $.extend(Ticket.prototype,{
            init : function () {
                var self = this, paramType = self.getUrlParameter("status");


                self.ticketData = {
                    jiaxi0 : {//0是有效 1是无效 2是已过期
                        list : [],
                        firstGet : true,
                        page : 0
                    },
                    jiaxi1 : {//0是有效 1是无效 2是已过期
                        list : [],
                        firstGet : true,
                        page : 0
                    },
                    redbag0 : {//0有效 1使用 2过期 3失效
                        list : [],
                        firstGet : true,
                        page : 0
                    },
                    redbag3 : {//0有效 1使用 2过期 3失效
                        list : [],
                        firstGet : true,
                        page : 0
                    }
                }


                self.access_token = self.getUrlParameter("access_token");


                if( paramType && paramType == 1 ){
                    self.type = 1;
                    
                }


                if(self.canGetList == true){
                    if(show_type == 'red'){
                        self.navType = "redbag";
                    }
                    self.getTicketList();//获取列表
                }
                //self.renderTicketList();
                self.bindEvent();
            },
            getUrlParameter : function (sParam) {

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
                var self = this;
                $(".ticket-nav-item").on("click",function () {

                    var $this = $(this),
                        $par = $this.parents(".ticket-nav-li"),
                        navType = $par.data("navtype"),
                        $navItems = $(".ticket-nav-item"),
                        $RedBag = $(".ticket-redbag"),
                        $jiaxi = $(".ticket-jiaxi");

                    if($this.hasClass("active")){
                        return false;
                    }

                    self.navType = navType;


                    $navItems.removeClass("active");
                    $this.addClass("active");

                    if(navType == "redbag"){

                        if(self.type == 1){
                            self.type = 3;
                        }

                        $jiaxi.hide();
                        $RedBag.show();

                    }else{

                        if(self.type == 3){
                            self.type = 1;
                        }

                        $RedBag.hide();
                        $jiaxi.show();
                    }

                    if(self.ticketData[self.navType + self.type].list.length == 0){

                        self.getTicketList();//获取列表
                        if(navType == "redbag" && self.type != 3){
                            self.getRedBagSum();
                        }

                    }


                });

                $(".ticket-more").on("click",function () {

                    if(self.canGetList == false){
                        return false;
                    }

                    self.getTicketList();


                });





            },
            getTicketList :function () {
                var self = this, url;

                $(".ticket-more").hide();


                self.canGetList = false;

                self.ticketData[self.navType + self.type].page++;


                if(self.navType == "jiaxi"){

                    url="/v2/user/couponPackage/coupon?access_token=" + self.access_token
                        + "&page=" + self.ticketData[self.navType + self.type].page;//优惠券列表

                    if(self.type == 1){
                        url += "&status=1,2";
                    }else{
                        url += "&status=0";
                    }
                }else {
                    url = "/v2/user/couponPackage/red?access_token=" + self.access_token
                        + "&type=" + self.type
                        + "&page=" + self.ticketData[self.navType + self.type].page;//红包列表
                }


                $.ajax({
                    url:url,
                    type:"GET",
                    data : {},
                    success : function (res) {
                        self.canGetList = true;
                        // var res = {
                        //     code : 200,
                        //     data : {
                        //         page : []
                        //     }
                        // }

                        if( res.code == 200 ){
                            self.ticketData[self.navType + self.type].firstGet = false;

                            var renderArr = [], $more = $(".ticket-"+ self.navType +" .ticket-more");


                            if(res.data && res.data.length > 0){
                                renderArr = res.data;
                                self.ticketData[self.navType + self.type].list = self.ticketData[self.navType + self.type].list.concat(renderArr);
                                self.renderTicketList(renderArr);
                                if(res.data.length >= 20 ){
                                    $more.css("display","block");
                                }

                            }else{

                                if(self.ticketData[self.navType + self.type].page == 1){
                                    if(self.navType == "jiaxi"){
                                        $(".ticket-jiaxi-con").html(juicer(listNull,{type : self.type,navType:self.navType}));

                                    }else{

                                        $(".ticket-redbag-con").html(juicer(listNull,{type :self.type,navType:self.navType}));

                                    }
                                }
                            }

                        }else{

                        }
                    },
                    error : function (res) {
                        self.canGetList = true;

                    }
                });

            },
            renderTicketList : function (renderData) {
                var self = this;

                if(self.navType == "redbag"){
                    $.each(renderData,function (k,v) {
                        var todayTime = new Date().getTime()

                        if(v.isHasUse == 0){
                            if(v.endTime > todayTime){
                                v.type = 0;
                            }else{
                                v.type = 2;
                            }
                        }else{
                            if(v.useTime && v.useTime <= todayTime){
                                v.type = 1;
                            }else{
                                v.type = 3;
                            }
                        }
                    });
                }


                if(self.navType == "jiaxi"){

                    $(".ticket-jiaxi-con").append(juicer(tiketList,{lists : renderData,navType:self.navType}));

                }else{

                    $(".ticket-redbag-con").append(juicer(tiketList,{lists : renderData,navType:self.navType}));

                }


                $(".jiaxi-li").off().on("click",function () {
                    var $this = $(this),type = $this.data("type"),rate = $this.data("rate");
                    location.href = "/v2/user/couponPackage/coupon/describe?access_token="+self.access_token+"&type="+type+"&rate="+rate;
                });
                $(".redbag-li").off().on("click",function () {
                    var $this = $(this),redId = $this.data("redid");
                    location.href = "/v2/user/couponPackage/red/describe?access_token="+self.access_token+"&redId="+redId;
                });
                $(".tiyanjin-li").off().on("click",function () {
                    location.href = "/v2/testBorrows/describe?access_token="+self.access_token;
                });



            },
            getRedBagSum : function () {

                var self = this;

                $.ajax({
                    url: "/v2/user/couponPackage/red/amount?access_token=" + self.access_token,
                    type: "GET",
                    data: {},
                    success: function (res) {

                        if(res.code == 200 && res.data > 0){
                            $(".redbag-sum-con").html("红包总金额"+res.data+"元").css("display","block");
                            $(".redbag-sum").css("display","block");

                        }

                    },
                    error: function (res) {


                    }
                })

            }

        });


        new Ticket();




    });
