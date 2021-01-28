const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: "./example/index.js",
  output: {
    path: path.resolve(__dirname, '../public'),
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /(.jsx|.js)$/, 
        use: [
          'cache-loader',
          'babel-loader'
        ],
        exclude: /node_modules/
      },
      {
        test: /.css$/,
        use: ['cache-loader', 'style-loader', 'css-loader', 'postcss-loader']
      },
      {
        test: /.less$/,
        use: [
          'cache-loader',
          'style-loader',
          'css-loader',
          'less-loader',
          'postcss-loader',
        ] 
      },
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ]
}