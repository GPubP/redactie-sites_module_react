const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
	mode: 'production',
	devtool: 'source-map',
	entry: './public/index.ts',
	module: {
		rules: [
			{
				test: /\.ts(x)?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		extensions: [ '.tsx', '.ts', '.js' ],
	},
	plugins: [
		// clean dist folder before every build
		new CleanWebpackPlugin(),
		// Uncomment this line to analyse your bundle
		// new BundleAnalyzerPlugin(),
	],
	externals: {
		'react': 'react',
		'react-dom': 'react-dom',
	},
	output: {
		filename: 'redactie-boilerplate-module.umd.js',
		path: path.resolve(__dirname, 'dist'),
		libraryTarget: 'umd',
	},
}
