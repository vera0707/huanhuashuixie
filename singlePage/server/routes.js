/**
 * Created by sundongzhi on 16/7/8.
 */

const fs = require('fs');
const path = require("path");
const proxy = require("koa-proxy");

var render = require('koa-ejs');



module.exports = (router, app, staticDir) => {
    "use strict";

    //定义render的参数
    render(app, {
        root: path.resolve(__dirname, '../public/dist/views'),
        layout: false,
        viewExt: 'html',
        cache: false,
        debug: true
    });
    
//可以代理的url
    //router.get('/api/list', proxy({host: 'http://localhost:3010/'}));


    // 注意这里犯了一个重要的错误,使用webpack的热替换的时候,不能使用自己在nodejs配置的路由否则会导致,webpack生成的文件无法访问到,只能直接访问html
    router.get('/', function*(next) {
        yield this.render('index', {
            name: 'sundongzhi'
        });

    });


    router.get('/main', function*(next) {
        yield this.render('main', {
            name: 'sundongzhi'
        });
    });

    router.get('/404', function*(next) {
        yield this.render('404', {
            name: 'sundongzhi'
        });
    });
}