var express = require('express');
var router = express.Router();


var comments = {};
function html_encode(str){
  var s = '';
  if(str.length == 0) {return ''};
  s = str.replace(/&/g,"&gt;");
  s = str.replace(/</g,"&lt;");
  s = str.replace(/>/g,"&gt;");
  s = str.replace(/\s/g,"&nbsp;");
  return s;
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Express'});
});

router.get('/comment',function(req,res,next){
  comments.v = html_encode(req.query.comment);
});

router.get('/getComment',function(req,res,next){
res.json({
  common: comments.v
})
});

module.exports = router;
