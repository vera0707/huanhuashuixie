/**
 * Created by lishuxia on 17/2/17.
 */
//$(function(){
    //轮播图
    function indexIconChage() {

        var flagId = 0;

        var timerId = setInterval(function() {
            if( flagId < (Number(4) - 1) ) {
                flagId++;
            } else {
                flagId = 0;
            }

            var $active = $(".icon-active");
            var nextNum = flagId + 1;

            $("#carousel_"+flagId).fadeOut(800);
            $(".topIcon").removeClass("icon-active");
            $("#carousel_"+nextNum).addClass("icon-active").fadeIn(800);



            //轮播图的指示圆点
            $(".carousel-point-li").removeClass("carousel-point-li-active");
            $(".carousel-point-" + (flagId+1)).addClass("carousel-point-li-active");
        },5000);




        $(".carousel-point-li").click(function() {
            var index =$(this).data("index");
            flagId = index - 1;


            var $active = $(".icon-active");
            var actIndex = $active.data('index');
            var nowNum = Number($active.attr("id").split("carousel_")[1]);

            $("#carousel_"+nowNum).removeClass("icon-active").fadeOut(800);
            //$(".topIcon").removeClass("icon-active").fadeOut(800);
            $("#carousel_"+index).addClass("icon-active").fadeIn(800);

            $(".carousel-point-li").removeClass("carousel-point-li-active");
            $(this).addClass("carousel-point-li-active");
        })
    }

    indexIconChage();


    <!--平台公告 滚动信息条-->
    var wap = $('#recoder_con'),
        ul1Html = $('#recoder_ul1').html(),
        ul2 = $('#recoder_ul2');

    var speed = 50,             //滚动速度
        listNum = 4,        //信息条长度
        delay = 1000,
        liHeight = 21,
        time,
        scrollTop = 0;

    ul2.html(ul1Html);

    function startScroll() {
        time = setInterval("scrollUp()", speed);
        wap.scrollTop(scrollTop++);

        console.log('1');
    }
    function scrollUp(){
        console.log('2');
        if(scrollTop % liHeight == 0){
            clearInterval(time);
            setTimeout(startScroll,delay);
        }else{
            wap.scrollTop(scrollTop++);
            if(scrollTop >= (listNum -1) * liHeight){
                scrollTop = 0;
                wap.scrollTop(scrollTop);
            }
        }
    }

    var timer = setTimeout('startScroll()', delay);

//});