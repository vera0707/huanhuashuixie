var express = require('express');
var router = express.Router();
var indexDao = require('../dao/indexDao');




/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '学生管理系统'});
});

/* GET home page. */
router.get('/login', function(req, res, next) {

    if(req.query.userName){
        indexDao.login(req, res, next);
    }else{
        res.render('login', { title: '系统登录' });
    }
});
/* GET home page. */
router.get('/logout', function(req, res, next) {
  req.session.user = null;
  req.session.error = null;
  res.redirect('index');
});

module.exports = router;
