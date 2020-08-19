const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const util = require('util');
const git = require('git-last-commit');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackBannerPlugin = require('@potcfdk/html-webpack-banner-plugin');

const { VueLoaderPlugin } = require('vue-loader');

const gitCommit = util.promisify(git.getLastCommit)();

module.exports = async env => ({
	entry: './src/index.ts',
	output: {
		filename: 'main.js',
		path: path.resolve(__dirname, 'dist'),
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: 'ts-loader',
				exclude: /node_modules/,
				options: { appendTsSuffixTo: [/\.vue$/] }
			},
			{
				test: /\.vue$/,
				use: 'vue-loader'
			},
			{
				test: /\.css$/,
				use: [
					'style-loader',
					'css-loader',
				],
			},
			{
				test: /\.html$/,
				loader: 'html-loader',
				options: {
					minimize: {
						caseSensitive: true,
						collapseWhitespace: true,
						conservativeCollapse: true,
						keepClosingSlash: true,
						minifyCSS: true,
						minifyJS: true,
						removeComments: true,
						removeRedundantAttributes: true,
						removeScriptTypeAttributes: true,
						removeStyleLinkTypeAttributes: true,
					}
				}
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
		new VueLoaderPlugin(),
		new webpack.DefinePlugin({
			COMMITTIMESTAMP: (await gitCommit).committedOn,
			VERSION: JSON.stringify(require('./package.json').version)
		}),
		new HtmlWebpackPlugin({
			template: 'src/index.html',
			minify: {
				caseSensitive: true,
				collapseWhitespace: true
			}
		}),
		new HtmlWebpackBannerPlugin({
			banner: Array.from(fs.readFileSync('src/index.html').toString().matchAll(/<!\-\-(([^]|[\r\n])*?)\-\->/g)).filter(c => c[1].match(/Copyright/))[0][1]
		})
	],
	resolve: {
		extensions: ['.ts'],
		alias: {
			'vue$': 'vue/dist/vue.js'
		}
	},
});
