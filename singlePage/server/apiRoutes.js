/**
 * Created by sundongzhi on 16/7/11.
 */

const fs = require('fs');
const path = require("path");
const proxy = require("koa-proxy");

var render = require('koa-ejs');



module.exports = (router, app, staticDir) => {
    "use strict";


//可以代理的url
    //router.get('/api/list', proxy({host: 'http://localhost:3010/'}));


    router.get('/api/list', function*(next) {
       this.body = {
           code: 200,
           data: {
               a: 123,
               b: 456
           }
       }

    });


}