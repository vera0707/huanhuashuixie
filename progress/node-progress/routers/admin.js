

const express = require('express');
const router = express.Router();
const User = require("./../models/User");
const Category = require("./../models/Category");

router.use(function (req,res,next) {
   if(!req.userInfo.isAdmin){
       res.send('对不起，只有管理员才可以进入该页面');
       return;
   }

   next();
});

router.get('/',function (req,res) {
    res.render('views/index',{
        userInfo: req.userInfo
    })
});

router.get('/user',function (req,res) {

    let count = User.count();
    let page  = req.query.page || 1;  //当前页数
    page = (page < 1 ? 1 : page);
    page = (page > Math.ceil(count/limit) ? Math.ceil(count/limit) : page);
    let limit = 2;  //每页显示条数
    let skip = (page -1)*limit;  //跳过的数量


    // limit() 限制获取的数据条数
    // slip() 忽略数据的条数

    let page = Number(req.query.page || 1);
    let limit = 2;


    User.count().then(function (count) {
        let pages = Math.ceil(count / limit);
        page = Math.min(page,pages);
        page = Math.max(page,1);
        let skip = (page -1) * limit;

        User.find().limit(2).skip(skip).then(function (users) {
            res.render('admin/index',{
                userInfo: req.userInfo,
                users : users,

                page: page,
                limit: limit
            })
        });
    });

});


router.get('category',function (req,res) {
    res.render('admin/category_index',{
        userInfo: req.userInfo
    })
});

router.post('category/add',function (req,res) {

    const name = req.body.name;
    if(name == ""){
        res.render('admin/category_error',{
            userInfo: req.userInfo,
            message: '名称不能为空'
        });
    }

    Category.findOne({
        name : name
    }).then(function (category) {
        if(category){
            res.render('admin/category_error',{
                userInfo: req.userInfo,
                message: '该分类已存在'
            });
            return Promise.reject();
        }


        return new Category({
            name: name
        }).save();

    }).then(function (newCategory) {
        res.render('admin/category_error',{
            userInfo: req.userInfo,
            message: '创建新分类成功'
        });
    });



    res.render('admin/category_add',{
        userInfo: req.userInfo
    })
});

module.exact = router;