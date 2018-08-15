const express = require('express');
const router = express.Router();
const User = require('./../models/User');

let responseData;

router.use(function (req,res,next) {
    responseData = {
         code: 0,
         message: "",
         data: new Date().getTime()
     };
     next();
});


router.post('/user/register',function (req,res,next) {
    const username = req.body.username;
    const password = req.body.password;
    const repassword = req.body.repassword;

    if(username == ""){
        responseData.code = 400;
        responseData.message = '用户名不能为空';
        res.json(responseData);
        return;
    }

    if(password == ""){
        responseData.code = 400;
        responseData.message = '密码不能为空';
        res.json(responseData);
        return;
    }

    if(password != repassword){
        responseData.code = 400;
        responseData.message = '两次输入的密码不一致';
        res.json(responseData);
        return;
    }

    User.findOne({
        username: username
    }).then(function (users) {
        if(users){
            responseData.code = 400;
            responseData.message = '该用户已存在';
            res.json(responseData);
        }else{
            let user = new User({
                username: username,
                password: password
            });
            return user.save();
        }
    }).then(function (newUser) {
        responseData.code = 200;
        responseData.message = '注册成功';
        res.json(responseData);
    })
});


router.post('/user/login',function (req,res,next) {
    const username = req.body.username;
    const password = req.body.password;

    if(username == ""){
        responseData.code = 400;
        responseData.message = "登录名不能为空";
        res.json(responseData);
        return;
    }

    if(password == ""){
        responseData.code = 400;
        responseData.message = "密码不能为空";
        res.json(responseData);
        return;
    }

    User.findOne({
        username: username,
        password: password
    }).then(function (userInfo) {
        if(!userInfo){
            responseData.code = 400;
            responseData.message = "用户名或密码错误";
            res.json(responseData);
            return;
        }
        responseData.code = 200;
        responseData.message = "登录成功";
        responseData.userInfo = {
            username: username,
        };

        req.cookies.set('userInfo',JSON.stringify({
            _id : userInfo._id,
            username: userInfo.username
        }));
        res.json(responseData);

    })

});


router.get("/user/logout",function (req,res,next) {

    req.cookies.set({  userInfo: null });
    responseData.code = 200;
    responseData.message = "退出成功";
    res.json(responseData);

});

module.exports = router;

