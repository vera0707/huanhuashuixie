(function($){
    $(function(){
        function Bubbles(){
            this.init();
        }
        $.extend(Bubbles.prototype,{
            init : function(){
                var self = this;
                $(".bubbles-help").hover(function() {
                    var $this = $(this);
                    self.changeDirection($this);
                },function() {
                    var $this = $(this);
                    $this.find(".interpretation").hide();
                });
            },
            changeDirection : function($item){
                var itemLeft = Number($item.offset().left) - Number(document.body.scrollLeft);
                var showWidth,
                    itemRight,
                    itemConWidth,
                    itemConLeft;
                if (window.innerWidth){
                    showWidth = window.innerWidth;
                }else if ((document.body) && (document.body.clientWidth)){
                    showWidth = document.body.clientWidth;
                }
                itemRight = Number(showWidth) - Number(itemLeft);

                var $con = $item.find(".interpretation-con"),
                    $icon = $item.find(".interpretation-icon");

                itemConWidth = $con.css("width");
                itemConLeft = -(Number(itemConWidth.split("px")[0]) + 66)+"px";

                if( itemLeft > 300){
                    $icon.addClass("interpretation-icon-l");
                    $con.css({
                        "left" : itemConLeft
                    });
                    $item.find(".interpretation").css({
                        "left" : "22px"
                    });
                }
                if( itemRight > 300 ){
                    $icon.removeClass("interpretation-icon-l");
                    $con.css({
                        "left" : "18px"
                    });
                    $item.find(".interpretation").css({
                        "left" : "9px"
                    });
                }
                $item.find(".interpretation").show();

            }
        });
        new Bubbles();

    });
})(jQuery);