/**
 * Created by lishuxia on 16/6/30.
 */
define(['angular', 'app'], function (angular, app) {

    app.controller('RewriteStudentInController', ['$scope', '$http', '$stateParams', function ($scope, $http, $stateParams) {
        var studentId = $stateParams.studentId;

        var student = {};
        //页面初始化

            $http.get('/students/query?studentId=' + studentId).success(function (data) {
                    if (data != null) {

                        $scope.student = data[0];
                        $scope.student.birthTime = new Date($scope.student.birthTime);
                    }else{
                        swal(data.msg);
                    }

                }).error(function (data) {
                    swal(data.data);
                });



        $scope.update = function () {
            student = '?id='+$scope.student.id+'&studentId='+$scope.student.studentId+'&sex='+$scope.student.sex+'&birthTime='+$scope.student.birthTime.getTime()/1000+'&name='+$scope.student.name.toString();
            $http.get('/students/update'+student)
                .success(function (data) {
                    if (data.code == 200) {
                        swal(data.msg);
                        window.location.href = '/#admin/nav/studentInformation';
                    } else {
                        swal(data.msg);
                    }

                })
                .error(function () {
                    swal("服务器傲娇了!");
                });
        }
    }]);

});