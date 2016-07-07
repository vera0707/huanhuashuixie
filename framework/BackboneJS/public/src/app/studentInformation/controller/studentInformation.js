define(['angular', 'app'], function (angular, app) {

    app.controller('StudentInformationController', ['$scope', '$http', function ($scope, $http) {

        $scope.studentList = [];
        $scope.status = false;
        undateStudent();

        //页面初始化渲染
        function undateStudent() {
            $http.get('/students/queryAll')
                .success(function (data, status) {
                    if (status == 200) {
                        $scope.studentList = [];
                        $scope.studentList = data;
                        angular.forEach($scope.studentList, function (item) {
                            item.isCheck = false;
                        });
                    }

                });
        };

        //新增学生表
        $scope.addStudent = function(){
            var studentId, username, sex, birthTime;

            studentId = $('input[name = "studentId"]').val();
            username = $('input[name = "userName"]').val();
            sex = $('input[name = "sex"]').val();
            birthTime = $('input[name = "birthTime"]').val();


            if (!studentId) {
                swal("请输入学号");
            } else if (!username) {
                swal("请输入学生姓名");
            } else if (!birthTime) {
                swal("请选择出生日期");
            } else {
                swal({
                    title: "确认添加学生信息?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    cancelButtonText: "取消",
                    confirmButtonText: "确定",
                    closeOnConfirm: false
                }, function (isConfirm) {

                    if (isConfirm) {
                        $http.get('/students/add?name=' + username + '&studentId=' + studentId + '&sex=' + sex + '&birthTime=' + birthTime)
                            .success(function (data, status) {
                                if (status == 200) {
                                    swal("Good job!", "您的信息已保存", "success");

                                    //$('#addStudent').modal('hide');
                                    //$scope.studentList.push({
                                    //    studentId: studentId,
                                    //    name: username,
                                    //    sex: (sex == 0 ? '男' : '女'),
                                    //    birthTime: birthTime
                                    //});
                                    undateStudent();
                                    $('#addStudent').modal('hide');

                                    $scope.studentList.push({
                                        studentId: studentId,
                                        name: username,
                                        sex: (sex == 0 ? '男' : '女'),
                                        birthTime: birthTime
                                    });

                                }
                            })
                            .error(function () {
                                swal("服务器傲娇了,请稍后重试!");
                            });
                    } else {
                        swal("Cancelled", "已取消", "error");
                    }


                });
            }
        };

        //删除单个学生信息
        $scope.deleteStudent = function (studentId) {
            swal({
                title: "确认删除该学生?",
                type: "warning",
                showCancelButton: true,
                showLoaderOnConfirm: true,
                confirmButtonColor: "#DD6B55",
                cancelButtonText: "取消",
                confirmButtonText: "确定",
                closeOnConfirm: false
            }, function (isConfirm) {
                if (isConfirm) {
                    setTimeout(function () {
                        ajaxDeleteStudent(studentId);
                    }, 2000);
                }
            });
        };

        //批量删除学生信息
        $scope.deletemultiple = function () {
            var arr = [];
            angular.forEach($scope.studentList, function (item) {
                if (item.isCheck) {
                    arr.push(item.studentId);
                }
            });

            swal({
                title: "确认批量删除学上信息?",
                type: "warning",
                showCancelButton: true,
                showLoaderOnConfirm: true,
                confirmButtonColor: "#DD6B55",
                cancelButtonText: "取消",
                confirmButtonText: "确定",
                closeOnConfirm: false
            }, function (isConfirm) {
                if (isConfirm) {
                    setTimeout(function () {
                        arr = arr.join(',');
                        ajaxDeleteStudent(arr);
                    }, 2000);
                }
            })
        };

        function ajaxDeleteStudent(studentIds) {
            $http.get('/students/delete?studentIds=' + studentIds)
                .success(function (data, status) {
                    if (status == 200) {
                        //if(studentIds.indexOf(",") > -1){
                        //    studentIds = studentIds.split(",");
                        //}
                        //
                        //for(var i = 0;i < studentIds.length;i++){
                        //
                        //    angular.forEach($scope.studentList, function (k, v) {
                        //        if (v.studentId == studentIds[i]) {
                        //            $scope.studentList.splice(k, 1);
                        //            console.log('就是不严谨');
                        //            return false;
                        //
                        //        }
                        //    });
                        //}
                        undateStudent();
                        swal("删除成功!");
                    }
                    else {
                        swal("删除失败!");
                    }
                })
                .error(function () {
                    swal("服务器傲娇了,请稍后重试!");
                })
        }


    }]);
});