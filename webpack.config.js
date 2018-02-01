var path = require('path');
var webpack = require('webpack');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
	entry: [
		__dirname + '/src/index.js',
	],
	output: {
		path: __dirname + '/lib',
		filename: 'index.js',
		library: 'oceanUtils',
		libraryTarget: 'umd',
		umdNamedDefine: true,
	},

	devtool: 'source-map',

	resolve: {
		modules: [
			"node_modules",
			path.resolve(__dirname),
		],
		extensions: ['.js', '.jsx'],
	},
	module: {
		loaders: [
			{
				test: /\.js(x?)$/,
				exclude: /node_modules/,
				loader: 'babel-loader'
			},
		],
	},
	plugins: [
		new UglifyJSPlugin({
			sourceMap: true
		}),

		new CleanWebpackPlugin(['lib'], {
			verbose: true,
		})
	],
}
