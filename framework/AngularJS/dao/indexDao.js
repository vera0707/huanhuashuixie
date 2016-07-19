// 实现与MySQL交互
var mysql = require('mysql');
var $conf = require('../conf/db');
var $sql = require('./indexSqlMapping');

// 使用连接池，提升性能
var pool  = mysql.createPool($conf.mysql);

// 向前台返回JSON方法的简单封装
var jsonWrite = function (res, ret) {
    if(typeof ret === 'undefined') {
        res.json({
            code:'1',
            msg: '操作失败'
        });
    } else {
        res.json(ret);
    }
};

module.exports = {
    login: function (req, res, next) {
        var param = req.query || req.params;

        pool.getConnection(function(err, connection) {
            connection.query($sql.login, param.userName, function(err, result) {
                if(result.length > 0 && result[0].password === param.password) {
                    result = {
                        code: 200,
                        msg:'登录成功'
                    };
                } else {
                    result = {
                        code: 400,
                        msg:'用户名或者密码错误'
                    };
                }

                jsonWrite(res, result);
                connection.release();
            });
        });
    }
};