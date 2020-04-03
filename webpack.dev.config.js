const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require("webpack");
const manifest = require('./dist/dll/vendor.manifest.json')
const port =  3006;

module.exports = function (env, argv) {
    let devConfig = {
        mode: 'development',
        devtool: 'inline-source-map',
        entry: './src/index.js',
        output: {
            filename: 'index.[hash:5].js',
            path: path.resolve(__dirname, './dist/ca')
        },
        devServer: {
            host: '127.0.0.1',
            port,
            open: false,
            contentBase: './dist',
            proxy: {
                '/mplan': {
                    target: 'http://127.0.0.1:8080',
                    changeOrigin: true
                }
            }
        },
        module: {
            rules: [{
                test: /\.js[x]?$/,
                use: 'babel-loader',
                exclude: /node_modules/
            }, {
                test: /\.css$/,
                // use: ['style-loader', 'css-loader']
                loader: 'style-loader!css-loader'
            },
            {
                test: /\.less$/,
                loader: 'style-loader!css-loader!less-loader' // 自动补全css3前缀
            },
            {
                test: /\.(png|jpg|gif)/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        //文件大小小于limit参数，url-loader将会把文件转为DataURL；
                        //文件大小大于limit，url-loader会调用file-loader进行处理，参数也会直接传给file-loader。
                        // limit: 8192,//
                        // name:'[name].[ext]',
                        // outputPath:'imag/'
                    }
                }]
            }

            ]
        },
        plugins: [
            new webpack.DllReferencePlugin({
                // manifest: require('../dist/dll/vendor-manifest.json')
                manifest
            })
        ],
        resolve: {
            extensions: ['.js', '.jsx', '.json', '.less'],
            alias: {
                '@': path.join(__dirname, '../src'),//表示根目录
                mplan: path.join(__dirname, '../src/mk/public/components/components.js'),//表示公共组件
                mplanUtil:path.join(__dirname, '../src/mk/public//util/util.js'),//表示工具类
                mplanApi:path.join(__dirname, '../src/mk/public/requestApi/commonApi.js'),//公共api
            }
        },
    };
    let htmlPlugin = {
        //1、filename配置的html文件目录是相对于webpackConfig.output.path路径而言的，不是相对于当前项目目录结构的。
        //2、指定生成的html文件内容中的link和script路径是相对于生成目录下的，写路径的时候请写生成目录下的相对路径。
        filename: `index.html`,// 生成的html文件名，可加目录/.../.../index.html
        //这个路径相当于工程的路径
        template: './view/index.html',
        inject: true,
        // chunks: [`ca/index`],
    }
    devConfig.plugins.push(new HtmlWebpackPlugin(htmlPlugin));
    return devConfig;
}