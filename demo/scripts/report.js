/**
 * Created by lishuxia on 16/12/16.
 */
// require("onepageCss");
// require("../../styles/report/report.css");
// var $ = require('jquery');
// require('onepageJs');
$(function () {
   function Image() {
       this.init();
   }
    
    $.extend(Image.prototype,{
        init: function () {
            var self = this;

            self.image1();

            $('.main').onepage_scroll({
                sectionContainer : "section",
                updateURL: false,
                animationTime: 600,
                afterMove: function () {
                    var index = $(".onepage-wrapper .active").data("index");
                    self.clearImage();

                    if(index == 1){
                        self.image1();
                    }else if(index == 2){
                        self.image2();
                    }else if(index == 3){
                        self.image3();
                    }else if(index == 4){
                        self.image4();
                    }else if(index == 5){
                        self.image5();
                    }else if(index == 6){
                        self.image6();
                    }

                }
            })
        },
        clearImage: function () {
            $(".page-list").each(function(i,item){
                var $item = $(item);
                $item.hide().removeClass("animated");
                if( $item.hasClass("bounceIn") ){
                    $item.removeClass("bounceIn");
                }else if( $item.hasClass("bounceInLeft") ){
                    $item.removeClass("bounceInLeft");
                }else if( $item.hasClass("bounceInDown") ){
                    $item.removeClass("bounceInDown");
                }else if( $item.hasClass("bounceInRight") ){
                    $item.removeClass("bounceInRight");
                }else if( $item.hasClass("bounceInUp") ){
                    $item.removeClass("bounceInUp");
                }
            });
        },
        image1: function () {
            var self = this;
            self.listNum1 = 1;
            $(".page1-show1").show().addClass("animated bounceInDown");
            var image1Id = setInterval(function () {
                self.listNum1++;
                switch(self.listNum1){
                    case 6:
                        $(".page1-show6").show().addClass("animated bounceInUp");
                        break;
                    case 7:
                        clearInterval(image1Id);
                        break;
                    default:
                        $(".page1-show" + self.listNum1).show().addClass("animated bounceInLeft");
                }
            },300)
        },
        image2: function () {
            var self = this;
            self.listNum2 = 1;
            $(".page2-show1").show().addClass("animated bounceInDown");
            var image2Id = setInterval(function () {
                self.listNum2++;
                switch(self.listNum2){
                    case 2:
                        $(".page2-show2").show().addClass("animated bounceInUp");
                        break;
                    case 9:
                        clearInterval(image2Id);
                        break;
                    default:
                        $(".page2-show" + self.listNum2).show().addClass("animated bounceIn");
                }
            },300)
        },
        image3: function () {
            var self = this;
            self.listNum3 = 1;
            $(".page3-show1").show().addClass("animated bounceInDown");
            var image3Id = setInterval(function () {
                self.listNum3++;
                switch(self.listNum3){
                    case 2:
                        $(".page3-show2").show().addClass("animated bounceInLeft");
                        break;
                    case 3:
                        $(".page3-show3").show().addClass("animated bounceInRight");
                        break;
                    case 4:
                        $(".page3-show4").show().addClass("animated bounceInLeft");
                        break;
                    case 5:
                        $(".page3-show5").show().addClass("animated bounceIn");
                        break;
                    case 6:
                        clearInterval(image3Id);
                        break;
                }
            },300)
        },
        image4: function () {
            var self = this;
            self.listNum4 = 1;
            $(".page4-show1").show().addClass("animated bounceInDown");
            var image4Id = setInterval(function () {
                self.listNum4++;
                switch (self.listNum4){
                    case 2:
                        $(".page4-show2").show().addClass("animated bounceInLeft");
                        break;
                    case 3:
                        $(".page4-show3").show().addClass("animated bounceInRight");
                        break;
                    case 4:
                        $(".page4-show4").show().addClass("animated bounceInLeft");
                        break;
                    case 5:
                        $(".page4-show5").show().addClass("animated bounceIn");
                        break;
                    case 6:
                        clearInterval(image4Id);
                        break;
                }
            },300)
        },
        image5: function () {
            var self = this;
            self.listNum5 = 1;
            $(".page5-show1").show().addClass("animated bounceInDown");
            var image5Id = setInterval(function () {
                self.listNum5++;
                switch(self.listNum5){
                    case 2:
                        $(".page5-show2").show().addClass("animated bounceInLeft");
                        break;
                    case 3:
                        $(".page5-show3").show().addClass("animated bounceInRight");
                        break;
                    case 4:
                        $(".page5-show4").show().addClass("animated bounceInLeft");
                        break;
                    case 5:
                        $(".page5-show5").show().addClass("animated bounceInRight");
                        break;
                    case 6:
                        $(".page5-show6").show().addClass("animated bounceInDown");
                        break;
                    case 7:
                        $(".page5-show7").show().addClass("animated bounceIn");
                        break;
                    case 8:
                        clearInterval(image5Id);
                        break;
                }
            },300)
        },
        image6: function () {
            var self = this;
            self.listNum6 = 1;
            $(".page6-show1").show().addClass("animated bounceInDown");
            var image6Id = setInterval(function () {
                self.listNum6++;
                switch(self.listNum6){
                    case 2:
                        $(".page6-show2").show().addClass("animated bounceInLeft");
                        break;
                    case 3:
                        $(".page6-show3").show().addClass("animated bounceInRight");
                        break;
                    case 4:
                        $(".page6-show4").show().addClass("animated bounceInLeft");
                        break;
                    case 5:
                        $(".page6-show5").show().addClass("animated bounceInRight");
                        break;
                    case 6:
                        $(".page6-show6").show().addClass("animated bounceInLeft");
                        break;
                    case 7:
                        $(".page6-show7").show().addClass("animated bounceInRight");
                        break;
                    case 8:
                        $(".page6-show8").show().addClass("animated bounceInLeft");
                        break;
                    case 9:
                        $(".page6-show9").show().addClass("animated bounceIn");
                        break;
                    case 10:
                        clearInterval(image6Id);
                        break;
                }
            },300)
        }
    });
    
    new Image;
});