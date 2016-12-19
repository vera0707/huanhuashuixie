(function($){
    $(function(){
        function Countdown(nowStamp,$item){
            this.nowStamp = nowStamp;
            this.init($item);
        }
        $.extend(Countdown.prototype,{
            init: function($item) {
                var self = this;

                var data = self.setInterTime($item);

                $item.find(".hour1").text(data.hour1);
                $item.find(".hour2").text(data.hour2);

                $item.find(".min1").text(data.min1);
                $item.find(".min2").text(data.min2);

                $item.find(".sec1").text(data.sec1);
                $item.find(".sec2").text(data.sec2);

                self.nowStamp+=1*1000;
                if(!data.isOver){
                    self.dealLastTime($item);
                }

            },
            dealLastTime: function($item) {
                var self = this;
                var countdownId = setInterval(function() {
                    var data = self.setInterTime($item);
                    $item.find(".hour1").text(data.hour1);
                    $item.find(".hour2").text(data.hour2);

                    $item.find(".min1").text(data.min1);
                    $item.find(".min2").text(data.min2);

                    $item.find(".sec1").text(data.sec1);
                    $item.find(".sec2").text(data.sec2);
                    if(data.isOver == true){
                        clearInterval(countdownId);
                    }

                    self.nowStamp+=1*1000;
                },1*1000);



            },
            changeTimeType:function(str,type) {
                //2014.04.14 00:00
                var str1,
                    str2 = str.split(" ")[1].split(":");
                if(type == 1){
                    str1 = str.split(" ")[0].split(".");
                }
                //2014-04-14 00:00
                if(type == 2){
                    str1 = str.split(" ")[0].split("-");
                }

                return str1[0]+"/" + str1[1] + "/" + str1[2] + " " + str2[0]+":" + str2[1] + ":00";
            },
            setInterTime: function($item) {
                var self = this;
                var timeStr = $item.data("saletime");
                var timeStrN = '' + timeStr;
                var lastTime;

                if(timeStrN.indexOf("-") > 0){
                    lastTime = self.changeTimeType(timeStr,2);
                }else if(timeStrN.indexOf(".") > 0){
                    lastTime = self.changeTimeType(timeStr,1);
                }else{
                    lastTime = timeStr;
                }

                var nowDate = new Date(self.nowStamp);
                var date = new Date(lastTime);

                var milSecond = date.getTime() - nowDate.getTime();

                var tmpObj = {};

                if(milSecond > 0){

                    var hour = Math.floor(milSecond/(1000*60*60)),
                        tmpSecond = Math.floor(milSecond%(1000*60*60)),
                        minutes = Math.floor(tmpSecond/(1000*60));

                    var seconds = Math.floor((milSecond - hour*1000*60*60 - minutes*1000*60)/1000);

                        if( hour < 10 ) {
                            tmpObj.hour1 = "0";
                            tmpObj.hour2 = ""+(hour==0?"0":hour);
                        } else if( hour >= 10 && hour < 100 ){
                            tmpObj.hour1 = Math.floor(hour/10);
                            tmpObj.hour2 = hour%10;
                        } else {
                            var tmp = hour%100;
                            tmpObj.hour1 = ("" + tmp).slice(0,1);
                            tmpObj.hour2 = ("" + tmp).slice(1);
                        }

                        if( minutes < 10 ) {
                            tmpObj.min1 = "0";
                            tmpObj.min2 = ""+ (minutes==0?"0":minutes);
                        } else if( minutes >= 10 && minutes < 100 ){
                            tmpObj.min1 = ("" + minutes).slice(0,1);
                            tmpObj.min2 = ("" + minutes).slice(1);
                        }

                        if( seconds < 10 ) {
                            tmpObj.sec1 = "0";
                            tmpObj.sec2 = ""+ (seconds==0?"0":seconds);
                        } else if( seconds >= 10 && seconds < 100 ){
                            tmpObj.sec1 = ("" + seconds).slice(0,1);
                            tmpObj.sec2 = ("" + seconds).slice(1);
                        }

                        if( tmpObj.hour1 == '0' && tmpObj.hour2 =='0'&& tmpObj.min1=='0' &&tmpObj.min2=='0' && tmpObj.sec1 =='0'&& tmpObj.sec2=='0' ) {
                            location.reload(true);
                        }
                        return tmpObj;
                }else{
                    tmpObj.hour1 = '0';
                    tmpObj.hour2 ='0';
                    tmpObj.min1 ='0';
                    tmpObj.min2 ='0';
                    tmpObj.sec1 ='0';
                    tmpObj.sec2 ='0';
                    tmpObj.isOver = true;
                    return tmpObj;
                }
            }

        });
        window.countDownInt = function(nowStamp,$item){
            new Countdown(nowStamp,$item);
        };
    });
})(jQuery);