/**
 * Created by xieyuxuan on 2017/9/11.
 */
var express = require("express");
var router = express.Router();


router.get("/",function(req,res,next){
    res.render('admin',{
        title: "管理页"
    })
});


module.exports = router;