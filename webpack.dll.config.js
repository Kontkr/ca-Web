const webpack = require("webpack")
const path = require('path')
// const CleanWebpaclPlugin = require('clean-webpack-plugin');
const resolve = (dir) => path.join(__dirname, '..', dir);
const package = require('./package.json')
let dependencies = Object.keys(package.dependencies) || []
//如果使用了chrome的vue-devtool，那打包的时候把vue也排除掉，因为压缩过的vue是不能使用vue-devtool的
dependencies = dependencies.length > 0 ? dependencies.filter(item => item !== 'vue') : []
console.log(dependencies)

module.exports = {
    entry: {
        // # 将 react、lodash等模块作为入口编译成动态链接库
        // vendor: ['react', 'react-dom', 'react-router-dom', 'antd','redux','axios','jquery']
        vendor: dependencies
    },
    output: {
        // # 指定生成文件所在目录文件夹，
        // # 将它们存放在了 src 文件夹下
        path:  path.join(__dirname, './dist/dll'),
        // # 指定文件名
        library: '[name]_library',
        // # 存放动态链接库的全局变量名称，例如对应 lodash 来说就是 lodash_dll_lib
        // # 这个名称需要与 DllPlugin 插件中的 name 属性值对应起来
        filename: '[name]_dll.js'
    },
    plugins: [
        // new CleanWebpaclPlugin(['dll'], {
        //     root: resolve('public')
        // }),
        new webpack.DllPlugin({
            name: '[name]_library',
            // # 和output.library中一致，值就是输出的manifest.json中的 name值
            path: path.join(__dirname, './dist/dll', '[name].manifest.json'),
        })
    ]
}