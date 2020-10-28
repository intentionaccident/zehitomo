var HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = env => {
	if (!env) {
		env = {}
	}
	return {
		entry: ["bootstrap/dist/css/bootstrap.min.css", "./src/styles.sass", "./src/index.tsx"],
		mode: env.production ? 'production' : 'development',
		devtool: "source-map",
		devServer: {
			historyApiFallback: true
		},
		resolve: {
			extensions: [".ts", ".tsx", ".js", ".json"]
		},
		module: {
			rules: [
				{
					test: /\.tsx?$/,
					exclude: /node_modules/,
					use: [
						{
							loader: "ts-loader"
						}
					]
				},
				{
					enforce: "pre",
					test: /\.js$/,
					loader: "source-map-loader"
				},
				{
					test: /\.s[ac]ss$/i,
					use: [
						"style-loader",
						"@teamsupercell/typings-for-css-modules-loader",
						{
							loader: "css-loader",
							options: { modules: true }
						},
						'sass-loader'
					],
				},
				{
					test: /\.(mp3)$/i,
					use: [
						{
							loader: 'file-loader',
						},
					],
				},
				{
					test: /\.(png|jp(e*)g|svg)$/,
					use: [
						{
							loader: 'url-loader',
							// options: {
							// 	limit: 8000, // Convert images < 8kb to base64 strings
							// 	name: 'images/[hash]-[name].[ext]'
							// }
						}
					]
				},
				{
					test: /\.css$/,
					use: ['style-loader', 'css-loader']
				}
			]
		},
		optimization: {
			splitChunks: {
				chunks: 'all'
			}
		},
		plugins: [
			new HtmlWebpackPlugin({
				base: "/",
				title: "Zehitomo Image Browser"
			})
		]
	};
};
