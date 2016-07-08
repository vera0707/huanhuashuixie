# 搭个框架

@(welcome)[前端菜鸟|掘金中]

###当下最火的四种框架 angularJS Backbone ReatJS Vue.js三种框架三种风格,框架的魅力在于,一个小小的单页应用系统由己而生

#### AngularJS
    * angularJS的双向数据绑定技术真是棒极了,将精力放在对数据的操作上而不必关心它究竟是怎样做到的,因为angularJS能够快速入门.
    * 入门之后的angularJS想要用的得心应手并不容易,就像已经封装好的页面元素table,要不了多久我们就会觉得用受掌控的div绘制table,比去修改本身的table元素会更方便.
    * 但是绝不否认的是,angularJS对数据的处理绝对一流
    * 我的angularJS项目
        + 启用方式 : npm start
        + 默认端口 : 3000
        + 功能:
            * 登录判断,未登录直接跳转登录页
            * 默认欢迎页
            * 学生信息表的增删查功能
            * 技术
                + 后台
                    * nodeJS
                    * ejs
                + 数据库
                    * MySql
                + 前端
                    * --bower--
                    * AngularJS
                    * Angular-ui-router
                    * jQuery
                    * requireJS
                    * sweetalert
                    * Bootstrap
    * 收获
         + 每当试图通过Dom元素来实现效果时,就要注意这或许已经违背了angularJS本身创建的意图,对数据的操作才是最好的解决途径
         + controller里应该很"干净"
         + 用的angular.each()还是$.each()等



#### backbone
    * 由model/view/collection/route等几部分组成
    * 比较灵活,但是代码量会多一些
    * 依赖underscoreJS
    * 适合大型项目
    * 我的angularJS项目
            + 启用方式 : npm start
            + 默认端口 : 3000
            + 功能:
                * 默认欢迎页
                * 学生信息表的增删查功能
                * 技术
                     + 后台
                       * nodeJS
                       * ejs
                     + 数据库
                        * MySql
                     + 前端
                        * --bower grunt--
                        * backboneJS
                        * undersocre
                        * jQuery
                        * requireJS
                        * juicer
                        * sweetalert
                        * Bootstrap

    * backbone中this的指代问题
    * 正确的路径加载