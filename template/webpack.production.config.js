const path = require('path');
const webpack = require('webpack');
const uglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        bundle: './src/main.jsx',
        // vendor: ['react', 'react-dom', 'react-router', 'redux', 'react-redux', 'jquery', 'antd-mobile', 'axios', 'bootstrap'],
    },
    output: {
        path: path.join(__dirname, '/dist'),
        filename: '[name].js',
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        alias: {
			'@Utils': path.resolve(__dirname, './src/utils'),
			'@Axios': path.resolve(__dirname, './src/axios'),
			'@Stores': path.resolve(__dirname, './src/stores'),
			'@Routes': path.resolve(__dirname, './src/routes'),
			'@Static': path.resolve(__dirname, './src/static')
        },
	},
	externals:{
		'React': 'React',
		// 'react-dom': 'ReactDOM',
		// 'react-redux': 'react-redux',
		// 'react-router': 'react-router',
		// 'axios': 'axios',
		// 'antd-mobile': 'antd-mobile'
	},
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/, use: 'babel-loader',
            }, {
                test: /\.less$/,
                use: [
                    "style-loader",
                    "css-loader?minimize",
                    "postcss-loader",
                    "less-loader",
                ],
            }, {
                test: /\.(png|jpe?g|gif)$/,
                use: [{
                    loader: 'url-loader?limit=100',
                    options:{
                        name: 'img/[hash:8].[ext]'
                    }
                }]
            }, {
                //文件加载器，处理文件静态资源
                test: /\.(woff|woff2|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'file-loader?limit=10000&name=fonts/[name].[ext]'
            }
        ],
    },
    plugins: [
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
        }),
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: ['vendor'],
        // }),
        new uglifyJsPlugin({
            beautify: false,
            comments: false,
            compress: {
                warnings: false,
                drop_console: true,
                collapse_vars: true,
                reduce_vars: true,
            },
        }),
        new CopyWebpackPlugin([
            { from: './src/index.html', to: 'index.html' },
        ]),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            'window.jQuery': 'jquery',
			Popper: ['popper.js', 'default'],
			'window.axios': "axios",
			// React: "react"
		})
    ],
};
