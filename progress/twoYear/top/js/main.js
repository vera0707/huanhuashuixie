(function(){
    $(function(){
        //编写假数据
        var information = [
            {'name':'爱德华','date':'2016.04.21','content':'推荐红包'},
            {'name':'大时代','date':'2016.04.21','content':'推荐红包'},
            {'name':'大多','date':'2016.04.21','content':'推荐红包'},
            {'name':'大大','date':'2016.04.21','content':'推荐红包'},
            {'name':'阿萨德','date':'2016.04.21','content':'推荐红包'},
            {'name':'地方','date':'2016.04.21','content':'推荐红包'},
            {'name':'大声的我','date':'2016.04.21','content':'推荐红包'},
            {'name':'TT如','date':'2016.04.21','content':'推荐红包'},
            {'name':'于仁泰','date':'2016.04.21','content':'推荐红包'},
            //{'name':'撒旦法热','date':'2016.04.21','content':'推荐红包'},
            //{'name':'发水电','date':'2016.04.21','content':'推荐红包'},
            //{'name':'感叹号','date':'2016.04.21','content':'推荐红包'},
            //{'name':'梵蒂','date':'2016.04.21','content':'推荐红包'},
            //{'name':'丰哥','date':'2016.04.21','content':'推荐红包'}
        ];

        information.forEach(function(val){
           var count = parseInt(Math.random()*20 + 1);
            val.content = val.content + count +'元';
       });

        //juicer画页面
        var infolength = information.length;


        var temp = [
            '{@each dates as date}',
                    '<div class="time-table-group  clearfloat">',
                        '<div class="time-table-a f-l">${date.name}</div>',
                        '<div class="time-table-b f-l">${date.date}</div>',
                        '<div class="time-table-c f-r">${date.content}</div>',
                    '</div>',
            '{@/each}'
        ].join('');

        var htmlStr = juicer(temp,{dates:information});
        var index = 2;
        var str = '<div class="group">'+htmlStr+'</div>';
        $('.time-body-block').append(str).append(str);
        //自动轮播
        var i = 0;
        var time = null;
        var top = 0;

        function autoScroll(){

            time=setInterval(function(){
                if(parseInt(top)<=-(180*index)){
                    $('.time-body-block').append(str);
                    index++;
                }
                top -= 2;
                i++;
                   $('.time-body-block').css('top',top+'px');
            },65)


        };
        autoScroll();

        $('.time-table-body').on('mousemove',function(){
            clearInterval(time);
            alert('停下来');
        })
    })

})(jQuery);
