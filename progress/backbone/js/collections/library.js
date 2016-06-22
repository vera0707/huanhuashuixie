//'图书馆'主要用于盛放图书
//是book视图的集合

var app = app||{};

app.Library = Backbone.Collection.extend({
   model:app.Book
});
