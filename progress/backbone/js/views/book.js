//绘制生成每个图书的视图
//将会呈现在页面上

var app = app ||{};

app.bookView = Backbone.View.extend({
    tagName:'div',
    className:'bookContainer',
    template: _.template($('#bookTemplate').html()),

    events:{
        'click .delete':'deleteBook'
    },

    render:function(){
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },

    deleteBook:function(){
        this.model.destroy();
        this.remove();
    }
});
