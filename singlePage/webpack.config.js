'use strict'

//webpack --display-error-details  查找依赖过程

let webpack = require('webpack');
let path = require('path');
let glob = require("glob");
let fs = require('fs'),
    fileList = {};

//没有js 的html列表避免多余添加发送无意义请求。
let noJsHtml = {};



//插件
let ExtractTextPlugin = require("extract-text-webpack-plugin");
let HtmlWebpackPlugin = require("html-webpack-plugin");
let UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
let CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;



//定义路径 process.cwd() 还可以使用 __dirname
let srcDir = path.join(process.cwd(),"web" ,"public",'src');
let distDir = path.join(process.cwd(),"web" ,"public",'dist');
let nodeModPath = path.resolve(process.cwd(), './node_modules');
let pathMap = require('./web/public/pathMap.json')

//定义js的打包入口文件路径
//遍历路径罗列出所有文件key-value
function walk(path){
    var dirList = fs.readdirSync(path);
    dirList.forEach(function(item){
        if(fs.statSync(path + '/' + item).isDirectory()){
            if(item == "core") {
                return false;
            };
            walk(path + '/' + item);
        }else{
            fileList[item.split('.')[0]] = path + '/' + item;
        }
    });
}
walk(path.resolve('web/public/src/scripts'));
console.log('--------------------------------------------');

function walkHtml(path, r){
    var dirList = fs.readdirSync(path);
    dirList.forEach(function(item){
        if(fs.statSync(path + '/' + item).isDirectory()){
            walkHtml(path + '/' + item, r);
        }else{
            let filePath = path + '/' + item;

            let htmlPrefix = path.split("views/html")[1];

            let conf = {
                template: 'html!' + filePath,
                filename: 'views/html' + htmlPrefix + '/'+item
            }
            
            let htmlItemName = item.split('.')[0];
            if(htmlItemName in fileList ) {
                conf.inject = 'body'
                conf.chunks = ['vendor', htmlItemName]
            } else {
                conf.chunks = [];
            }
            r.push(new HtmlWebpackPlugin(conf))
        }
    });
}



module.exports = (options) => {

    options = options || {}

    let debug = options.debug !== undefined ? options.debug : true

    let publicPath = '/'
    let extractCSS
    let cssLoader
    let sassLoader


    let plugins = (() => {
        let r = []
        walkHtml(path.resolve('web/public/src/views/html'), r);

        return r
    })()


    console.log("Is this a debug mode: " + debug);
    if(debug) {
        extractCSS = new ExtractTextPlugin('styles/[name].css?[contenthash]')
        cssLoader = extractCSS.extract(['css'])
        sassLoader = extractCSS.extract(['css', 'sass'])
        plugins.push(extractCSS, new webpack.HotModuleReplacementPlugin())
    } else {
        extractCSS = new ExtractTextPlugin('styles/[contenthash:8].[name].min.css', {
            // 当allChunks指定为false时，css loader必须指定怎么处理
            // additional chunk所依赖的css，即指定`ExtractTextPlugin.extract()`
            // 第一个参数`notExtractLoader`，一般是使用style-loader
            // @see https://github.com/webpack/extract-text-webpack-plugin
            allChunks: false
        });

        cssLoader = extractCSS.extract(['css?minimize'])
        sassLoader = extractCSS.extract(['css?minimize', 'sass'])

        plugins.push(
            extractCSS,
            new UglifyJsPlugin({
                compress: {
                    warnings: false
                },
                output: {
                    comments: false
                },
                mangle: {
                    except: ['jQuery','$', 'exports', 'Backbone', '_', 'juicer', 'swal']
                }
            }),
            // new AssetsPlugin({
            //     filename: path.resolve(assets, 'source-map.json')
            // }),
            new webpack.optimize.DedupePlugin(),
            new webpack.NoErrorsPlugin()
        )

        plugins.push(new UglifyJsPlugin())
    }


    let config = {
        entry: Object.assign(fileList, {
            // 用到什么公共lib（例如React.js），就把它加进vender去，目的是将公用库单独提取打包
            'vendor': [
                'jquery','underscore','backbone','sweetCss','sweetJs'
            ]
        }),
        resolve: {
            root: [srcDir, nodeModPath, path.resolve(srcDir, '../vendor')],
            alias: pathMap,
            extensions: ['', '.js', '.css', '.scss', '.tpl', '.png', '.jpg']
        },
        output: {
            path: distDir,
            filename: debug? "scripts/[name].js": 'scripts/[chunkhash:8].[name].min.js',
            chunkFilename: debug ? "[chunkhash:8].chunk.js" : "[chunkhash:8].chunk.min.js",
            hotUpdateChunkFilename: debug ? '[id].js' : '[id].[chunkhash:8].min.js',
            publicPath: debug?'/':"/v2/",
            sourceMapFilename: './source.map'
        },
        module: {
            loaders: [
                {
                    test: /\.((woff2?|svg)(\?v=[0-9]\.[0-9]\.[0-9]))|(woff2?|svg|jpe?g|png|gif|ico)$/,
                    loaders: [
                        // url-loader更好用，小于10KB的图片会自动转成dataUrl，
                        // 否则则调用file-loader，参数直接传入
                        'url?limit=20000&name=images/[hash:8].[name].[ext]',
                        'image?{bypassOnDebug:true, progressive:true,optimizationLevel:3,pngquant:{quality:"65-80",speed:4}}'
                    ]
                },
                {
                    test: /\.((ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9]))|(ttf|eot)$/,
                    loader: 'url?limit=10000&name=fonts/[hash:8].[name].[ext]'
                },
                {test: /\.(tpl|ejs)$/, loader: 'ejs'},
                {test: /\.css$/, loader: cssLoader},
                {test: /\.scss$/, loader: sassLoader},
                {test:  /\.js[x]?$/, exclude: /node_modules/,loader: 'babel?compact=false,presets[]=react,presets[]=es2015'}
            ]
        },
        plugins: [
            // new webpack.optimize.CommonsChunkPlugin(/* chunkName= */"vendor", /* filename= */"vendor.bundle.js"),
            // new HtmlWebpackPlugin({
            //     filename: 'index.html',
            //     template: 'html!./public/src/views/index.html',
            //     inject: 'body',
            //     chunks: ['vendor']
            // })

            // new CommonsChunkPlugin({
            //     name: 'common',
            //     chunks: ['a', 'b']
            // }),
            new CommonsChunkPlugin({
                 name: 'vendor',
                 chunks: Object.keys(fileList)
            })

        ].concat(plugins),

        devServer: {
            hot: true,
            noInfo: false,
            inline: true,
            publicPath: publicPath,
            stats: {
                cached: false,
                colors: true
            }
        }
    };


    if(debug) {
        (function(entry) {
            for (let key of Object.keys(entry)) {
                if (! Array.isArray(entry[key])) {
                    entry[key] = Array.of(entry[key])
                }
                entry[key].push('webpack-hot-middleware/client?reload=true')
            }
        })(config.entry);

        // ((entry) => {
        //     for (let key of Object.keys(entry)) {
        //         if (! Array.isArray(entry[key])) {
        //             entry[key] = Array.of(entry[key])
        //         }
        //         entry[key].push('webpack-hot-middleware/client?reload=true')
        //     }
        // })(config.entry);

        config.plugins.push( new webpack.HotModuleReplacementPlugin() )
        config.plugins.push( new webpack.NoErrorsPlugin() )
    }

    return config;
};



//为用到的插件或者 loader  expose-loader 暴露到全局变量, providePlugin 如果想在js中使用$,将$与jquery对应起来
//如果你想将react分离，不打包到一起，可以使用externals。然后用<script>单独将react引入

// {
//     test: path.join(config.path.src, '/js/common/report'),
//         loader: 'expose?report'
// },
// new webpack.ProvidePlugin({
//     "R": "report",
// }),