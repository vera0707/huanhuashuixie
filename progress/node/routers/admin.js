/**
 * Created by xieyuxuan on 2018/6/9.
 */
var express = require("express");
var router = express.Router();
var User = require("../models/user");
var Category = require('../models/category');

router.use(function(req,res,next){

    if(!req.userInfo.isAdmin){
        res.send('抱歉 您不是管理员 无权访问');
        return;
    }

    next();
});


router.use('/user',function(req,res,next){

//增加分页
//limit 限制数量
//skip 忽略数量

    var page = Number(req.query.page || 1);
    var limit = 2;
    var pages = 0;

    User.count().then(function(count){
        pages = Math.ceil(count / limit);
        page = Math.min( page,pages );
        page = Math.max( page,1 );

        var skip = (page - 1)*limit;

        User.find().limit(limit).skip(skip).then(function(users){
            res.render('admin/user_index',
                {   userInfo: req.userInfo,
                    users : users,
                    page: page,  //当前页
                    count: count,  //总数据量
                    limit: limit,   //每页条数
                    pages: pages, //总页面
                    url: '/admin/user'
                });
        });
    });
});


router.get('/category',function(req,res,next){
    var page = Number(req.query.page || 1);
    var limit = 2;
    var pages = 0;

    Category.count().then(function(count){
        pages = Math.ceil(count / limit);
        page = Math.min( page,pages );
        page = Math.max( page,1 );

        var skip = (page - 1)*limit;

        Category.find().limit(limit).skip(skip).then(function(categories){
            res.render('admin/category_index',
                {   userInfo: req.userInfo,
                    categories : categories,
                    page: page,  //当前页
                    count: count,  //总数据量
                    limit: limit,   //每页条数
                    pages: pages, //总页面
                    url: '/admin/category'
                });
        });
    });
});

router.get('/category/add',function(req,res,next){
    res.render('admin/category_add',{
        userInfo: req.userInfo
    })
});


router.post('/category/add',function(req,res,next){
    var name = req.body.name;
    if(name == ""){
        res.render("admin/error",{
            message: '分类名称不能为空'
        });
        return;
    }

    //数据库中是否存在这个分类

    Category.findOne({
        name: name
    }).then(function(rs){
        if(rs){
            res.render('admin/error',{
                message: '分类已经存在'
            });
            return Promise.reject(new Error("不能重复添加分类"));
        }else{
            return new Category({
                name : name
            }).save();
        }
    }).then(function(){
        res.render('admin/success',{
            message: '分类保存成功',
            url: '/admin/category'
        })
    }).catch(function(err){
        console.log(err);
    });
});

router.get('/category/edit',function(req,res){
    var id  = req.query.id || '';
    Category.findOne({
        _id: id
    }).then(function(category){
        if(!category){
            res.render('admin/error',{
                userInfo: req.userInfo,
                message: '分类信息不存在'
            })
        }else{
            res.render('admin/category_edit',{
                userInfo: req.userInfo,
                category: category
            })
        }
    })
});


router.post("/category/edit",function(req,res){
    var id = req.body.id || '';
    var name = req.body.name;

    if(name == ""){
        res.render('admin/error',{
            userInfo: req.userInfo,
            message: '分类名不能为空',
            url: '/admin/category'
        });
    }


    Category.findOne({
        _id: id
    }).then(function(category){
        if(!category){
            res.render('admin/error',{
                userInfo: req.userInfo,
                message: '分类信息不存在'
            });
            console.log('id号不对');
        }else{
           if(name == category.name){
               res.render('admin/success',{
                   userInfo: req.userInfo,
                   message: '修改成功',
                   url: '/admin/category'
               });
               return Promise.reject(new Error("修改好了"));
           }else{
               return Category.findOne({
                   _id : {$ne: id},
                   name: name
               })
           }
        }
    }).then(function(sameCargory){
        if(sameCargory){
            res.render('admin/error',{
                userInfo: req.userInfo,
                message: '数据库中已经存在同名分类'
            });
            return Promise.reject(new Error("分类名已存在"));
        }else{
            Category.update({
                _id : id},{
                name: name
            });
        }
    }).then(function(){
        req.render('admin/success',{
            userInfo: req.userInfo,
            message: '修改成功',
            url: 'admin/category'
        })
    }).catch(function(err){
        console.log(err);
    }).catch(function(err){
        console.log(err);
    })

});

router.get("/category/delete",function(req,res){
    var id = req.query.id || id;
    Category.remove({
        _id: id
    }).then(function(){
        res.render('admin/success',{
            userInfo: req.userInfo,
            message: '删除分类成功',
            url: 'admin/category'
        })
    })

});

router.use('/',function(req,res,next){
    res.render('admin/index',{ userInfo: req.userInfo });
});

module.exports  = router;