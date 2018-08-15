/**
 * Created by xieyuxuan on 2018/6/9.
 */
var express = require('express');
var router = express.Router();
var category = require('../models/category');

router.get('/',function(req,res,next){

    category.find().then(function(categories){



        res.render('main/index',{ userInfo: req.userInfo,categories : categories });
    });
});

module.exports = router;