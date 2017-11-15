/**
 * 弹出框组件
 */
(function($) {

    var Utils = {
        showMask: function() {

            var $mask = $("#mask");

            if( $mask.length === 0 ) {
                $('body').append("<div id='mask' class='mask'></div>");
            }

            $("#mask").css({
                width: Math.max(document.documentElement.scrollWidth, document.documentElement.clientWidth),
                height: Math.max(document.documentElement.scrollHeight, document.documentElement.clientHeight)
            }).show();
        },
        setPosition: function(elem, options) {
            var defaults = {target: null, offset: {left: 0, top: 0}, container: $(document.body), position: "bottom"},

                opts = $.extend({}, defaults, options),

                left, top;

            if (null !== opts.target) {
                var offset = opts.target.offset(),

                    position = opts.position;

                if (position === "left") {
                    left = offset.left - elem.width();
                    top = offset.top;

                } else if (position === "right") {
                    left = offset.left + opts.target.outerWidth();
                    top = offset.top;

                } else if (position === "top") {
                    left = offset.left;
                    top = offset.top - elem.height();

                } else {
                    left = offset.left;
                    top = offset.top + opts.target.outerHeight();
                }

                left += opts.offset.left;
                top += opts.offset.top;

            } else {
                var cwidth = document.documentElement.clientWidth,

                    cheight = document.documentElement.clientHeight,

                    width = elem.width(),

                    height = elem.height();

                left = Math.max(0, (cwidth - width)/2) + document.documentElement.scrollLeft + document.body.scrollLeft;
                top = Math.max(0, (cheight - height)/2) + document.documentElement.scrollTop + document.body.scrollTop;
            }

            elem.css({
                position: 'absolute',
                zIndex: '101'
            });
            elem.offset({
                left : left,
                top : top
            })
        },
        hideMask: function() {
            $("#mask").hide();
        }
    }

    /** dialog 全局静态变量定义 */
    var MASK_HOLD = "mask_hold";

    // 默认值
    var  defaults = {
        // dialog ID
        id: 'labi-dialog',

        // 标题文字
        title: "",

        // 关闭按钮文字
        closeText: '关闭',

        // 内容区域
        content: '',

        height: 'auto',

        width: 300,

        maxHeight: false,

        maxWidth: false,

        minHeight: 150,

        minWidth: 150,

        position: 'center',

        zIndex: 100,

        // dialog样式 宽高在该class中设定
        dialogClass: '',

        // 是否可拖拽
        draggable: true,

        // 是否显示蒙板
        showMask: true,

        // 操作按钮
        // key为buttonValue value为fn
        buttons: {},

        // 按钮引导类型
        btnTypes: false,

        // 其它button面板元素
        otherButtonPaneElem: false,

        // 用来定位的目标对象
        target: null,

        // 是否需要点击dialog外部自动关闭
        autoClose: false,

        // dialog的容器 默认为body
        container: false,

        // 关闭dialog时的回调
        closeDialogCallback: false,

        // 是否显示关闭按钮
        showCloseButton: true,

        // 关闭窗口的时阻止的选项设置 传入要执行的方法
        stopCloseDialog:false,

        // 是否返回dialog实例 默认返回dialog DOM对象
        returnInstance: false,

        contentClass: ""
    };

    /**
     * 弹出窗构造方法
     * @description 样式改版
     * @param options
     * @return dialogDom 返回实例对象 链式调用
     */
    function Dialog(opts){

        this.selfId = opts.id;
        this.dialogDom = $("#" + opts.id);
        this.options = opts;
        this.btnMap = {};
        this._init();

        return this.options.returnInstance ? this : this.dialogDom;
    }

    /**
     * 弹出框实例原型扩展方法
     */
    $.extend(Dialog.prototype, {

        /**
         * 弹出框实例初始化方法
         */
        _init : function(){
            var self = this;
            self._createDialog();
            self._instanceEvent();
        },

        /**
         * 创建实例DOM
         */
        _createDialog : function(){
            var self = this,
                selfContiner = self.options.container || $(document.body),
                selfbtns = self.options.buttons;

            if( self.dialogDom.length > 0 ) {
                self.dialogDom.remove();
            }
            if(typeof selfbtns === 'object' && selfbtns !== null){
                $.each(selfbtns,function(){
                    self.options.hasButtons = true;
                });
            }

            selfContiner.append( juicer( dialog_tmpl, self.options ) );
            self.dialogDom = $("#" + self.selfId);
            self.dialogDom.find(".dialog-content").html(self.options.content);
            self._buttonCreate();
        },

        /**
         * 由_createDialog调用 创建按钮及按钮绑定事件部分
         */
        _buttonCreate : function(){
            var self = this;

            if(self.options.showCloseButton){
                var fn = self.options.stopCloseDialog;

                self.dialogDom.find("#dialog-titlebar-close-a").bind("click", function(e){
                    if(fn){
                        if(fn.apply( this.arguments )){
                            self._close();
                        }
                    }else{
                        self._close();
                    }
                    e.preventDefault();
                    return false;
                });
            }

            if(self.options.hasButtons){
                if(self.options.otherButtonPaneElem){
                    self.dialogDom.find(".dialog-buttonpane").append(self.options.otherButtonPaneElem);
                }
                var btnType = self.options.btnTypes;

                $.each(self.options.buttons, function(name, fn){
                    var button, btnObj = {}, cancelKey = false;

                    btnObj.type = 1;
                    if(name == "取消" || name=="关闭"){// dongzhi 为status sim卡变更时的t关闭渲染成非引导型在此加入
                        btnObj.type = 2;
                        if(!fn){
                            cancelKey = true;
                        }
                    }
                    // 按钮引导类型的设置
                    if( btnType && btnType[ name ] ) btnObj.type = btnType[ name ];

                    btnObj.text = name;
                    button = $( juicer( btn_tmpl, btnObj ) )
                        .attr("newbtn","new")
                        .bind("click", function(e){

                            if($(this).attr("disabled") != "disabled"){
                                var result;
                                if(cancelKey || false !== ( result = fn.apply( this.arguments ))){
                                    self._close();
                                }
                                if(result === MASK_HOLD){
                                    Utils.showMask();
                                }
                            }
                            e.preventDefault();
                        });

                    self.btnMap[name] = button;
                    button.appendTo(self.dialogDom.find(".button-container"));
                });
            }
        },

        /**
         * 根据实例传入的部分属性进行弹出框的处理
         */
        _instanceEvent : function(){
            var self = this,
                selfOpt = self.options;

            //是否显示蒙版
            if(selfOpt.showMask){
                Utils.showMask();
            }

            //设置Dialog位置Utils
            Utils.setPosition(self.dialogDom, {
                target : selfOpt.target,
                container : selfOpt.container
            });

            //显示Dialog
            self.dialogDom.show();

            //是否点击别处自动关闭
            if(selfOpt.autoClose){
                self.dialogDom.autoRemove();
            }

            //是否可拖拽
            if(selfOpt.draggable){
                $(".dialog-title").drag({
                    target : self.dialogDom
                });
            }
        },


        /**
         * 关闭窗口
         */
        _close : function(){
            var self = this;
            if(self.options.showMask){
                Utils.hideMask();
            }
            self.dialogDom.remove();
            if(self.options.closeDialogCallback){
                self.options.closeDialogCallback();
            }
        },

        /**
         *  实例中的按钮点击方法
         */
        triggerClick : function(btnKey){
            var self = this;
            self.btnMap[btnKey].trigger("click");
        }
    });

    /**
     * 弹出窗口 外部调用接口
     * @param options
     */
    window.dialog = function(options){
        return new Dialog( $.extend( {}, defaults, options ) );
    };


    /**
     * 弹出框模版
     * @type {String}
     */
    var dialog_tmpl = '' +
        '<div id = "${id}" class = "dialog ${dialogClass}" style="z-index:${zIndex}">' +
        '<table><tr><td class="dialog-td">' +
        '<div class = "dialog-titlebar">' +
        '<div class = "dialog-title">' +
        '<span>${title}</span>' +
        '</div>' +
        '{@if showCloseButton}' +
        '<a href="javascript:;" id="dialog-titlebar-close-a">' +
        '<div class = "newdialog-titlebar-close">' +
        '</div>' +
        '</a>' +
        '{@/if}' +
        '</div>' +

        '<div class = "dialog-content ${contentClass}">' +

        '</div>' +

        '{@if hasButtons}' +
        '<div class = "dialog-buttonpane">' +
        '<div class="dialog-buttonpane-dashed"></div>' +
        '<div class = "button-container">' +

        '</div>' +
        '</div>' +
        '{@/if}' +
        '</td></tr></table>' +
        '</div>';

    var btn_tmpl = '<a href = "{@if href}${href}{@else}javascript:;{@/if}"' +
        ' {@if id}id = ${id}{@/if} class = "newbtn newbtn-${type} ${cls}">' +
        '${text}' +
        '</a>';


    /*
     蜡笔公用拖拽组件
     */
    (function($){
        var defaults = {
            // 是否可拖拽默认为true
            enable : true,

            // 要拖动的对象，默认为handle的父级的父级元素
            target : null,

            // 回调
            callback : {
                // move时的回调
                onMove : function(e){

                },

                // drop时的回调
                onDrop : function(e){

                }
            }
        };

        $.fn.drag = function(options){
            var opts = $.extend({}, defaults, options);

            return this.each(function(){
                if(opts.enable){
                    var $this = $(this);

                    $this.bind('mousedown', function(e){
                        var target = opts.target || $this.parent().parent(), // 要拖拽的目标对象

                            height = target.outerHeight(),

                            width = target.outerWidth(),

                            offset = target.offset(),

                            left = offset.left,

                            top = offset.top,

                            lastElemLeft = left,

                            lastElemTop = top,

                            // 拖动开始时记录下鼠标的位置以及要拖动对象的位置
                            data = {
                                left : left,
                                top : top,
                                pageX : e.pageX,
                                pageY : e.pageY
                            },

                            // 辅助对象
                            help = $("<div></div>")
                                .appendTo(document.body),

                            $d = $(document),

                            body = document.documentElement || document.body,

                            cw = Math.max(body.scrollWidth, body.clientWidth),

                            ch = Math.max(body.scrollHeight, body.clientHeight),

                            // 拖动事件处理函数
                            handler = {
                                move : function(e){
                                    window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();

                                    left = lastElemLeft + e.pageX - e.data.pageX;
                                    top = lastElemTop + e.pageY - e.data.pageY;
                                    // 防止拖出
                                    if(parseInt(left) < 0) left = 0;
                                    if(parseInt(top) < 0) top = 0;
                                    if(top > ch - height) top = ch - height;
                                    if(left > cw - width) left = cw - width;

                                    help.css({
                                        left: left,
                                        top: top
                                    });

                                    opts.callback.onMove(e);
                                },

                                drop : function(e){
                                    // 删除辅助对象
                                    help.remove();

                                    // 对目标对象进行定位
                                    target.css({
                                        left: left,
                                        top: top
                                    });

                                    var shim = target.data("shim");

                                    if(shim){
                                        shim.css({
                                            left: left,
                                            top: top
                                        });
                                    }

                                    $d.unbind("mousemove", handler.move).css("cursor", "");

                                    opts.callback.onDrop(e);
                                }
                            };

                        $d.css("cursor", "move");

                        /** 设置辅助div的样式 */
                        help.css({
                            height : target.outerHeight(),
                            width : target.outerWidth(),
                            border : "1px dotted #333",
                            position : "absolute",
                            zIndex : parseInt(target.css("z-index")) + 1,
                            left : left,
                            top : top
                        })

                        /** 监听document的mousemove和mouseup */
                        $d.bind('mousemove', data, handler.move).bind('mouseup', data, handler.drop);
                    });
                }
            });
        }
    })(jQuery);

})(jQuery);

