var path = require('path')
var HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: [
    './src/index.js',
    'webpack-dev-server/client?http://localhost:8080/'
  ],
  output: {
    path: path.resolve(__dirname, 'static/frontend'),
    filename: 'index.js'
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.(css)$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(svg|eot|woff|ttf|svg|woff2)$/,
        use: [
          'url-loader?limit=100000',
          'file-loader'
        ]
    }
    ]
  },
  mode: 'development',
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      favicon: 'src/favicon.ico'
    })
  ]
}