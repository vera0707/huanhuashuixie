/**
 * Created by lishuxia on 2017/11/2.
 */

$(function () {


    var stuListTmpl = [
        '{@each data as stu}',
            '<div class="student-tr clearfix">',
                '<div class="w50 student-td">',
                    '<input type="checkbox" class="student-checkbox" name="deletes—input" data-id="${stu.id}"/>',
                '</div>',
                '<div class="w100 student-td">${stu.stuName}</div>',
                '<div class="w100 student-td">${stu.stuId}</div>',
                '<div class="w50 student-td">{@if stu.stuSex == 0}男{@else if stu.stuSex == 1}女{@/if}</div>',
                '<div class="w150 student-td">${stu.collage}</div>',
                '<div class="w100 student-td">${stu.nativePlace}</div>',
                '<div class="w50 student-td">${stu.credit}</div>',
                '<div class="w150 student-td">${stu.email}</div>',
                '<div class="w100 student-td">${stu.phone}</div>',
                '<div class="w10 student-td">',
                    '<div class="student-btn delete-btn" data-id="${stu.id}">删除</div>',
                    '<div class="student-btn update-btn" data-id="${stu.id}" data-stuname="${stu.stuName}" data-stuid="${stu.stuId}" data-stusex="${stu.stuSex}" data-collage="${stu.collage}" data-email="${stu.email}" data-nativeplace="${stu.nativePlace}" data-credit="${stu.credit}" data-phone="${stu.phone}">修改</div>',
                '</div>',
        '</div>',
        '{@/each}'
    ].join("");


    var stuDialogTmpl = [
        '<div class="student-dialog">',
            '<input type="text" id="stuName" placeholder="请输入学生姓名" value="{@if data.stuName}${data.stuName}{@/if}" class="student-input" />',
            '<input type="text" id="stuId" placeholder="请输入8位数字类型的学号" value="{@if data.stuName}${data.stuId}{@/if}" class="student-input" />',
            '<label>性别: <input name="stuSex" type="radio" value="0" {@if !data.stuSex  || data.stuSex != 1}checked="checked"{@/if} /> 男 ',
                '<input name="stuSex" type="radio" value="1" {@if data.stuSex == 1}checked="checked"{@/if} /> 女 </label>',
            '<input type="text" id="collage" placeholder="请输入所在学院" value="{@if data.collage}${data.collage}{@/if}" class="student-input">',
            '<input type="text" id="nativePlace" placeholder="请输入籍贯" value="{@if data.nativePlace}${data.nativePlace}{@/if}" class="student-input">',
            '<input type="text" id="credit" placeholder="请输入学分" value="{@if data.credit}${data.credit}{@/if}" class="student-input">',
            '<input type="text" id="email" placeholder="请输入邮箱" value="{@if data.email}${data.email}{@/if}" class="student-input">',
            '<input type="text" id="phone" placeholder="请输入手机号" value="{@if data.phone}${data.phone}{@/if}" class="student-input">',
        '</div>'
    ].join("");

    function Student() {
        this.init();
    }

    $.extend(Student.prototype,{
        init: function () {
            this.events();
        },
        events: function () {
            var self = this;

            $(".refresh-btn").on("click",function () {
                window.location.reload();
            });

            $("body").on("click",".delete-btn",function () {
                 var id = $(this).data("id");
                swal({
                        title: "确定删除吗？",
                        text: "你将无法恢复该数据！",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "确定删除！",
                        closeOnConfirm: false
                    },
                    function(){
                        self.deleteStudent(id);
                    });

            });

            $("body").on("click",".insert-btn",function () {
                window.dialog({
                    title: "新增学生信息",
                    content: juicer(stuDialogTmpl,{data:{}}),
                    buttons: {
                        "确定": function () {
                            self.dataVerify(function (status,stuData) {
                                if(status){
                                    self.insertStudent(stuData);
                                }else{
                                    return false;
                                }
                            })

                        },
                        "取消": function () {
                        }
                    }
                })
            });
            
            $("body").on("click",".update-btn",function () {
                var studentData = {
                        id: $(this).data("id"),
                        stuName: $(this).data("stuname"),
                        stuId: $(this).data("stuid"),
                        stuSex: $(this).data("stusex"),
                        collage: $(this).data("collage"),
                        nativePlace: $(this).data("nativeplace"),
                        credit: $(this).data("credit"),
                        email: $(this).data("email"),
                        phone: $(this).data("phone")
            };


                window.dialog({
                    title: "修改学生信息",
                    content: juicer(stuDialogTmpl, {data: studentData}),
                    buttons: {
                        "确定": function () {
                            var isNext = false;
                            self.dataVerify(function (status, stuData) {
                                if (status) {
                                    stuData.id = studentData.id;
                                    self.updateStudent(stuData);
                                    isNext = true;
                                }
                            });

                            return isNext;


                        },
                        "取消": function () {
                        }
                    }
                })
            });


            $("body").on("click",".search-btn",function () {
               var searchStr = $("input[name=search-input]").val();
                if(searchStr == ""){
                    swal("请先输入要搜索的关键词");
                    return false;
                }

                self.selectStudent(searchStr);


            });

            $("body").on('change',".student-checkbox",function () {
                if($(this).is(':checked')){
                    $(this).parent().parent().addClass("active");
                }else{
                    $(this).parent().parent().removeClass("active");
                }
            });

            $("body").on("click",".deletes-btn",function () {
                var list = [];
                var $dom = $("input[name=deletes—input]");

                for(var i = 0; i < $dom.length; i++){
                    if($dom.eq(i).is(":checked")){
                        var id = parseInt($dom.eq(i).data("id"));
                        if(!!id){
                            list.push(id);
                        }

                    }
                }

                if(list.length == 0){
                    swal("","您还未选中任何学生");
                    return false;
                }

                swal({
                        title: "确定批量删除您选中的学生信息吗？",
                        text: "你将无法恢复该数据！",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "确定删除！",
                        closeOnConfirm: false
                    },
                    function(){
                        self.deleteListStudent(list);
                    });

            });
        },
        dataVerify: function (callback) {
            var stuName = $("#stuName").val(),
                stuId = $("#stuId").val(),
                stuSex = $('input[name=stuSex]:checked').val(),
                phone = $("#phone").val(),
                collage = $("#collage").val(),
                credit = $("#credit").val(),
                email = $("#email").val(),
                stuData = {
                    stuName: stuName,
                    stuId: stuId,
                    stuSex: stuSex,
                    collage: collage,
                    nativePlace: $("#nativePlace").val(),
                    credit: credit,
                    email: $("#email").val(),
                    phone: phone
                },
                emailRegex = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/;


            if(stuName == ""){
                swal("","学生姓名不能为空");
                callback(false);
            }else if(stuId == ""){
                swal("","学号不能为空不能为空");
                callback(false);
                return false;
            }else if(isNaN(stuId) || stuId.length != 8){
                swal("","学号必须是为长度为8的数字");
                callback(false);
            }else if(isNaN(stuId)){
                swal("","学号必须为数字类型");
                callback(false);
            }else if(collage == ""){
                swal("","学院不能为空");
                callback(false);
            }else if(credit == ""){
                swal("","学分不能为空");
                callback(false);
            }else if(email != "" && !emailRegex.test( email )){
                swal("","请输入有效的邮箱地址");
                callback(false);
            }else if(isNaN(credit)){
                swal("","学分必须为整数");
                callback(false);
            }else if(phone == ""){
                swal("","手机号不能为空");
                callback(false);
            }else if(!window.phoneRegex.test(phone)){
                swal("","请输入正确的手机号码");
                callback(false);
            }else{
                callback(true,stuData);
            }
        },
        render: function (data) {
            $("#student_list").html(juicer(stuListTmpl,{data: data}));
        },
        deleteStudent: function (id) {
            var self = this;
            $.ajax({
                url: '/student/delete',
                type: 'POST',
                data: {
                    id : id
                },
                success: function (res) {
                    if(!!res){
                        swal("","删除成功");
                        self.render(JSON.parse(res));
                    }else{
                        swal("","数据删除失败,请重新尝试");
                    }
                },
                error: function () {
                    swal("","服务器傲娇了");
                }
            })
        },
        insertStudent:function(stuData){
            var self = this;
            $.ajax({
                url: '/student/insert',
                type: "POST",
                data: {
                    stuName: stuData.stuName,
                    stuId: stuData.stuId,
                    stuSex: stuData.stuSex,
                    collage: stuData.collage,
                    nativePlace: stuData.nativePlace,
                    credit: stuData.credit,
                    email: stuData.email,
                    phone: stuData.phone
                },
                success: function (res) {
                    if(res){
                        swal("","添加成功");
                        self.render(JSON.parse(res));
                    }else{
                        swal("","信息插入失败,请重新尝试");
                    }

                },
                error: function () {
                    swal("","服务器傲娇了");
                }
            })
        },
        updateStudent: function (stuData) {
            var self = this;

            console.log(stuData);
            $.ajax({
                url: "/student/update",
                type: "POST",
                data: stuData,
                success: function (res) {
                    if(res){
                        swal("","修改成功");
                        self.render(JSON.parse(res));
                    }
                },
                error: function () {
                    swal("","服务器傲娇了");
                }

            })

        },
        deleteListStudent: function (listData) {
            var self = this;
            $.ajax({
                url: "/student/deletes",
                type: "POST",
                dataType: "json",
                traditional: true,
                data: {
                    stuList: listData
                },
                success: function (res) {
                    if(res){
                        swal("","批量删除成功");
                        self.render(res);
                    }else{
                        swal("","批量删除失败,请重新尝试");
                    }
                },
                error: function () {
                    swal("","服务器傲娇了");
                }
            })
        },
        selectStudent: function (searchStr) {
            var self = this;
            $.ajax({
                url: "/student/select",
                type: "POST",
                data: {
                    selectStr:  searchStr
                },
                success: function (res) {
                    if(res){
                        if(JSON.parse(res).length > 0){
                            swal("","查询成功！");
                            self.render(JSON.parse(res));
                        }else{
                            swal("","查询结果为空");
                        }
                    }else{
                        swal("","查询失败,请重新尝试");
                    }
                },
                error: function () {
                    swal("","服务器傲娇了");
                }
            })
        }
    });


    new Student();
});