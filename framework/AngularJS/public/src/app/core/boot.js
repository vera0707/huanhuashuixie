/**
 * Created by lishuxia on 16/6/27.
 */
/**
 * Created by sundongzhi on 15/11/3.
 */
requirejs.config({
    baseUrl:'/',
    paths:{
        'jquery':'/vendor/jquery/dist/jquery.min',
        'angular':'/vendor/angular/angular.min',
        'uiRouter':'/vendor/angular-ui-router/release/angular-ui-router.min',
        'ngRequire':'/vendor/angular-require/angular-require.min',
        'mainRouter':'/src/app/core/mainRouter',
        'sweetalert' : '/vendor/sweetalert/dist/sweetalert.min',
        'app':'/src/app/core/app',
        'studentShowRouter': '/src/app/studentInformation/studentInformationRouter'
    },
    shim: {
        'angular': {'exports' : 'angular'},
        'ngRequire':['angular'],
        'uiRouter':['angular'],
        'bootstrap': {
            deps: ['jquery']
        }
    },
    priority: [
        "angular"
    ]
});


require(['angular','app','mainRouter'],function(angular) {
    'use strict';

    var $html = angular.element(document.getElementsByTagName('html')[0]);
    angular.element().ready(function() {
        // bootstrap the app manually
        angular.bootstrap(document, ['app']);
    });


});