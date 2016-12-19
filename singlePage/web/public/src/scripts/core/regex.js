/**
 * @fileOverview : 蜡笔的正则判断方法集
 * @author : Sunwenchao
 * @version : 0.0.1
 */

var $ = require("jquery");
    $(function() {



    // 正则的字符串
    var PATTERN = {

        url: "((?:https|http)://)?"
            + "(?:[0-9a-z_!~*'()-]+\\.)*" // 域名- www.
            + "(?:[0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\\." // 二级域名
            + "(?:ac|ad|ae|aero|af|ag|ai|al|am|an|ao|aq|ar|arpa|as|asia|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|bi|biz|" +
                    "bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|ca|cat|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|com|coop|cr|cu|cv|" +
                    "cw|cx|cy|cz|de|dj|dk|dm|do|dz|ec|edu|ee|eg|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|" +
                    "gh|gi|gl|gm|gn|gov|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|info|int|io|iq|" +
                    "ir|is|it|je|jm|jo|jobs|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|" +
                    "ma|mc|md|me|mg|mh|mil|mk|ml|mm|mn|mo|mobi|mp|mq|mr|ms|mt|mu|museum|mv|mw|mx|my|mz|na|name|nc|" +
                    "ne|net|nf|ng|ni|nl|no|np|nr|nu|nz|om|org|pa|pe|pf|pg|ph|pk|pl|pm|pn|post|pr|pro|ps|pt|pw|py|" +
                    "qa|re|ro|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|sk|sl|sm|sn|so|sr|st|su|sv|sx|sy|sz|tc|td|tel|tf|" +
                    "tg|th|tj|tk|tl|tm|tn|to|tp|tr|travel|tt|tv|tw|tz|ua|ug|uk|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|" +
                    "xxx|ye|yt|za|zm|zw)" // 顶级域名
            + "(?::[0-9]{1,4})?" // 端口
            + "(?:[/?][0-9A-Za-z_!~*'().;?:@&=+$,%#-]*)*",

        email: "[_a-zA-Z0-9.]+@(?:[_a-z0-9]+\\.)+[a-z0-9]{2,4}",

        phone: "\\+?[0-9]+-?[0-9]{3,18}",

        cn: "[\u4e00-\u9fa5]+",

        mobile: "(12593|12520|10193|17900|17911|17951|125930|125200|101930|179000|179110|179510|(\\+?86))?" +
            "1" +
            "(2|3|4|5|7|8)" +
            "([0-9]{9})"
    };

    $.each( "Url Email Phone CN Mobile".split(" "),
        function( i, v ){
            var k = v.toLowerCase(),
                p = PATTERN[ k ];

            window[ 'is' + v ] = function( s ) {
                return new RegExp( '^' + p + '$' ).test( s );
            }
        }
    );


    })
