const express = require('express');
const swig  = require('swig');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Cookies = require("cookie");
const User = require("./models/User");
const app = express();

//定义模板引擎
app.engine('html',swig.renderFile);
app.set('views','./views');
app.set('view engine','html');
swig.setDefaults({cache: false});


//设置静态文件托管
app.use('/public',express.static(__dirname +'/public'));

//使用body-parser获取请求参数
app.use(bodyParser.urlencoded({ extends: true }));

//设置cookie
app.use(function (req,res,next) {
   req.cookies = new Cookies(req,res);
   req.userInfo = {};
   if(req.cookies.get('userInfo')){
       try{
            req.userInfo = JSON.parse(req.cookies.get("userInfo"));
            User.findById(req.userInfo._id).then(function (userInfo) {
               req.userInfo.isAdmin = Boolean(userInfo.isAdmin);
            })
       }catch (e){}
   }

   next();
});


app.use('/admin',require('./routers/admin'));
app.use('/api',require('./routers/api'));
app.use('/',require('./routers/main'));


mongoose.connect("mongdb://localhost:27018/blog",function (err) {
   if(err){
       console.log("数据库连接成功");
       app.listen(8081);
   }else{
       console.log("数据库连接失败");
   }
});