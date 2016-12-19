/**
 * Created by lishuxia on 16/8/26.
 */
require('../../styles/user/userCenterRules.css');
    
// var $ = require("jquery"),
//     juicer = require('juicer'),
//     L = require('../core/core.js');

// $(function () {
//     function Records() {
//         this.access_token = null;
//         this.init();
//     }
//
//     $.extend(Records.prototype, {
//         init: function () {
//             var self = this;
//
//             // if (self.getUrlParameter("access_token") && self.getUrlParameter("access_token") != "null") {
//             //     self.access_token = self.getUrlParameter("access_token");
//             // }else if(self.getUrlParameter("token") && self.getUrlParameter("token") != "null"){
//             //     self.access_token = self.getUrlParameter("token");
//             // }
//            
//             // if (!!self.access_token) {
//             //     $('.userLogin').hide();
//             // }
//         },
//         getUrlParameter: function (sParam) {
//
//             var sPageURL = decodeURIComponent(window.location.search.substring(1)),
//                 sURLVariables = sPageURL.split('&'),
//                 sParameterName,
//                 i;
//
//             for (i = 0; i < sURLVariables.length; i++) {
//                 sParameterName = sURLVariables[i].split('=');
//
//                 if (sParameterName[0] === sParam) {
//                     return sParameterName[1] === undefined ? true : sParameterName[1];
//                 }
//             }
//
//         }
//     });
//
//     new Records();
//
// });