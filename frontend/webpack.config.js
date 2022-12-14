const path = require('path')
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    mode: 'development',
    entry:{
        main: path.resolve(__dirname,'src/index.js'),
    },
    output: {
        path: path.resolve(__dirname,'../backend/app/static/js'),
        filename: '[name].[contenthash].js',
        assetModuleFilename: '[name][ext]',
        clean: true,
    },
    devtool: 'source-map',
    devServer:{
        static: {
            directory: path.resolve(__dirname,'dist'), 
        },
        
        port: 3000,
        open: true,
        hot: true,
        compress: true,
        historyApiFallback: true, 
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
              },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use:{
                    loader: 'babel-loader',
                    options:{
                        presets: ['@babel/preset-env','@babel/preset-react'],
                    },
                },
            },
            {
                test: /\.(jpg|svg|png|gif)$/i,
                type: 'asset/resource'
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'MicroBlog',
            filename: 'index.html',
            template: 'src/template.html',
        }),
        new webpack.DefinePlugin({
            "process.env.API_URL": JSON.stringify("http://localhost:5000")
          })
      
    ]
}