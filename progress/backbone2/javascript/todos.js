
$(function(){

    // Todo Model
    // ----------

    // Our basic **Todo** model has `title`, `order`, and `done` attributes.
    var Todo = Backbone.Model.extend({

        // Default attributes for the todo item.
        defaults: function() {
            return {
                title: "empty todo...",
                order: Todos.nextOrder(),
                done: false
            };
        },
        toggle: function() {
            this.save({done: !this.get("done")});
        }

    });


    var TodoList = Backbone.Collection.extend({
        model: Todo,
        localStorage: new Backbone.LocalStorage("todos-backbone"),
        done: function() {
            return this.where({done: true});
        },
        remaining: function() {
            return this.where({done: false});
        },
        nextOrder: function() {
            if (!this.length) return 1;
            return this.last().get('order') + 1;
        },
        comparator: 'order'

    });

    var Todos = new TodoList;

    // Todo Item View
    // --------------

    var TodoView = Backbone.View.extend({

        tagName:  "li",

        template: _.template($('#item-template').html()),

        events: {
            "click .toggle"   : "toggleDone",
            "dblclick .view"  : "edit",
            "click a.destroy" : "clear",
            "keypress .edit"  : "updateOnEnter",
            "blur .edit"      : "close"
        },
        initialize: function() {
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
        },

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            this.$el.toggleClass('done', this.model.get('done'));
            this.input = this.$('.edit');
            return this;
        },

        toggleDone: function() {
            this.model.toggle();
        },
        edit: function() {
            this.$el.addClass("editing");
            this.input.focus();
        },
        close: function() {
            var value = this.input.val();
            if (!value) {
                this.clear();
            } else {
                this.model.save({title: value});
                this.$el.removeClass("editing");
            }
        },

        updateOnEnter: function(e) {
            if (e.keyCode == 13) this.close();
        },

        // Remove the item, destroy the model.
        clear: function() {
            this.model.destroy();
        }

    });

    var AppView = Backbone.View.extend({

        el: $("#todoapp"),
        statsTemplate: _.template($('#stats-template').html()),
        events: {
            "keypress #new-todo":  "createOnEnter",
            "click #clear-completed": "clearCompleted",
            "click #toggle-all": "toggleAllComplete"
        },

        initialize: function() {

            this.input = this.$("#new-todo");
            this.allCheckbox = this.$("#toggle-all")[0];

            this.listenTo(Todos, 'add', this.addOne);
            this.listenTo(Todos, 'reset', this.addAll);
            this.listenTo(Todos, 'all', this.render);

            this.footer = this.$('footer');
            this.main = $('#main');

            Todos.fetch();
        },
        render: function() {
            var done = Todos.done().length;
            var remaining = Todos.remaining().length;

            if (Todos.length) {
                this.main.show();
                this.footer.show();
                this.footer.html(this.statsTemplate({done: done, remaining: remaining}));
            } else {
                this.main.hide();
                this.footer.hide();
            }

            this.allCheckbox.checked = !remaining;
        },
        addOne: function(todo) {
            var view = new TodoView({model: todo});
            this.$("#todo-list").append(view.render().el);
        },
        addAll: function() {
            Todos.each(this.addOne, this);
        },
        createOnEnter: function(e) {
            if (e.keyCode != 13) return;
            if (!this.input.val()) return;

            Todos.create({title: this.input.val()});
            this.input.val('');
        },
        clearCompleted: function() {
            _.invoke(Todos.done(), 'destroy');
            return false;
        },

        toggleAllComplete: function () {
            var done = this.allCheckbox.checked;
            Todos.each(function (todo) { todo.save({'done': done}); });
        }

    });

    var App = new AppView;

});
