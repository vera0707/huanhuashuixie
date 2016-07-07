// 实现与MySQL交互
var mysql = require('mysql');
var $conf = require('../conf/db');
var $sql = require('./studentsSqlMapping');

// 使用连接池，提升性能
var pool  = mysql.createPool($conf.mysql);

// 向前台返回JSON方法的简单封装
var jsonWrite = function (res, ret) {
    if(typeof ret === 'undefined') {
        res.json({
            code:'400',
            msg: '操作失败'
        });
    } else {
        res.json(ret);
    }
};

module.exports = {
    add: function (req, res, next) {
        // 获取前台页面传过来的参数
        var param = req.query || req.params;
        
        if(param.studentId == null) {
            jsonWrite(res, undefined);
            return;
        }
        
        pool.getConnection(function(err, connection) {
            
            if( err ) console.log("POOL ==>" + err);

            

            // 建立连接，向表中插入值
            //insert:'INSERT INTO students_list(id,studentId, name, sex, birthTime) VALUES(0,?,?,?,?)',
            connection.query($sql.insert, [param.studentId, param.name, param.sex, param.birthTime], function(err, result) {
                if(result) {
                    result = {
                        code: 200,
                        msg:'增加成功'
                    };
                }

                // 以json形式，把操作结果返回给前台页面
                jsonWrite(res, result);

                // 释放连接
                connection.release();
            });
        });
    },
    delete: function (req, res, next) {
        // delete by Id
        var param = req.query || req.params;

        if(param.studentIds == null) {
            jsonWrite(res, {
                code: 400,
                msg:'请选择要删除的学生学号'
            });
            return;
        }
        pool.getConnection(function(err, connection) {
            connection.query('delete from students_list where studentId in ('+param.studentIds+')', function(err, result) {
                if(result.affectedRows > 0) {
                    result = {
                        code: 200,
                        msg:'删除成功'
                    };
                } else {
                    result = void 0;
                }
                jsonWrite(res, result);
                connection.release();
            });
        });
    },
    update: function (req, res, next) {
        // update by studentId
        var param =  req.query || req.params;

        if(param.studentId == null) {
            jsonWrite(res, {
                code: 400,
                msg:'请填写要修改的学生学号'
            });
            return;
        }

        if(param.name == null && param.sex == null && param.birthTime == null) {
            jsonWrite(res, undefined);
            return;
        }

        

        pool.getConnection(function(err, connection) {
            connection.query($sql.update, [param.name, param.sex, param.birthTime, +param.studentId], function(err, result) {
                if(result.affectedRows > 0) {
                    result = {
                        code: 200,
                        msg:'修改成功'
                    };
                } else {
                    result = {
                        code: 401,
                        msg:'修改失败'
                    };
                }
                jsonWrite(res, result);

                connection.release();
            });
        });

    },
    queryById: function (req, res, next) {
        var studentId = +req.query.studentId; // 为了拼凑正确的sql语句，这里要转下整数
        pool.getConnection(function(err, connection) {
            connection.query($sql.queryById, studentId, function(err, result) {
                jsonWrite(res, result);
                connection.release();

            });
        });
    },
    queryAll: function (req, res, next) {
        pool.getConnection(function(err, connection) {
            connection.query($sql.queryAll, function(err, result) {
                jsonWrite(res, result);
                connection.release();
            });
        });
    }

};