/**
 * Created by lishuxia on 17/4/10.
 */
(function($){
    $(function(){

        //var baoshou = require('../../images/about/riskAssessment/fengxian_1baoshou.png');

        var riskDialogTmpl = [
            '{@if type == "result"}',
            '<div class="risk-dialog-result">',
                '<div class="risk-dialog-date">${data.riskAssessmentTime | getTime}</div>',
                '<div>根据风险评估结果判断，您的投资风险为</div>',
                //'{@if data.rating == "保守型"}<img src="'+ baoshou +'" class="w100" alt="" />',
                //'{@else if data.rating == "谨慎型"}<img src="' + jinshen + '" class="w100" alt="" />',
                //'{@else if data.rating == "稳健型"}<img src="' + wenjian + '" class="w100" alt="" />',
                //'{@else if data.rating == "进取型"}<img src="' + jinqu + '"  class="w100" alt="" />',
                //'{@else if data.rating == "激进型"}<img src="'+ jijin +'" class="w100" alt="" />{@/if}',
                '<img src="./images/fengxian_4jinqu.png" alt="" class="mt30"/>',
                '<div class="clearfloat mt30">',
                    '<a href="/" class="risk-dialog-btn-l f-l">我要投资</a>',
                    '<a href="/" class="risk-dialog-btn-r f-r">重新评估</a>',
                '</div>',
            '</div>',
            '{@else if type == "warn"}',
            '<div class="risk-dialog-warn">',
                '<div class="">${data}</div>',
                '<div class="risk-dialog-warn-btn">确定</div>',
            '</div>',
            '{@/if}'
        ].join("");

        juicer.register('getTime', function (time) {
            var d = new Date(time),
                newDate = d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日';
            return newDate;
        });


        function Risk(){
            this.answerData = {};
            this.init();
        }
        $.extend(Risk.prototype,{
           init:function(){
               var self = this;
               self.bindEvent();
           },
            bindEvent:function() {
                var self = this;
                $('.risk-btn').on('click',function(){
                    var data = {};
                    data = self.checkQues();

                    if(data && data != ''){
                        self.answerData = data;
                        console.log(self.answerData);
                        self.ajaxAnswer();
                    }
                });

                $('input[type=radio]+label').on('click',function(){
                    $('.risk-animate-twinkle').removeClass('risk-animate-twinkle');
                });
            },
            checkQues: function(){
                var self = this,
                    answerData = {};
                for(var  i = 1; i < 6; i++){
                    if($('input[name=r-group-' + i + ']').is(':checked')){
                        var  value = $('input[name=r-group-' + i + ']:checked').val();
                        switch(i){
                            case 1: answerData.question_1 = value;break;
                            case 2: answerData.question_2 = value;break;
                            case 3: answerData.question_3 = value;break;
                            case 4: answerData.question_4 = value;break;
                            case 5: answerData.question_5 = value;break;
                        }
                    }else{
                        $('.risk-list-title').eq(i-1).addClass('risk-animate-twinkle');
                        return '';
                    }
                }

                return answerData;
            },
            ajaxAnswer: function(){
                var answer = {
                    rating: '稳健型',
                    riskAssessmentTime: 1491976801734
                };

                $('.mask').show();

                var resultHtml = juicer(riskDialogTmpl, {
                    type: 'warn',
                    data: '少壮不努力,就去卖红薯'
                });

                $('.risk-dialog').html(resultHtml);
            }
        });

        new Risk();
    })
})(jQuery);