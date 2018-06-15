var express = require('express');
var nodeExcel = require('excel-export');  //excel到处插件
var app = express();

app.get('/excel', function(req, res){
    //基本excel规则
    var conf = {};
    conf.stylesXmlFile = "styles.xml";
    conf.cols = [{
        caption: '督导号',    //行名称
        type:'number',       //类型
        width: 15,   //宽度
        beforeCellWrite:function(row, cellData){  //处理数据
            return cellData; //数据大写
        }
    }];

    var row = [];

    for(var i = 0;i < 700;i++){
        row.push( [parseInt(Math.random()*(3-1) +1)]  );
    }

    for(var y = 700;y < 1500;y++){
        row.push( [parseInt(Math.random()*(6-1) +1)] );
    }

    for(var z = 1500;z < 4000;z++){
        row.push( [parseInt(Math.random()*(10-1) +1)] );
    }


    // console.log(row);
    conf.rows = row;

    var result = nodeExcel.execute(conf);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats');
    res.setHeader("Content-Disposition", "attachment; filename=" + "dudaohao.xlsx");
    res.end(result, 'binary');
});

app.listen(8888);
console.log('Listening on port 8888');