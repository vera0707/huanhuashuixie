(function($){
    $(function() {

        var navData = {
            containerWidth : 1060,//内容宽度
            navFirScrollList : [726,1301,2168,3531,4005,4553,6830],//一级目录节点
            navSecScroll : {

            }

        };


        //导航位置
        var slideLeft = ($(window).width() - navData.containerWidth )/2 + navData.containerWidth;
        $(".operation-sub").css("left",(slideLeft)+"px");


        //初始位置在顶部
        $('body,html').animate({scrollTop:0},500);
        var indexNum = 0, indexNum2 = 0;


        function light(){
            var $sub = $(".operation-sub"),
                listNum = indexNum + 1;

            //if( indexNum > 0 ){
            $sub.css({"display":"inline-block"});
            $(".operation-nav-li").removeClass("active");
            $(".operation-nav-li.li"+listNum).addClass("active");
            //}else{
            //    $sub.css({"display":"none"});
            //}
        }

        /*
         doc_height是文档的高度，scroll_top是滚动条上部离文档顶部的高度，window_height表示窗口高度。
         当scroll_top == 0 时，表示滚动条已经到达窗口顶部。
         当scroll_top + window_height >= doc_height 时，表示滚动条已经到达窗口底部。
         */

        //判断滚动条是否到达窗口底部
        $(window).bind('scroll', function(){    //绑定滚动事件
            var slideLeft2 = ($(window).width() - navData.containerWidth )/2 + navData.containerWidth;
            $(".operation-sub").css("left",(slideLeft2)+"px");
            if($(document).scrollTop() + $(window).height() >= $(document).height()){
                $(".operation-nav-li").removeClass("active");
                $(".operation-nav-li.li"+navData.navFirScrollList.length).addClass("active");
            }else{
                var top = $(window).scrollTop();
                $.each(navData.navFirScrollList,function(k,v){
                    if(top < v && k == 0){
                        indexNum = 0;
                    }else if( top >= v ){
                        indexNum = k;
                    }
                });

                light();
            }
        });

        $(".operation-nav-li").on("click",function() {
            var $this = $(this),
                liNum = Number($this.data("num")),
                liTopArr = navData.navFirScrollList;

            $('body,html').animate({scrollTop:liTopArr[liNum-1]},500);
        });

    });
})(jQuery);
