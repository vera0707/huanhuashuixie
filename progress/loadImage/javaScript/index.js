/**
 * Created by lishuxia on 16/3/21.
 */
(function(){
    var colCount = parseInt(document.documentElement.offsetWidth * 0.9 / 200);   //计算每行盛放图片数量
    var pageHeight = window.screen.availHeight - 90;   //计算展示容器的高度
    var point = 1;
    var heightArray = [];     //盛放高度的数组
    var str = "";     //页面拼接的字符串
    var imgSrc = 0;      //图片地址
    var imgHeight = 0;     //图片高度

//    初始化函数
    function init() {

        var max_H = Math.max.apply(Math, heightArray);    //定义max_H为数组当前最大数
        while (max_H < pageHeight) {               //如果当前屏幕没有占满

            if (point <= colCount) {                     //渲染屏幕第一行图片
                imgSrc = parseInt(Math.random() * 7 + 1);              //随机从7张图片中选取
                imgHeight = parseInt(Math.random() * 100 + 200);             //200-300之间任意尺寸的照片
                str += '<div class="imgLoad-li" style="height:' + imgHeight + 'px;top:0;left:' + 210 * (point - 1) + 'px;;"><img src="img/' + imgSrc + '.jpg" alt=""></div>';
                heightArray.push(imgHeight);            //将当前高度值推到h数组中
                point++;
            }

            else {          //超过第一行以后的图片渲染

                var min_H = Math.min.apply(Math, heightArray);        //定义min_H为数组h中的最小数
                var min_H_index = heightArray[0];                         //初始化数组hz最小值对应的下标

                $.each(heightArray, function (i, value) {
                    if (value == min_H) {
                        min_H_index = i;                        //遍历数组H 找到最小值的小标 并赋值给min_H_index
                    }
                });

                imgSrc = parseInt(Math.random() * 7 + 1);     //随机从7张图片中选取
                imgHeight = parseInt(Math.random() * 100 + 200);  //200-300之间任意尺寸的照片

                str += '<div class="imgLoad-li" style="height:' + imgHeight + 'px;top:' + (min_H + 10) + 'px;left:' + 210 * min_H_index + 'px;"><img src="img/' + imgSrc + '.jpg" alt=""></div>';

                heightArray[min_H_index] += imgHeight + 10;        //增加当前高度,放到对应的数组h中
                max_H = heightArray[min_H_index];
            }

        }
        $("#imgLaod").html(str);       //页面绑定
    }

    $(function () {
        init();//页面加载后,执行函数init
    });

    //定义节流函数

    function throttle(method,context){
        clearTimeout(method.tId);
        method.tId=setTimeout(function(){
            method.call(context);
        },100)
    };

//调整页面大小的事件
    window.onresize = function () {
        var currHeight = window.screen.availHeight - 90;
        if (currHeight < pageHeight) {
            return;
        }
        else {

            colCount = parseInt(document.documentElement.offsetWidth * 0.9 / 200);   //重新计算显示行
            pageHeight = currHeight;                      //重新计算页面高度
            point = 1;                                           //部分数据初始化
            str = "";
            heightArray = [];
           throttle(init,window);    //调用节流函数
        }
    };

//页面鼠标滚动事件
    $(window).on("scroll", function () {
        const page_height = window.screen.availHeight - 90;    //将当前页面高度定为常数
        var scollTop = $(window).scrollTop();               //获得滚动高度
        if (scollTop > 100) {
            pageHeight = page_height + scollTop;             //重计算当前页面高度
            init();                                    //执行init函数
        }
    })
})()

