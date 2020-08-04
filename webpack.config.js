const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackBannerPlugin = require('@potcfdk/html-webpack-banner-plugin');

module.exports = env => ({
	entry: './src/index.js',
	output: {
		filename: 'main.js',
		path: path.resolve(__dirname, 'dist'),
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [
					'style-loader',
					'css-loader',
				],
			},
			{
				test: /\.html$/,
				loader: 'html-loader'
			},
			{
				test: /\.(png|svg|jpg|gif)$/,
				use: [
					'file-loader',
				],
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: 'src/index.html',
			minify: {
				collapseWhitespace: true
			}
		}),
		new HtmlWebpackBannerPlugin({
			banner: Array.from(fs.readFileSync('src/index.html').toString().matchAll(/<!\-\-(([^]|[\r\n])*?)\-\->/g)).filter(c => c[1].match(/Copyright/))[0][1]
		})
	]
});
