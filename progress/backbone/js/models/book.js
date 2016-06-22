//创建图书信息的模块
//模块主要用于数据处理

var app = app||{};

app.Book = Backbone.Model.extend({
   defaults:{
       coverImage:'img/1.jpg',
       title:'美人鱼',
       author:'星爷',
       releaseDate:'2016',
       keywords:'保护海洋跨年电影'
   }
});
