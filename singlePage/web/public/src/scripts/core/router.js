/**
 *  @fileOverview : Router模块相关的工具方法
 *  @author : Sunwenchao
 *  @version : 0.1.0
 */
define([''], function () {

    // 将路由列表转换为一个方便处理的对象数组，方便对key和回调传参的处理
    var createRouter = function( oriObj ) {

        var handlerList = [];

        var namedParam = /:\w+/g,
            splatParam = /\*\w+/g,
            escapeRegExp = /[-[\]{}()+?.,\\^$|#\s]/g;

        for( var route in oriObj ) {
            var destObj = {};

            var replaceRoute = route.replace( escapeRegExp, '\\$&' )
                .replace( namedParam, '([^\/]+)' )
                .replace( splatParam, '(.*?)' );

            destObj.reg =  new RegExp( '^' + replaceRoute + '$' );

            destObj.callback = oriObj[ route ];

            handlerList.push( destObj );
        }

        return handlerList;
    };

    // 处理createRouter产生的数组 根据传入的url片段匹配 执行回调
    // 处理了 '?' 后参数 构造query对象 传递给处理方法
    var handlePath = function( realPath, handlerList ) {

        realPath = realPath ? realPath : '/'; // 子模块跟请求交给 '/' 匹配处理

        var pathArr = realPath.split( '?' ),
            noQueryPath = pathArr[ 0 ] === '' ? '/' : pathArr[ 0 ], // 交给 '/' 匹配处理
            queryStr = pathArr.length === 1 ? false : pathArr[ 1 ];

        if( queryStr ){
            var queryObj = {},
                queryArr = queryStr.split( '&' );

            _( queryArr ).each( function( str ) {
                var qArr = str.split( '=' );
                queryObj[ qArr[ 0 ] ] = decodeURIComponent(qArr[ 1 ]);
            });
        }

        _.any( handlerList, function( handler ) {
            var routeResult = handler.reg.exec( noQueryPath );

            if ( routeResult ) {
                var thisArgs = routeResult.slice( 1 );
                if( queryObj ) thisArgs.push( queryObj );

                handler.callback.apply( this, thisArgs );
                return true;
            }
        });
    };

    // 对外的接口 API
    return  {
        createRouter:createRouter,
        handlePath: handlePath
    }


});