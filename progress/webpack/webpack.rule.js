/**
 * Created by xieyuxuan on 2018/6/24.
 */
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const rules = {
    rules : [{
        test: /\.css$/,
        //use: [ 'style-loader','css-loader','postcss-loader' ]
        use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: ['css-loader','postcss-loader'],
            publicPath: '../'
        })
        //use: [
        //	MiniCssExtractPlugin.loader,
        //	"css-loader"
        //]
    },{
        test: /\.less$/i,
        use:
        //{ loader: 'style-loader' },
        //{ loader: 'css-loader' },
        //{ loader: 'less-loader' }
            ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: ['css-loader','less-loader','postcss-loader']
            })

    },{
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: ['css-loader','sass-loader','postcss-loader']
        })
        //use: [
        //	"style-loader",
        //	"css-loader",
        //	"sass-loader"
        //]
    },{
        test: /\.(js|jsx)$/,
        use: ['babel-loader'],
        exclude: /node_modules/
    },{
        test: /\.(png|jpg|gif)$/i,
        use:[{
            loader: 'url-loader',
            options: {
                limit: 50000,
                outputPath: 'images'
            }
        }]
    }]
};

module.exports = rules;