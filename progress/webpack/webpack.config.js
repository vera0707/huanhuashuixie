const path = require("path");
const glob = require('glob');
const webpack = require('webpack');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
//const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const PurifyCSSPlugin = require('purifycss-webpack');
const RuleConfig = require('./webpack.rule.js');

module.exports = {
	entry: ['./src/index.js'],
	output:{
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].bundle.js'
	},
	devServer: {
		contentBase: path.resolve(__dirname,'dist'),
		host: 'localhost',
		port: '8090',
		open: true,
		hot: true
	},
	module: RuleConfig,
	//devtool: 'source-map',
	plugins:[
		//new UglifyJsPlugin(),
		new webpack.HotModuleReplacementPlugin(),
		new CleanWebpackPlugin(['dist']),
		new HtmlWebpackPlugin({
				//chunks: ['index'],
                //filename: 'index.html',
		        template: './src/index.html',
				title: '首页'
		}),
		//new MiniCssExtractPlugin({
		//	// Options similar to the same options in webpackOptions.output
		//	// both options are optional
		//	filename: "[name].css"
		//})
		new ExtractTextPlugin('css/index.css'),
		new PurifyCSSPlugin({
			paths: glob.sync(path.join(__dirname, 'src/*.html'))
		}),
		new webpack.ProvidePlugin({

		})
	]
};
