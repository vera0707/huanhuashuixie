(function($) {
    $(function() {
        function DealBankCard(user, callback) {
            this.userName = user||"";
            this.callback = callback||""
            this.bankData = false;
            this.proData = false;
            this.cityData = false;
            this.init();
        }
        $.extend(DealBankCard.prototype, {
            init: function() {
                this.bankAjax();
                this.proAjax();
                this.cityAjax();

            },
            render: function() {
                    var self = this;
                    var dataObj = {
                        userName : self.userName,
                        bank: self.bankData,
                        pro: self.proData,
                        city: self.cityData
                    }
                    var content = [
                        '<div class="bank-con">',
                            '<p class="bank-item clearfloat"><span class="inline-block bank-td bank-td1"><span class="red-star">*</span>开户名</span><span class="inline-block bank-td bank-td2">${userName}</span></p>',
                            '<p class="bank-item clearfloat"><span class="inline-block bank-td bank-td1"><span class="red-star">*</span>请选择银行</span>',
                                '<select class="inline-block bank-td bank-td2 bank-select">',
                                    '<option>请选择</option>',
                                    '{@each bank as li}',
                                        '<option value="${li.bankname}-${li.bankid}">${li.bankname}</option>',
                                    '{@/each}',
                                '</select>',
                            '</p>',
                            '<p class="bank-item clearfloat"><span class="inline-block bank-td bank-td1"><span class="red-star">*</span>开户行所在地</span>',
                                '<select class="inline-block bank-td bank-td2 bank-td3 pro-select">',
                                    '<option>请选择</option>',
                                    '{@each pro as li}',
                                        '<option value="${li.id}-${li.cityname}">${li.cityname}</option>',
                                    '{@/each}',
                                '</select>',
                                '<select class="inline-block bank-td bank-td2 bank-td3 city-select">',
                                    '<option>请选择</option>',
                                    '{@each city as li}',
                                        '<option value="${li.id}-${li.cityname}">${li.cityname}</option>',
                                    '{@/each}',
                                '</select>',
                            '</p>',
                            /*'<p class="bank-item clearfloat">',
                                '<span class="inline-block bank-td bank-td1">',
                                '<span class="red-star">*</span>开户行</span>',
                                '<span class="inline-block bank-td bank-td2">',
                                    '<input type="text" class="bank-place-input"/><a class="newbtn newbtn-1  search-btn">搜索</a>',
                                '</span>',
                                '<span class="inline-block bank-td place-ul">',
                                    '<span class="inline-block place-li"></span>',
                                '</span>',
                            '</p>',*/
                            '<p class="bank-item clearfloat"><span class="inline-block bank-td bank-td1"><span class="red-star">*</span>银行卡号</span><span class="inline-block bank-td bank-td2"><input type="text" class="bankCard bankCard-one"/></span></p>',
                            '<p class="bank-item clearfloat"><span class="inline-block bank-td bank-td1"><span class="red-star">*</span>确认卡号</span><span class="inline-block bank-td bank-td2"><input type="text" class="bankCard bankCard-again"/></span></p>',
                        '</div>'
                    ].join("");

                var html = juicer(content, dataObj);


                window.dialog({
                   title:"添加银行卡",
                   content:html,
                   buttons:{
                       "确定":function() {
                        var bankName = self.getBankVal(false),
                            bankId = self.getBankVal(true),
                            cardUserName = self.userName,
                            //bankBranchName = $(".bank-place-input").val(),
                            //bankAddress = $(".bank-place-input").data("bankAddress"),
                            bankProvince = $(".pro-select").val().split("-")[1],
                            bankCity = $(".city-select").val().split("-")[1],
                            cardNo = $(".bankCard-one").val(),
                            confirmCardNo = $(".bankCard-again").val();


                           if(self.checkAddBankCardInfo(bankName, bankProvince, bankCity, cardNo, confirmCardNo,cardUserName )){
                                var param={};
                                param['paramMap.bankId'] = bankId;
                                param['paramMap.bankName'] = bankName;
                                //param['paramMap.bankAddress'] = bankAddress;
                                //param['paramMap.bankBranchName'] = bankBranchName;
                                param['paramMap.cardNo'] = cardNo;
                                param['paramMap.confirmCardNo'] = confirmCardNo;
                                param['paramMap.cardUserName'] = cardUserName;
                                param['paramMap.bankProvince'] = bankProvince;
                                param['paramMap.bankCity'] = bankCity;
                                param['paramMap.verifyCode'] = window.verifyCode;
                                param['paramMap.idNo'] = window.idNo;
                                var ajaxUrl ="/addBankInfo.do";
                                var qsData =param;
                                var str = "";
                                $.each(param, function(i, item) {
                                    str += (i+"="+item) + "&";
                                });

                                var str = str.slice(0, -1);
                                $.ajax({
                                    url: "/addBankInfo.do",
                                    type:"POST",
                                    data: str,
                                    success: function(data) {
                                        if( self.callback ) {
                                            self.callback(data);
                                        }
                                    }
                                })
                           }
                       },
                       "取消":function() {}
                   }
                });

                self.bindEvent();
            },
            checkAddBankCardInfo: function(bankName, bankProvince, bankCity,cardNo, confirmCardNo, cardUserName )  {
                if(bankName == ""){
                    L.showTopTips("请选择银行");
                    return false;
                }

                if(bankProvince ==""){
                    L.showTopTips("请选择开户行所在省");
                    return false;
                }
                if(bankCity ==""){
                    L.showTopTips("请选择开户行所在市");
                    return false;
                }
                /*if(bankAddress ==""){
                    L.showTopTips("输入开户行地址");
                    return false;
                }
                if(bankBranchName ==""){
                    L.showTopTips("输入输入您的开户支行");
                    return false;
                }*/

                if(cardNo ==""){
                    L.showTopTips("输入输入您的银行卡号");
                    return false;
                }
                if(cardNo != confirmCardNo){
                    L.showTopTips("银行卡号和确认银行卡号不一致");
                    return false;
                }
                return true;

            },
            bindEvent: function() {
                var self = this;
                $("html, body").click(function() {
                    $(".place-ul").hide();
                });

                $(".search-btn").click(function() {
                    $(".bank-place-input").focus();
                });

                $(".bank-place-input").focus(function() {
                    var bankId = self.getBankVal(true),
                    cityId = self.getCityVal();
                    var $ul = $(".place-ul");

                    if( bankId == "" ) {
                        L.showTopTips("warning","请选择银行");
                        return false;
                    }

                    if( cityId == "" ) {
                        L.showTopTips("warning","请选择所在地");
                        return false;
                    }

                    var keyWord = $(".bank-place-input").val();

                    self.searchBank(bankId,cityId, keyWord,function(data) {
                        var searchTmpl = [
                            '{@if leng > 0}',
                                '{@each searchlist as li}',
                                    '<span class="inline-block place-li" data-bankBranchName="${li.bankBranchName}" data-bankid="${li.bankid}" data-addr="${li.addr}">${li.bankBranchName}</span>',
                                '{@/each}',
                            '{@else}',
                                '<span class="inline-block place-li" data-bankBranchName="no">该区域无此银行</span>',
                            '{@/if}'
                        ].join("");

                        $ul.html(juicer(searchTmpl, {searchlist: data, leng: data.length}));
                        $ul.show();

                        $(".place-li").unbind("click").click(function(e) {
                            if( $(this).data("bankbranchname") != "no" ) {
                                $(".bank-place-input").val( $(this).data("bankbranchname") );
                                $(".bank-place-input").data("bankbranchname", $(this).data("bankbranchname") );
                                $(".bank-place-input").data("bankAddress", $(this).data("addr") );
                            }

                            $ul.hide();
                            e.stopPropagation();
                        });
                    });



                });

                $(".pro-select").change(function() {
                    var id = self.getProVal();
                    self.cityAjax(id, function(data) {

                    var tmpl = [
                        '<option>请选择</option>',
                        '{@each data as li}',
                            '<option value="${li.id}-${li.cityname}">${li.cityname}</option>',
                        '{@/each}'
                    ].join("");

                    var html = juicer(tmpl, {data:data});
                        $(".city-select").html(html);
                    });
                })
            },
            getBankVal: function(flag) {
                var val = $(".bank-select").val();
                if( val == "请选择" ){
                    return "";
                } else {
                    if( flag ) {
                        return val.split("-")[1];
                    } else {
                        return val.split("-")[0];
                    }

                }
            },
            getProVal: function() {
                var val = $(".pro-select").val();
                if( val =="请选择" ) {
                    return "";
                } else {
                    return val.split("-")[0];
                }
            },
            getCityVal: function() {
                var val = $(".city-select").val();
                if( val =="请选择" ) {
                    return "";
                } else {
                    return val.split("-")[0];
                }
            },
            bankAjax: function() {
                var self = this;
                $.ajax({
                    url:"getBankList.do",
                    type:"GET",
                    data:"",
                    success: function(data) {
                        self.bankData = data;
                        if( self.bankData && self.cityData && self.proData ) {
                            self.render();
                            self.bindEvent();
                        }
                    }
                })
            },
            proAjax: function() {
                var self = this;
                $.ajax({
                    url:"getCityList.do",
                    type:"GET",
                    data:"",
                    success: function(data) {
                        self.proData = data;
                        if( self.bankData && self.cityData && self.proData ) {
                            self.render();
                            self.bindEvent();
                        }

                    }
                })
            },
            cityAjax: function(id, callback) {
                var self = this;
                $.ajax({
                    url:"getCityById.do",
                    type:"GET",
                    data:"parentid=" + (id||""),
                    success: function(data) {
                        self.cityData = data;
                        if( self.bankData && self.cityData && self.proData && !id) {
                            self.render();
                            self.bindEvent();
                        } else {
                            if( callback ) {
                                callback(data);
                            }
                        }

                    }
                })
            },
            searchBank: function(bankid, cityid,keyWord ,callback) {
                var self = this;
                $.ajax({
                    url:"getBankByCityIdAndBankId.do",
                    type:"GET",
                    data:"bankid="+ (bankid||"") +"&cityid=" + (cityid || "") + "&bankName=" + ( keyWord||""),
                    success: function(data) {
                        if(callback) {
                            callback(data);
                        }
                    }
                })
            }
        });


        $.extend(L, {
            bankDialogInit: function(user, callback) {
                var backInstance = new DealBankCard(user, callback);
            }
        })
    });
})(jQuery);