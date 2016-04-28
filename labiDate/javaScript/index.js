/**
 * Created by lishuxia on 16/3/15.
 */
//month为目标月数  如三月 month=3;

//定义显示月份信息的方法
function drowMonth(month){
    //初始化数组
    $("#data-table-month-2").html();     //清空页面内容
    var datas=[];                           //定义盛放日期的数组datas,并初始化
    datas.length=42;                        //默认数组长度42
    $.each(datas,function(i){
        datas[i]={index:i,dataList:[]};      //定义数组格式 存放标识i 和 相关信息 dataList
    });


    var dataDays=new Date(2016,month,0).getDate();  //获取当月共有多少天

    month--;            //将传入的月份减1,使之符合Date的时间设定标准

    //获取当月第一天
    var data=new Date(2016,month,1);      //定义data变量为当月第一天
    var firstDay=data.getDay();   //定义firstDay 为当月第一天的周次

    var lunar=new CalConverter();       //调用CalConverter 方法

    for(var i=1;i<=dataDays;i++){              //循环本月天数
        var currLunar=lunar.solar2lunar(new Date(2016,month,i));   //根据日期获取详细日期信息
        datas[firstDay].dataList=currLunar;         //从第firstDay+1天开始,依次将日期详细信息插入数组datas中
        firstDay++;                                 //移动数组下标倒数datas为空的个数,初始为0
    }


    //判断页面共显示有多少行（5行或者6行）
    var i=datas.length-1;                   //定义i为数组遍历下标,从数组最后一个开始
    var count=0;                            //定义count为dats数组尾部为空的个数
    while(datas[i].dataList.length==0){     //将数组datas倒序遍历,查找dataList为空的个数.直到不为空
        count++;
        i--;
    }

   if(count>=7){                            //如果数组最后超过有七个为空,说明应显示五行,否则依然显示六行
       datas=datas.slice(0,35);
   }

   // 定义页面渲染的模板
    var tmpl=[
        '{@each datas as data,index}',
            '{@if index%7==0}',
            ' <div class="data-month-col">',
            '{@/if}',
                '{@if data.dataList.length!=0}',
                ' <div class="data-month-block">',
                '    <div class="data-month-block-time bg-blue-lighter text-right">',
                '    <span class="data-month-icon-1 data-clound"></span>',
                '    <span class="data-month-icon-1 data-cycle"></span>',
                        '{@if data.dataList.solarFestival!=""}',
                        '<span>${data.dataList.solarFestival}</span>',
                        '{@else if data.dataList.solarTerms!=""}',
                        '<span>${data.dataList.solarTerms}</span>',
                        '{@else}',
                        '    <span>${data.dataList.lunarDay}</span>',
                        '{@/if}',
                        '<span class="data-month-number">${data.dataList.sDay}</span>',
                        '</div>',
                    '</div>',
                '{@else}',
                ' <div class="data-month-block bg-blue-dark"></div>',
                '{@/if}',
            '{@if index==6||index==13||index==20||index==27||index==34}',
            '</div>',
            '{@/if}',
        '{@/each}'
    ].join("");


    var htmlStr=juicer(tmpl,{datas:datas});
    $(".data-month-group-list").html(htmlStr);   //将内容渲染到指定页面中
}



$(".month-click").on('click',function(){

    $(".month-effect").removeClass("active");                //清空所有选中月份
    $(this).children(".month-effect").addClass("active");    //为当前选中月份添加类样式

    var month=parseInt($(this).children(".month-effect").html());     //获取当前选中月份
    drowMonth(month);                                                    //调用drowMonth函数,渲染页面

})


//默认显示四月

$(function(){//页面加载后默认显示4月
    var currMonth=new Date().getMonth();
    $(".month-effect:eq("+currMonth+")").addClass("active");    //选中当前月份
    currMonth++;
    drowMonth(currMonth);                                    //执行页面渲染函数
})

