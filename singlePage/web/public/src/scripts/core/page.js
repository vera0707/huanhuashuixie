/**
 * @fileOverview : 蜡笔的分页组件
 * @author : Sunwenchao
 * @description : 根据配置生成分页组件
 */
(function($) {
    $(function() {



    var bodyClick = L.bodyClick;

    // 默认配置
    var DEFAULT = {

        container : false,

        current_page : 1,

        max_page : false,

        view_string : '{current_page} / {max_page}',

        pageFn : function( p ) { return false; },

        show_single_page : false
    };

    /**
     * Page 组件构造方法
     * @param opts
     * @constructor
     */
    function Page( opts ) {

        var self = this;

        for( opt in opts ) { self[ opt ] = opts[ opt ] };

        self.max_page = parseInt( self.max_page );
        self.current_page = parseInt( self.current_page );

        if( self.max_page < 2 ) self.max_page = 1;

        self._init();
    }

    // 原型方法
    _.extend( Page.prototype, {

        // 初始化
        _init : function() {

            var self = this;

            $.each( self.container, function( $i, dom ) {

                self._render2container( $( dom ) );
            });
        },

        // 渲染分页组件
        _render2container : function( $dom ) {

            var self = this,
                viewStr = self._getViewStr();

            var tmplObj = {
                current_page: self.current_page,
                max_page: self.max_page,
                viewStr: viewStr
            };

            var $pageDom = $( juicer( pageTmpl, tmplObj ) );

            $dom.html( $pageDom );

            self._AddPageEvent( $dom );

            self._pageBtnGrey();
        },

        // 增加分页组件的事件绑定
        _AddPageEvent : function( $pageDom ) {

            var self = this,
                $link = $pageDom.find( '.pagetool-select-con' ),
                $con = $pageDom.find( '.pagetool-select' );


            $link.click( function() {
                $con.toggle()
            });

            bodyClick( [ $link ], function() {
                $con.hide()
            });

            $pageDom.find( '.pre_link' ).click( function() {
                self.changePage( 'pre' )
            });

            $pageDom.find( '.next_link' ).click( function() {
                self.changePage( 'next' )
            });

            $pageDom.find( '.pagetool-select-li' ).hover( function() {

                $(this).addClass( 'pagetool-select-li-active' )
            }, function() {

                $(this).removeClass( 'pagetool-select-li-active' )
            }).click( function() {

                self.changePage( $( this ).attr( 'pid' ) )
            });
        },

        // 更改页的动作处理
        changePage : function( pageNum ) {

            var self = this,
                cp = this.current_page;

            if ( pageNum === 'next' ) {

                if( cp === self.max_page ) return false;

                this.current_page++;

            } else if ( pageNum === 'pre' ) {

                if( cp === 1 ) return false;

                this.current_page--;

            } else {

                var pn = parseInt( pageNum );

                if( pn === cp ) return false;

                this.current_page = pn;
            }

            self._afterChangePage();
        },

        // 更改页后的处理
        _afterChangePage : function() {

            var self = this;

            self._pageBtnGrey();

            $( '.page_string' ).html( self._getViewStr() );

            self.pageFn.call( null, self.current_page );
        },

        // 第一页最后一页 置灰效果处理
        _pageBtnGrey : function() {

            var self = this,
                cp = self.current_page;

            $( '.pre_link, .next_link' ).removeClass( 'page-link-grey' );

            if( cp === 1 ) {
                $( '.pre_link' ).addClass( 'page-link-grey' );
            }

            if ( cp === self.max_page ) {
                $( '.next_link' ).addClass( 'page-link-grey' );
            }
        },

        // 页码文字显示
        _getViewStr : function() {
            var self = this;

            return self.view_string
                .replace( '{current_page}', self.current_page )
                .replace( '{max_page}', self.max_page );
        }




    });



    // 对外初始化接口
    window.page = function( options ) {

        var opts = _.extend( {}, DEFAULT, options );

        return new Page( opts );
    };


    // template ---
    var pageTmpl = '<div class="button-group">' +
        '<span class="btn pre_link">&lt;</span>' +
        '<span class="pagetool-select-con inline-block">' +
            '<span class="page_string">${viewStr}</span>' +
            '<span></span>' +
            '<div class="pagetool-select"><ul>$${max_page|page_item_li}</ul></div>' +
        '</span>' +
        '<span class="btn next_link">&gt;</span>' +
        '</div>';

    // template helper
    var page_item_li = function( max ) {
        var html = '';

        for( var i = 1; i <= max; i++ ) {
            html += '<li class="pagetool-select-li" pid="' + i + '">' + i + ' / ' + max + '</li>';
        }
        return html;
    };

    juicer.register( 'page_item_li', page_item_li );

    });
})(jQuery);