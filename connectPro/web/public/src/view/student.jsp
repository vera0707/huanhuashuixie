<%--
  Created by IntelliJ IDEA.
  User: lishuxia
  Date: 2017/10/30
  Time: 下午4:58
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html lang="zh-CN">
<head>
    <title>学生管理系统</title>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="/public/vendor/bootstrap/dist/css/bootstrap.css" rel="stylesheet">
    <link rel="stylesheet" href="/public/vendor/sweetalert/sweetalert.css">
    <link rel="stylesheet" href="/public/src/style/dialog.css">
    <link rel="stylesheet" href="/public/src/style/student.css">
</head>
<body>
    <div class="student">
        <div class="student-title">学生管理系统</div>
        <div class="student-content">
            <div class="clearfix">
                <div class="student-btn f-l insert-btn">新增</div>
                <div class="student-btn f-l deletes-btn">批量删除</div>
                <div class="student-btn f-l refresh-btn">刷新</div>
                <div class="f-r clearfix">
                    <input type="search" class="f-l student-search" name="search-input" />
                    <div class="student-btn f-l search-btn">搜索</div>
                </div>
            </div>
            <div class="student-table">
                <div class="student-tr title clearfix">
                    <div class="w50 student-td"></div>
                    <div class="w100 student-td">姓名</div>
                    <div class="w100 student-td">学号</div>
                    <div class="w50 student-td">性别</div>
                    <div class="w150 student-td">学院</div>
                    <div class="w100 student-td">籍贯</div>
                    <div class="w50 student-td">学分</div>
                    <div class="w150 student-td">邮箱</div>
                    <div class="w100 student-td">手机号</div>
                    <div class="w50 student-td">操作</div>
                </div>
                <div id="student_list">
                    <c:forEach items="${data}"  var="stu">
                        <div class="student-tr clearfix">
                            <div class="w50 student-td">
                                <input type="checkbox" class="student-checkbox" name="deletes—input" data-id="${stu.id}"/>
                            </div>
                            <div class="w100 student-td">${stu.stuName}</div>
                            <div class="w100 student-td">${stu.stuId}</div>
                            <div class="w50 student-td">
                                <c:if test="${stu.stuSex == 0}">男</c:if>
                                <c:if test="${stu.stuSex == 1}">女</c:if>
                            </div>
                            <div class="w150 student-td">${stu.collage}</div>
                            <div class="w100 student-td">${stu.nativePlace}</div>
                            <div class="w50 student-td">${stu.credit}</div>
                            <div class="w150 student-td">${stu.email}</div>
                            <div class="w100 student-td">${stu.phone}</div>
                            <div class="w10 student-td">
                                <div class="student-btn delete-btn" data-id="${stu.id}">删除</div>
                                <div class="student-btn update-btn" data-id="${stu.id}"
                                     data-stuname="${stu.stuName}" data-stuid="${stu.stuId}" data-stusex="${stu.stuSex}"
                                     data-collage="${stu.collage}" data-email="${stu.email}"
                                     data-nativeplace="${stu.nativePlace}" data-credit="${stu.credit}" data-phone="${stu.phone}"
                                >修改</div>
                            </div>
                        </div>
                    </c:forEach>
                </div>
            </div>
            <div class="student-note">例：学号11032002&nbsp;&nbsp; 11[入学年份]-->03[学院代号]-->02[班级代号]-->02[座位号] </div>
        </div>
    </div>
    <script src="/public/vendor/jquery-1.9.1.js"></script>
    <script src="/public/vendor/juicer-min.js"></script>
    <script src="/public/vendor/bootstrap/dist/js/bootstrap.min.js"></script>
    <script src="/public/vendor/sweetalert/sweetalert.min.js"></script>
    <script src="/public/src/javascript/core/dialog.js"></script>
    <script src="/public/src/javascript/core/base.js"></script>
    <script src="/public/src/javascript/student.js"></script>

</body>
</html>
