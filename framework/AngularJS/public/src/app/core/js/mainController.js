
define(['angular', 'app'], function (angular, app) {

    app.controller('MainController', ['$rootScope', function ($rootScope) {

        $rootScope.isLoading = false;
        $rootScope.isLogin = false;

        var userNamer = localStorage.userName;

        if ($rootScope.isLogin || (!userNamer)) {

            swal({
                title: "您未登录,请先登录",
                type: "warning",
                showCancelButton: false,
                confirmButtonColor: "#AEDEF4",
                confirmButtonText: "OK",
                closeOnConfirm: false
            }, function () {
                window.location.href = "/login";
            });


        } else {
            $('#userName').html(userNamer + '老师');
            $rootScope.isLogin = true;
        }

    }])

});

