var webpack = require('webpack');
var path = require('path');
var htmlWebpackPlugin = require('html-webpack-plugin');
var extractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: {
        app: './src/main.js'
    },
    output: {
        path: __dirname + '/build/assets',
        filename: 'js/[name].js',
        publicPath: '/assets',
        chunkFilename: 'js/[name].js'
    },
    module: {
        loaders: [{
            test: /\.css$/,
            // 将包含的css文件全部提取到style.css里面
            use: extractTextPlugin.extract({
                fallback: 'style-loader',
                use: 'css-loader'
            })
        }, {
            test: /\.(png|gif|svg|jpe?g)$/,
            loader: 'url-loader?limit=8192&name=images/[name].[hash:8].[ext]' // 小于8kb返回文件数据url，单位k
        }, {
            test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
            loader: 'url-loader',
            options: {
                limit: 10000,
                name: 'fonts/[name].[hash:7].[ext]'
            }
        }, {
            test: /\.vue$/,
            loader: 'vue-loader',
            options: {
                loaders: {
                    css: extractTextPlugin.extract({
                        use: 'css-loader',
                        fallback: 'vue-style-loader' // <- 这是vue-loader的dep，所以如果使用npm3，不需要显式安装
                    })
                }
            }
        }, {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
        }, { // 加载jQuery插件并注入jquery对象
            test: '/src/assets/js/**/*.js$',
            loader: 'imports-loader?jQuery=jquery,$=jquery,this=>window'
        }]
    },
    plugins: [
        // 生成的js文件头部注释
        new webpack.BannerPlugin('RRS Admin'),
        // 环境变量，在代码里生效
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production') // or production，环境配置
        }),
        // 自动生成入口html文件
        new htmlWebpackPlugin({
            template: __dirname + '/src/index.tpl.html', // 模板文件路径
            inject: 'body', // 注入到body
            filename: '../index.html' // 文件生成到 build/
        }),
        // 将入口所有的commons js打包成一个commons.js文件。现在只接收一个对象配置参数，之前多参数的配置不再支持。这里使用安装jquery包，然后会用imports-loader将$注入jquery插件，这里不再使用
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: 'commons',
        //     filename: 'js/commons.js',
        //     minChunks: Infinity
        // }),
        // 提取css文件到单独文件
        new extractTextPlugin('css/style.css'),
        // 注入全局变量，需要先安装Jquery库
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery'
        })
    ],
    resolve: {
        // require时省略的扩展名，如：require('module') 不需要module.js
        extensions: ['.js', '.vue', 'json'],
        // 别名，可以直接使用别名来代表设定的路径以及其他
        alias: {
            'vue$': 'vue/dist/vue.esm.js', // 默认require vue导入的是vue的package.js文件里配置的main字段对应的文件，这里需要重新置顶，否则会报错
            '@': path.join(__dirname, './src') // 将@指向到源代码文件夹目录
        }
    },
    // 开启source-map，webpack有多种source-map，在官网文档可以查到
    devtool: 'eval-source-map'
        // ,
        // externals: {
        //     jquery: 'window.jQuery'
        // }
}
