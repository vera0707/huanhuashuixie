/**
 * Created by lishuxia on 2017/9/6.
 */
'use strict'

var webpack = require("webpack");
var path = require('path');
var glob = require("glob");   //通配文件路径的插件
var fs = require('fs'),
    fileList = {};

//没有js 的html列表避免多余添加发送无意义请求。
var noJsHtml = {};




//插件var
var ExtractTextPlugin = require("extract-text-webpack-plugin");   //独立打包样式文件
var HtmlWebpackPlugin = require("html-webpack-plugin");
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;    // JS与CSS的压缩
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;


//定义路径 process.cwd() 还可以使用 __dirname
var srcDir = path.join(process.cwd(), "public",'src');
var distDir = path.join(process.cwd(),"public",'dist');
//var nodeModPath = path.resolve(process.cwd(), './node_modules');

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
    })
}
walk(path.resolve('web/public/src/scripts'));
console.log('--------------------------------------------');

var entry_map = {
    entry: __dirname + "/public/src",          //入口文件
    output: {                              //配置打包的结果
        path:  __dirname + "/build/dist",         //定义输出的文件路径
        filename: "[name].js"       //定义输出的文件名
    },
    devtool: 'none',
    devServer: {
        contentBase: "./public", //本地服务器所加载的页面所在的目录
        historyApiFallback: true, //不跳转
        inline: true,
        hot: true
    },
    module: {                                 //定义对模块的处理逻辑
        loaders: [{
            test: /(\.jsx|\.js)$/,            //正则表达式，用于匹配到的文件

            use: {
                loader: "babel-loader",
                options: {
                    modules: true
                }
            }
        },{
            loader: "postcss-loader"
        }]
    },
    plugins:[  //定义插件
        new webpack.ProvidePlugin({
            $: 'jquery'
        })
    ],

}