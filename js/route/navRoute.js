/**
 * Created by lishuxia on 16/2/2.
 */
define([],function() {


    return {
        "admin.nav": {
            url: "/nav",
            views: {
                "viewCon": {
                    templateUrl: '/page/nav/views/nav.html'
                }
            }

        },
        "admin.nav.me": {
            url: "/me",
            views: {
                "viewConInner": {
                    templateUrl: '/page/nav/views/me.html',
                    controller: 'MeController',
                    resolve: {
                        deps: [
                            '/page/nav/controllers/me.js',
                        ]
                    }
                }
            }

        },
    }

});