var app = app||{};

app.LibraryView = Backbone.View.extend({

    el:'#books',

    initialize:function(initialBooks){
        this.collection = new app.Library(initialBooks);
        this.render();
        this.listenTo(this.collection,'add',this.renderBook);
    },

    render:function(){
        this.collection.each(function(item){
            this.renderBook(item);
        },this);
    },

    renderBook:function(item){
      var bookView = new app.bookView({
          model:item
      });
        this.$el.append(bookView.render().el);
    },
    events:{
        'click #add':'addBook'
    },
    addBook:function(e){
        e.preventDefault();
        var formData = {};

        $('#addBook div').children('input').each(function(i,el){
            if($(el).val()!=''){
                formData[el.id] = $(el).val();
            }
        });
        this.collection.add(new app.Book(formData));
    },
});
