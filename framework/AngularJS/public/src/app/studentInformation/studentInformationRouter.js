/**
 * Created by lishuxia on 16/6/28.
 */
define([],function() {
    return {
        "admin.viewContainer": {
            url: "/nav",
            views: {
                "viewContainer": {
                    templateUrl: '/src/app/studentInformation/view/nav.html'
                }
            }
        
        },
        "admin.viewContainer.studentInformation": {
            url: "/studentInformation",
            views: {
                "viewContainerText": {
                    templateUrl: '/src/app/studentInformation/view/studentInformation.html',
                    controller: 'StudentInformationController',
                    resolve: {
                        deps: [
                            '/src/app/studentInformation/controller/studentInformation.js'
                        ]
                    }
                }
            }

        },
        "admin.viewContainer.rewriteStudentIn": {
            url: "/rewriteStudentIn/:studentId",
            views: {
                "viewContainerText": {
                    templateUrl: '/src/app/studentInformation/view/rewriteStudentIn.html',
                    controller: 'RewriteStudentInController',
                    resolve: {
                        deps: [
                            '/src/app/studentInformation/controller/rewriteStudentIn.js'
                        ]
                    }
                }
            }

        }
    }

});