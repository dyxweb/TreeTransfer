const webpack = require('webpack');

module.exports = {
  entry:  __dirname + "/src/index.js",  //入口文件
  output: {
    path: __dirname + "/src/public", //打包后的文件存放的地方
    filename: "bundle.js" //打包后输出文件的文件名
  },
  devServer: {
    contentBase: "./src/public", // 本地服务器所加载的页面所在的目录
    port: "8000", // 设置端口号
    historyApiFallback: true ,// 跳转指向index.html
    inline: true, // 实时刷新，源文件修改自动刷新页面
    hot:true,
    progress: true
  } ,
  devtool: 'eval-source-map', // 打包后方便调试
  mode: 'development',
  module: {
    rules: [
      {
        test: /(.jsx|.js)$/, 
        use: { // use选择如果有多项配置，可写成对象形式,babel的配置可以写在babelrc文件中
          loader: "babel-loader",
          options: { "plugins": [ ["import", { "libraryName": "antd", "libraryDirectory": "es", "style": "css" }] ] }
        },
        exclude: /node_modules/  // 排除匹配node_modules模块
      },
      {
        test: /.css$/, // 正则匹配以.css结尾的文件
        use: ['style-loader', 'css-loader', 'postcss-loader'] // 需要用的loader，确定的顺序，调用loader是从右往左编译的
      },
      {
        test: /.less$/, // 正则匹配以less结尾的文件
        use: [
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
      {
        test: /.(png|jpg|svg|gif)$/, // 正则匹配图片格式名
        use: [
          {
            loader: 'url-loader', // 使用url-loader
            options: {
              limit: 1000, // 限制只有小于1kb的图片才转为base64，例子图片为1.47kb,所以不会被转化
              outputPath: './src/public/images' // 设置打包后图片存放的文件夹名称
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(), //热加载插件
    new webpack.DefinePlugin({
      'NAME': JSON.stringify('dyx'),
    })
  ]
}