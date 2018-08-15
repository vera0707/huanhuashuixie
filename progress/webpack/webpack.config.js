const path = require("path");

module.exports = {

    entry: {
        index: './src/index.js'
    },

    output: {
       path: path.resolve(__dirname,'dist'),
        filename: 'bundle.js'
    },

    module:{

    },
   plugins: [

   ],

   devServer: {

   },

    mode: "production"

    plugins:[
        new HtmlWebpackPlugin({
            template: __dirname + "/app/index.tmpl.html" //new 一个这个插件的实例，并传入相关的参数
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new ExtractTextPlugin("style.css")
    ]
};