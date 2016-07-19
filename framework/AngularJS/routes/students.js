var express = require('express');
var router = express.Router();

var studentDao = require('../dao/studentDao');

var loginVerification = function (req) {
  if(!req.session.user){
    res.redirect('index');
    return false;
  }
}
/* GET users listing. */
// router.get('/', function(req, res, next) {
//   // res.send('respond with a resource');
//   res.render('students', { title: 'students' });
//
// });


// 增加用户
router.get('/add', function(req, res, next) {
  studentDao.add(req, res, next);
});
//获取所有用户
router.get('/queryAll', function(req, res, next) {
  studentDao.queryAll(req, res, next);
});
//根据id
router.get('/query', function(req, res, next) {
  studentDao.queryById(req, res, next);
});
//删除
router.get('/delete', function(req, res, next) {
  studentDao.delete(req, res, next);
});
//修改
router.get('/update', function(req, res, next) {
  studentDao.update(req, res, next);
});



module.exports = router;
