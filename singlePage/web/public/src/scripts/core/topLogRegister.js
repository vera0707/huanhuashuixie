(function() {
    $(function() {
        var logDialogTmpl = [
            '<div class="clearfloat pdt10">',
                '<span class="inline-block f-r fz12">还没有龙贷账号？<a class="operation-blue login-in-register" href="javascript:;">立即注册</a></span>',
            '</div>',
            '<div class="home-head-status-con" style="padding-top:0px;">',
                '<div class="home-erroTip clearfloat"><span class="f-l home-erroTip-text">手机号或者密码错误</span></div>',
                '<div class="home-head-status-border">',
                    '<input type="text" id="login_phone" value="${cellphone}"/>',
                    '<label class="home-head-status-label userLabel" for="login_phone">手机号</label>',
                '</div>',
                '<div class="home-head-status-border" >',
                    '<input type="password" id="login_password"/>',
                    '<label class="home-head-status-label pwdLabel" for="login_password">密码</label>',
                '</div>',
                '<div class="home-head-status-list clearfloat">',
                    '<a class="home-head-check {@if hasPhone} home-head-checked {@/if}" href="javascript:;"></a>',
                    '<span class="home-head-check-text">记住手机号</span>',
                    '<a class="home-head-link home-head-link1" href="/forgetLogPassword.do" target="_blank">忘记密码？</a>',
                '</div>',
            '</div>'
        ].join("");


        var regDialogTmpl = [
            '<div class="home-head-status-con home-head-status-con1" style="padding-top:0px;padding-bottom:20px;">',
                '<div class="home-erroTip"><span class="home-erroTip-text">手机号或者密码错误</span></div>',
                '<div class="home-head-status-border home-head-status-border2 ">',
                    '<input type="text" id="reg_phone"/>',
                    '<label class="home-head-status-label userLabel" for="reg_phone">手机号</label>',
                '</div>',
                '<div class="home-head-status-border home-head-status-border2">',
                    '<input type="password" id="reg_password"/>',
                    '<label class="home-head-status-label pwdLabel"  for="reg_password">密码</label>',
                '</div>',
                '<div class="home-head-status-border1 home-head-status-border2">',
                    '<input type="text" id="verification_code"/>',
                    '<label class="home-head-status-label codeLabel"for="verification_code">验证码</label>',
                    '<img class="verification-code" src="authCode?pageId=userregister" title="点击更换验证码" style="cursor: pointer;" id="codeNum" width="46" height="18"  />',
                '</div>',
                '<div class="home-head-status-list home-head-status-list1 clearfloat">',
                    '<a class="home-head-check home-head-checked" href="javascript:;"></a>',
                    '<span class="home-head-check-text">我已阅读并接受</span>',
                    '<a  class="home-head-link"href="/contract.do" target="_blank">龙贷服务协议</a>',
                '</div>',
                '<div class="home-head-status-list home-head-status-list1 clearfloat">',
                    '<a class="home-head-link2 register-btn">立即注册</a>',
                '</div>',
            '</div>'
        ].join("");


        function switchCode() {
            var timenow = new Date();
            $(".verification-code").attr("src","authCode?pageId=userregister&d="+timenow);
        }

        function doLogin() {
            var $err = $(".home-erroTip-text"),
                $user = $("#login_phone"),
                $userLabel = $(".userLabel"),
                $userPar = $user.parent(".home-head-status-border"),
                $pwd = $("#login_password"),
                $pwdLabel =$(".pwdLabel"),
                $pwdPar = $pwd.parent(".home-head-status-border");


                 if( $user.val() == "" ) {
                    $err.text("手机号不能为空").show();
                    return false;
                }
                if( $pwd.val() == "" ) {
                    $err.text("密码不能为空").show();
                    return false;
                }

                var rspd = "";
                if( $(".home-head-check").hasClass("home-head-checked") ) {
                    rspd = "1";
                } else {
                    rspd = "0";
                }
                var cellphone = $user.val(),
                    password = $pwd.val();
                $.ajax({
                    url:"ajaxLogin.do",
                    type:"POST",
                    data: "paramMap.cellphone=" + cellphone + "&paramMap.password=" + encodeURIComponent(password) + "&paramMap.rspd=" + encodeURIComponent(rspd),
                    success: function(data) {
                        var res = L.isToJson(data);
                        var result = res.data;
                        if(res.code == 200){
                            /* var  topHeadHtml =  ''+
                            '<span class="head-top-normal"></span>'+
                            '<a class="head-top-user">'+ result.user.userName +'</a>'+
                            '<a class="head-top-news" href="/news">消息</a>'+
                            '<a class="head-top-out" href="/logout.do">退出</a>';

                            $(".no-log-con").html(topHeadHtml);*/
                            if( window.backUrl ) {
                              location.href = window.backUrl;
                            } else {
                                if( result.needEncrypt == 1 ) {
                                    location.href = "https://" + location.href.split("//")[1];
                                } else {
                                    location.reload();
                                }
                            }


                        } else {
                            $err.text(res.message).show();
                            //L.showTopTips("error", res.message);
                            return false;
                        }

                    }
                });
        }

        function bindLogIn() {
            var self = this,
                    $err = $(".home-erroTip-text"),
                    $user = $("#login_phone"),
                    $userLabel = $(".userLabel"),
                    $userPar = $user.parent(".home-head-status-border"),
                    $pwd = $("#login_password"),
                    $pwdLabel =$(".pwdLabel"),
                    $pwdPar = $pwd.parent(".home-head-status-border");


                $(".home-head-check").click(function() {
                    if( $(this).hasClass("home-head-checked") ) {
                        $(this).removeClass("home-head-checked");
                    } else {
                        $(this).addClass("home-head-checked");
                    }
                });
                $user.focus(function() {
                    $userLabel.hide();
                    $userPar.addClass("home-head-status-border-checked");
                }).blur(function() {
                    if( $user.val() == "" ) {
                        $userLabel.show();
                        $userPar.removeClass("home-head-status-border-checked");
                        $err.text("手机号不能为空").show();
                    } else {

                        if( window.isMobile($user.val()) ) {
                            $.ajax({
                                url: "ajaxCheckLoginPhone.do",
                                type:"POST",
                                data:"paramMap.cellphone=" + $user.val(),
                                success: function(data) {
                                    var result = L.isToJson(data);
                                    if(result.code == "400") {
                                        //$user.val("");
                                        //$userLabel.show();
                                        $err.text("手机号不能为空").show();
                                    } else if( result.code == "401" ) {
                                       // $user.val("");
                                        //$userLabel.show();
                                        $err.text("手机号格式不对").show();
                                    }else if( result.code == "402" ) {
                                        //$user.val("");
                                        //$userLabel.show();
                                        $err.text("手机号不存在").show();
                                    } else if( result.code == "500" ) {
                                       // $user.val("");
                                        //$userLabel.show();
                                        $err.text("操作失败").show();
                                    } else if(result.code == "200" ) {
                                        $err.hide();
                                    }else{
                                        $err.text( result.message).show();
                                    }
                                    $userPar.css("border-color","#398E55");
                                },
                                error: function(data) {

                                }
                            });
                        } else {
                            //$user.val("");
                            //$userLabel.show();
                            $err.text("无效的手机号").show();
                        }
                        $userPar.removeClass("home-head-status-border-checked");
                        //$err.hide();
                    }

                });
                $pwd.focus(function() {
                    $pwdLabel.hide();
                    $pwdPar.addClass("home-head-status-border-checked");
                }).blur(function() {
                    if( $pwd.val() == "" ) {
                        $pwdLabel.show();
                        $pwdPar.removeClass("home-head-status-border-checked");
                        $err.text("密码不能为空").show();
                    } else {
                        if($pwd.val().length<6) {
                            $err.text("*密码长度为6-20个字符").show();
                        } else {
                        $pwdPar.removeClass("home-head-status-border-checked");
                          $err.hide();

                        }
                    }
                });
                $userLabel.click(function() {
                    $user.focus();
                });
                $pwdLabel.click(function() {
                    $pwd.focus();
                });

                /*function login() {
                    if( $user.val() == "" ) {
                        $err.text("手机号不能为空").show();
                        return false;
                    }
                    if( $pwd.val() == "" ) {
                        $err.text("密码不能为空").show();
                        return false;
                    }

                    var rspd = "";
                    if( $(".home-head-check").hasClass("home-head-checked") ) {
                        rspd = "1";
                    } else {
                        rspd = "0";
                    }
                    var cellphone = $user.val(),
                        password = $pwd.val();

                    $.ajax({
                        url:"ajaxLogin.do",
                        type:"POST",
                        data: "paramMap.cellphone=" + cellphone + "&paramMap.password=" + password + "&paramMap.rspd=" + rspd,
                        success: function(data) {
                            var result = L.isToJson(data).data;
                            var html = juicer(alLogTmpl,{ user: result.user.userName,url:result.user.personalHead, money:result.accountMap.usableSum });
                            $(".home-head-status").html(html);

                            var  topHeadHtml =  ''+
                            '<span class="head-top-normal"></span>'+
                            '<a class="head-top-user">'+ result.user.userName +'</a>'+
                            '<a class="head-top-news" href="/news">消息</a>'+
                            '<a class="head-top-out" href="/logout.do">退出</a>';

                            $(".no-log-con").html(topHeadHtml);
                            location.href="/home.do";
                        }
                    })
                }

                $("#login_btn").click(function() {
                    login();
                });

                $user.bind('keyup', function(event){
                if (event.keyCode=="13"){
                      login();
                   }
                });
                $pwd.bind('keyup', function(event){
                   if (event.keyCode=="13"){
                      login();
                   }
                });*/

        }


        function bindRegister() {
            var self = this,
                $err = $(".home-erroTip-text"),
                $user = $("#reg_phone"),
                $userLabel = $(".userLabel"),
                $userPar = $user.parent(".home-head-status-border"),
                $pwd = $("#reg_password"),
                $pwdLabel =$(".pwdLabel"),
                $code = $("#verification_code"),
                $codePar = $code.parent(".home-head-status-border1"),
                $codeLabel = $(".codeLabel"),
                $pwdPar = $pwd.parent(".home-head-status-border");

            $(".home-con-head-wait").click(function() {
                var url = $(this).data("url");

                window.open(url);
            });


            $(".home-head-check").click(function() {
                if( $(this).hasClass("home-head-checked") ) {
                    $(this).removeClass("home-head-checked");
                } else {
                    $(this).addClass("home-head-checked");
                }
            });


            $user.focus(function() {
                $userLabel.hide();
                $userPar.addClass("home-head-status-border-checked");
            }).blur(function() {
                if( $user.val() == "" ) {
                    $userLabel.show();
                    $userPar.removeClass("home-head-status-border-checked");
                    $err.text("手机号不能为空").show();
                } else {

                    if( window.isMobile($user.val()) ) {
                        $.ajax({
                            url: "ajaxCheckRegisterPhone.do",
                            type:"POST",
                            data:"paramMap.cellphone=" + $user.val(),
                            success: function(data) {
                                var result = L.isToJson(data);
                                if(result.code == "200" ) {
                                    $err.hide();
                                } else {
                                    $err.text(result.message).show();
                                }
                                /*if(result.code == "400") {
                                    $user.val("");
                                    $userLabel.show();
                                    $err.text(result.message).show();
                                } else if( result.code == "401" ) {
                                    $user.val("");
                                    $userLabel.show();
                                    $err.text("用户名格式不对").show();
                                }else if( result.code == "402" ) {
                                    $user.val("");
                                    $userLabel.show();
                                    $err.text("手机号已存在").show();
                                } else if( result.code == "500" ) {
                                    $user.val("");
                                    $userLabel.show();
                                    $err.text("操作失败").show();
                                } else if(result.code == "200" ) {
                                    $err.hide();
                                }  */
                            },
                            error: function(data) {

                            }
                        });
                    } else {
                        //$user.val("");
                        //$userLabel.show();
                        $err.text("手机号格式错误").show();
                    }
                    $userPar.removeClass("home-head-status-border-checked");
                    //$err.hide();
                }

            });
            $pwd.focus(function() {
                $pwdLabel.hide();
                $pwdPar.addClass("home-head-status-border-checked");
            }).blur(function() {
                if( $pwd.val() == "" ) {
                    $pwdLabel.show();
                    $pwdPar.removeClass("home-head-status-border-checked");
                    $err.text("密码不能为空").show();
                } else {
                    if($pwd.val().length<6 ||$pwd.val().length > 20) {
                        $err.text("*密码长度为6-20个字符").show();
                    } else {
                      $err.hide();
                      $pwdPar.removeClass("home-head-status-border-checked");
                    }
                }

            });
            $code.focus(function() {
                $codeLabel.hide();
                $codePar.addClass("home-head-status-border-checked");
            }).blur(function() {
                if( $code.val() == "" ) {
                    $codeLabel.show();
                    $codePar.removeClass("home-head-status-border-checked");
                    $err.text("验证码不能为空").show();
                } else {
                    //if( $code.val().length < 4 || $code.val().length > 4 ) {
                    //    $codePar.removeClass("home-head-status-border-checked");
                    //    $err.text("验证码不正确").show();
                    //} else {
                        $codePar.removeClass("home-head-status-border-checked");
                        $err.hide();
                    //}

                }

            });

            $userLabel.click(function() {
                $user.focus();
            });
            $pwdLabel.click(function() {
                $pwd.focus();
            });
            $codeLabel.click(function() {
                $("#verification_code").focus();
            });
            $(".verification-code").click(function() {

                switchCode();
            });

            function register() {
                    var user = $user.val(),
                        pwd = $pwd.val(),
                        code = $code.val();
                    if( user == "" ) {
                        $err.text("手机号不能为空").show();
                        return false;
                    }
                    if( pwd == "" ) {
                        $err.text("密码不能为空").show();
                        return false;
                    } else {
                        if(pwd.length<6 || pwd.length > 20) {
                            $err.text("*密码长度为6-20个字符").show();
                            return false;
                        } else {
                            $err.hide();
                            $pwdPar.removeClass("home-head-status-border-checked");
                        }
                    }

                    if( code == "" ) {
                        $err.text("验证码不能为空").show();
                        return false;
                    }

                    if( !$(".home-head-check").hasClass("home-head-checked") ) {
                        L.showTopTips("warning","请仔细阅读龙贷服务协议并且勾选我已读");
                        return false;
                        window.dialog({
                            title:"提示",
                            content:'<div style="width:400px;height: 50px;">请仔细阅读龙贷服务协议并且勾选我已读</div>',
                            buttons:{
                                "确定":function() {
                                    $(".home-head-check").addClass("home-head-checked");
                                }
                            }
                        });
                        return false;
                    }


                    var lobj = {};
                    var paramStr = "";
                    if( location.search ) {
                        var lsearch = location.search.slice(1);
                        var larr = lsearch.split("&");
                        _.each(larr, function(val) {
                            var itemArr = val.split("=");
                            lobj[itemArr[0]] = itemArr[1]||"";
                        });

                        if( !_.isEmpty(lobj.source) ) {
                            paramStr = paramStr+  "&paramMap.source=" + lobj.source;
                        }
                        if( !_.isEmpty(lobj.sn) ) {
                            paramStr = paramStr+  "&paramMap.sn=" + lobj.sn;
                        }

                        if( !_.isEmpty(lobj.randKey) ) {
                            paramStr = paramStr + "&paramMap.randKey=" + lobj.randKey;
                        }

                    } else {
                    	lobj.source="";
                    	lobj.sn = "";
                        lobj.randKey = "";
                    }


                    var str = "paramMap.cellphone=" + user + "&paramMap.password=" + encodeURIComponent(pwd) + "&paramMap.code=" + code + "&paramMap.pageId=userregister";

                    $.ajax({
                        url:"ajaxRegisterByPhone1.do",
                        type:"POST",
                        data: str,
                        success: function(data) {
                            var result = L.isToJson(data),
                                code = result.code;
                            switchCode();

                            if( code == "400" ) {
                                $err.text("验证码错误").show();
                                return false;
                            }else if( code == "401" ) {
                                $err.text("手机号为空").show();
                                return false;
                            } else if( code == "402" ) {
                                $err.text("密码为空").show();
                                return false;
                            } else if( code == "403" ) {
                                $err.text("手机号已存在").show();
                                return false;
                            } else if( code == "404" ) {
                                $err.text("该手机号格式不对").show();
                                return false;
                            } else if( code == "500" ) {
                                $err.text("操作失败").show();
                                return false;
                            } else {
                                location.href = "registerByPhone2.do?paramMap.cellphone=" + user + (paramStr?paramStr:"");

                            }
                        }
                    });
            }

            $(".register-btn").click(function() {
                register();
            });

            $user.bind('keyup', function(event){
                if (event.keyCode=="13"){
                  register();
               }
            });
            $pwd.bind('keyup', function(event){
               if (event.keyCode=="13"){
                  register();
               }
            });
            $code.bind('keyup', function(event){
               if (event.keyCode=="13"){
                  register();
               }
            });

        }




        $(".top-log-link").click(function() {
            /*var urlStr = location.pathname;
            if( urlStr.indexOf("index") > 0 || urlStr == "/" ) {
                location.href="/index.do";
                return false;
            }*/

            $.ajax({
                url: "isRememberPsd.do",
                type:"GET",
                data:"",
                success:function(result) {
                    var res = L.isToJson(result),
                        cellphone,
                        hasPhone;
                    if( res.data ) {
                        hasPhone = true;
                        cellphone = res.data;
                    } else {
                        hasphone = false;
                        cellphone = "";
                    }

                    window.dialog({
                        title:"登录",
                        content: juicer(logDialogTmpl, {hasPhone: hasPhone, cellphone: cellphone}),
                        buttons:{
                            "确定":function() {
                                var flag = doLogin();

                                return false;
                            },
                            "取消":function() {

                            }
                        }
                    });
                    $(".login-in-register").on("click",function(){
                        $(".top-reg-link").click();
                    });

                    if( $("#login_phone").val() != "" && $("#login_phone").val() != undefined) {
                        $(".userLabel").hide();
                    }
                    $("#login_phone").bind('keyup', function(event){
                        if (event.keyCode=="13"){
                          doLogin();
                        }

                    });
                    $("#login_password").bind('keyup', function(event){
                       if (event.keyCode=="13"){
                          doLogin();
                       }
                    });
                    bindLogIn();
                },
                error:function() {

                }
            });

        });



        $(".top-reg-link").click(function() {
            window.dialog({
                title:"注册",
                content: juicer(regDialogTmpl, {})
            });

            bindRegister();

        });







    });
})(jQuery);