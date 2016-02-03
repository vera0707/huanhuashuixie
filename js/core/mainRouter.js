/**
 * Created by lishuxia on 16/1/28.
 */
define(['app', 'nav'], function (app, nav) {
    'user strict';

    var routerArr = [];
    routerArr.push(nav);

    return app.config(function ($stateProvider, $urlRouterProvider, $requireProvider, $httpProvider, $anchorScrollProvider) {


        $urlRouterProvider.otherwise("/admin");

        //console.log("读取进度测试");

        $stateProvider.state("admin", {
            url: "/admin",
            views: {
                "viewTop": {
                    templateUrl: '/page/top/top.html'

                },
                "viewBody": {
                    templateUrl: '/page/body/body.html'

                },
                "viewFooter": {
                    templateUrl: '/page/footer/footer.html'

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

        })
    });
});