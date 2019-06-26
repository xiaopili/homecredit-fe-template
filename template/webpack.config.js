const path = require('path');
const webpack = require('webpack');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const port = 3000;

module.exports = {
    devtool: '#source-map',
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
	// externals:{
	// 	'React': 'React',
	// 	'react-dom': 'ReactDOM',
	// 	'react-redux': 'react-redux',
	// 	'react-router': 'react-router',
	// 	'axios': 'axios',
	// 	'antd-mobile': 'antd-mobile'
	// },
	externals:[{'React': 'React'}],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: 'babel-loader',
            },
            {
                test: /\.less$/,
                use: [
                    'style-loader',
                    'css-loader?#sourceMap',
                    'postcss-loader',
                    'less-loader',
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
                loader: 'file-loader?limit=10000&name=fonts/[hash:8].[ext]'
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
        new OpenBrowserPlugin({
            url: `http://localhost:${port}`,
        }),
        new webpack.ProvidePlugin({
			// React: "react",
			'window.axios': "axios",
            $: "jquery",
            jQuery: "jquery",
            'window.jQuery': 'jquery',
            Popper: ['popper.js', 'default'],
        }),
        // new BundleAnalyzerPlugin(),
    ],
    devServer: {
        compress: true, // 启用gzip压缩
        contentBase: path.join(__dirname, 'src'),
        port, // 运行端口3000
        inline: true,
        hot: true,
		historyApiFallback: true,
		host: '0.0.0.0'
    },
};
