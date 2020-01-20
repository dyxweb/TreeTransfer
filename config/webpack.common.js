const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: "./example/index.js",  //入口文件
  output: {
    path: path.resolve(__dirname, '../public'),
    filename: "bundle.js" //打包后输出文件的文件名
  },
  module: {
    rules: [
      {
        test: /(.jsx|.js)$/, 
        use: [
          'cache-loader',
          {
            loader: "babel-loader",
            options: { "plugins": [ ["import", { "libraryName": "antd", "libraryDirectory": "es", "style": "css" }] ] }
          },
        ],
        exclude: /node_modules/  // 排除匹配node_modules模块
      },
      {
        test: /.css$/, // 正则匹配以.css结尾的文件
        use: ['cache-loader', 'style-loader', 'css-loader', 'postcss-loader'] // 需要用的loader，确定的顺序，调用loader是从右往左编译的
      },
      {
        test: /.less$/, // 正则匹配以less结尾的文件
        use: [
          'cache-loader',
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true, 
              localIdentName: '[name]__[local]--[hash:base64:5]' 
            },
          },
          'less-loader',
          'postcss-loader',
        ] 
      },
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(), //热加载插件
  ]
}