var express = require('express');
var nodeExcel = require('excel-export');  //excel到处插件
var app = express();

app.get('/excel', function(req, res){
    //基本excel规则
    var conf = {};
    conf.stylesXmlFile = "styles.xml";
    conf.cols = [{
        caption: '编号',    //行名称
        type:'number',       //类型
        width: 15,   //宽度
        beforeCellWrite:function(row, cellData){  //处理数据
            return cellData; //数据大写
        }
    },{
        caption: '姓名',
        type:'string',
        width: 20,
        beforeCellWrite:function(row, cellData,eOpt){  //处理数据

            if(cellData == ""){
                return "查无此人";
            }
            return cellData;
        }
    },{
        caption: '日期',
        type:'string',
        width: 25
    }];
    conf.rows = [
        [1, "华晨宇","2014-04-15 00:00:00"],
        [2, "","2014-04-15 00:00:00"],
        [3, "汪苏泷","2014-04-17 00:00:00"],
        [4, "罗一笑","2014-04-18 00:00:00"]
    ];
    var result = nodeExcel.execute(conf);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats');
    res.setHeader("Content-Disposition", "attachment; filename=" + "userDate.xlsx");
    res.end(result, 'binary');
});

app.listen(8888);
console.log('Listening on port 8888');