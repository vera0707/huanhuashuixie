/**
 * Created by xieyuxuan on 2018/6/9.
 */
var express = require("express");
var router = express.Router();
var User = require('../models/user');


//统一返回格式

var responseData;
router.use(function(req,res,next){
   responseData = {
       code : 500,
       message: '',
       data: null
   };
    next();
});

router.post('/user/register',function(req,res,next){
    var username = req.body.username;
    var password = req.body.password;
    var repassword = req.body.repassword;

    if(!username || username.trim() == ""){
        responseData = { code: 400,message: '用户名不能为空'};
        res.json(responseData);
        return false;
    }

    if(!password || password.trim() == ""){
        responseData = { code: 400,message: '密码不能为空' };
        res.json(responseData);
        return false;
    }

    if(!repassword || repassword.trim() == ""){
        responseData = { code: 400,message: '重复密码不能为空' };
        res.json(responseData);
        return false;
    }

    if(password != repassword){
        responseData = { code: 400,message: '两次密码不一致' };
        res.json(responseData);
        return false;
    }

    //查询是否存在数据

    User.findOne({
        username: username
    }).then(function(userInfo){
       if(userInfo){
           responseData = { code: 400,message: '该用户已经注册' };
           res.json(responseData);
           return;
       }else{
           var user = new User({
               username: username,
               password: password
           });

           return user.save();
       }
    }).then(function(newUserInfo){
        if(newUserInfo){
            responseData = { code: 200,message: '注册成功' };
            res.json(responseData);
        }
        return false;
    });

});


router.post('/user/login',function(req,res,next){
    var username = req.body.username;
    var password = req.body.password;

    if(!username || username.trim() == ""){
        responseData = { code: 400,message: '用户名不能为空'};
        res.json(responseData);
        return false;
    }

    if(!password || password.trim() == ""){
        responseData = { code: 400,message: '密码不能为空' };
        res.json(responseData);
        return false;
    }

    //查询数据库中相同用户名和密码的存在是否一致

    User.findOne({
        username: username,
        password: password
    }).then(function(userInfo){
        if(userInfo){
            var responseData = { username: userInfo.username, _id: userInfo._id};
            req.cookies.set('userInfo', JSON.stringify(responseData));
            responseData = { code: 200,message: '登陆成功',data: responseData };
            res.json(responseData);
            return;
        }else{
            responseData = { code: 400,message: '用户名或密码错误' };
            res.json(responseData);
        }
    })
});

router.get('/user/logout',function(req,res,next){
    try{
        req.cookies.set('userInfo',null);
        responseData = { code: 200,message: '退出登录成功'};
    }catch (e){
        responseData = { code: 200,message: '退出失败'};

    }finally {
        res.json(responseData);
        return;
    }
});

module.exports = router;