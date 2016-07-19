/**
 * Created by lishuxia on 16/6/27.
 */
define([
    'app',
    'studentShowRouter'
], function (app,studentShowRouter) {
    'use strict';

    var routerArr = [];
    routerArr.push(studentShowRouter);

    return app.config(function ($stateProvider, $urlRouterProvider,$requireProvider) {
        $urlRouterProvider.otherwise("/admin");
        $stateProvider.state("admin", {
            url: "/admin",
            views: {
                "viewLeft": {
                    templateUrl: "/src/app/core/view/viewLeft.html",
                    controller:'MainController',
                    resolve: {
                        deps: $requireProvider.requireJS(['/src/app/core/js/mainController.js'])
                    }
                },
                "viewRightTop": {
                    templateUrl: "/src/app/core/view/viewRightTop.html"
                },
                "viewRight": {
                    templateUrl: "/src/app/core/view/viewRight.html"
                }
            }

        });

        angular.forEach(routerArr, function (routerItem) {

            angular.forEach(routerItem, function (urlInfo, state) {

                angular.forEach(urlInfo.views, function (viewInfo) {

                    if (viewInfo && viewInfo.resolve && viewInfo.resolve.deps) {
                        viewInfo.resolve.deps = $requireProvider.requireJS(viewInfo.resolve.deps)
                    }
                });
                $stateProvider.state(state, urlInfo);
            })

        });


    });
});