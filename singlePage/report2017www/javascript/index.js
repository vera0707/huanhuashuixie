(function($){
    $(function() {

        var navData = {
            containerWidth : 830,//内容宽度
            navFirScrollList : [5,560,1012,1700,2320,2896,3947],//一级目录节点
            navSecScroll : {

            }

        };

        var screenWidth = document.body.scrollWidth;
        if(screenWidth < 1300){
            $('.w90').css('width','95%');
            navData.navFirScrollList = []
        };


        var $sub =  $(".operation-sub");
        //if(screenWidth >= 1350){
            var slideLeft = ($(window).width() - navData.containerWidth )/2 + navData.containerWidth;
            $sub.css("left",(slideLeft)+"px");
        //}else{
        //    $sub.hide();
        //}

        $('body,html').animate({scrollTop:0},500);
        var indexNum = 0, indexNum2 = 0;


        function light(){
            var $sub = $(".operation-sub"),
                listNum = indexNum + 1;

            //if(document.body.scrollWidth >= 1350){
                $sub.css({"display":"inline-block"});
            //}
            $(".operation-nav-li").removeClass("active");
            $(".operation-nav-li.li"+listNum).addClass("active");
        }

        $(window).bind('scroll', function(){    //绑定滚动事件
            //var slideLeft2 = ($(window).width() - navData.containerWidth )/2 + navData.containerWidth;
            //$(".operation-sub").css("left",(slideLeft2)+"px");
            var $sub =  $(".operation-sub");
            //if(document.body.scrollWidth >= 1350){
                var slideLeft = ($(window).width() - navData.containerWidth )/2 + navData.containerWidth;
                $sub.css("left",(slideLeft)+"px");
            //}else{
            //    $sub.hide();
            //}

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
