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
        root: __dirname,
        layout: false,
        viewExt: 'html',
        cache: false,
        debug: true
    });
    
//可以代理的url
//     router.get('/v2/olympicActivity/singInHistory', proxy({host: 'http://127.0.0.1:8081'}));
    router.post('/v2/realData/dashboard', proxy({host: 'https://m.longdai.com'}));
    router.post('/v2/realData/riskControl', proxy({host: 'https://m.longdai.com'}));
    router.post('/v2/realData/projectOverview', proxy({host: 'https://m.longdai.com'}));
    router.post('/v2/realData/userInfo', proxy({host: 'https://m.longdai.com/'}));
    router.post('/v2/realData/platformOutline', proxy({host: 'https://m.longdai.com/'}));
    router.post('/v2/statistics/real-data/user/invest/top', proxy({host: 'https://m.longdai.com/'}));
    router.post('/v2/statistics/real-data/user/repayment', proxy({host: 'https://m.longdai.com/'}));

    // router.post('/v2/activity_11/userInvestTop', proxy({host: 'http://dohko.m.longdai.com/v2/activity_11/userInvestTop'}));
    // router.post('/v2/activity_11/winners', proxy({host: 'http://dohko.m.longdai.com/v2/activity_11/winners'}));
    // router.post('/v2/activity_11/luckyDrawChanceCount?token=58', proxy({host: 'http://dohko.m.longdai.com/v2/activity_11/luckyDrawChanceCount?token=58'}));
    // router.post('/v2/activity_11/luckyDraw?token=58&chanceCount=1', proxy({host: 'http://dohko.m.longdai.com/v2/activity_11/luckyDraw?token=58&chanceCount=1'}));

    // 注意这里犯了一个重要的错误,使用webpack的热替换的时候,不能使用自己在nodejs配置的路由否则会导致,webpack生成的文件无法访问到,只能直接访问html
    router.get('/', function*(next) {
        console.log(path.resolve(staticDir, 'views/html'));
        var pages = [];
        function walkHtml(path){
            var dirList = fs.readdirSync(path);
            dirList.forEach(function(item){
                if(fs.statSync(path + '/' + item).isDirectory()){
                    walkHtml(path + '/' + item);
                }else{

                    let htmlPrefix = path.split("views/html")[1];


                    pages.push('views/html' + htmlPrefix + '/'+item );
                }
            });
        }

        walkHtml(path.resolve(staticDir, 'views/html'));
        
        pages = pages.filter((page) => {
            return /\.html$/.test(page);
        })

        yield this.render('home', {pages: pages|| []});

    });


    //这些都会有问题,只能将文件罗列出来
    // router.get('/main', function*(next) {
    //     yield this.render('main', {
    //         name: 'sundongzhi'
    //     });
    // });
    //
    // router.get('/404', function*(next) {
    //     yield this.render('404', {
    //         name: 'sundongzhi'
    //     });
    // });
}