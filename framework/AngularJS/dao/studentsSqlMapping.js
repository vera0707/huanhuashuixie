/**
 * Created by zhangliyuan on 16/6/24.
 */
var student = {
    insert:'INSERT INTO students_list(id, studentId, name, sex, birthTime) VALUES(0,?,?,?,?)',
    update:'update students_list set studentId=?, name=?, sex=?, birthTime=? where id=?',
    queryById: 'select * from students_list where studentId=?',
    queryAll: 'select * from students_list'
};

module.exports = student;