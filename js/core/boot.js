/**
 * Created by lishuxia on 16/1/28.
 */
requirejs.config({
    baserUrl:'/',
    paths:{
        'jquery':'/js/vendor/jquery-1.11.3',
        'angular':'/js/vendor/angular',
        'uiRouter':'/js/vendor/angular-ui-router/release/angular-ui-router.min',
        'ngRequire':'/js/vendor/angular-require/angular-require.min',
        'mainRouter':'/js/core/mainRouter',
        'ngResource':'/js/vendor/angular-resource/angular-resource.min',
        'app':'/js/core/app',
        'nav':'/js/route/navRoute'

    },
    shim:{
        'angular':{'exports':'angular'},
        'ngRequire':['angular'],
        'uiRouter':['angular'],
        'bootstrap':{
            deps:['jquery']
        }
    },
    priority:[
        'angular'
    ]
});



require(['angular','app','mainRouter'],function(angular){
    'user strict';
console.log("into start")
    angular.element().ready(function(){
        angular.bootstrap(document,['app']);
    });
})