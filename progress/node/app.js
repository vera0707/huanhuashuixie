/**
 * Created by xieyuxuan on 2018/6/6.
 */

var express = require('express');
var swig = require('swig');
var mongoose = require("mongoose");
var bodyParser = require('body-parser');
var Cookies = require('cookies');
var User = require('./models/user');
var app = express();


//设置文件末班
app.engine('html',swig.renderFile);
app.set('views','./views');
app.set('view engine','html');
swig.setDefaults({ cache : false});


//设置静态文件
app.use('/public',express.static(__dirname + '/public'));

//设置body-param
app.use(bodyParser.urlencoded({ extended: true }));

//设置cookie
app.use( function(req,res,next){
    req.cookies = new Cookies(req,res);
    var userInfo = req.cookies.get('userInfo');
    req.userInfo = {};
    if(userInfo){
        try{
            req.userInfo = JSON.parse(userInfo);
            User.findById(req.userInfo._id).then(function(userInfo){
                req.userInfo.isAdmin = (userInfo.username == "admin" ? true : userInfo.isAdmin);
                next();
            }).catch(function(){
                next();
            });
        }catch(e){
            console.log(e);
            next();
        }
    }else{
        next();
    }
});


//设置路由地址
app.use('/admin',require('./routers/admin'));
app.use('/api',require('./routers/api'));
app.use('/',require('./routers/main'));

//app.get('/',function(req,res,next){
//    res.render('index');
//});

mongoose.connect('mongodb://localhost:27018/blog',function(err){
    if(err){
        console.log("数据库连接失败");
    }else{
        console.log("数据库连接成功");
        app.listen(8888);
    }
});
