var path = require('path')
var HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')

module.exports = {
  entry: [
    './frontend/src/index.tsx',
    'webpack-dev-server/client?http://localhost:8080/'
  ],
  output: {
    path: path.resolve(__dirname, 'frontend/static/frontend'),
    filename: 'index.js'
  },
  // target: "node",
  devtool: "source-map",
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    fallback: {
      fs: false
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-typescript']
            ],
          }
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
      },
      {
        test: /\.(png|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000
            }
          }
        ]
      }
    ]
  },
  mode: 'development',
  plugins: [
    new HtmlWebpackPlugin({
      template: 'frontend/src/index.html',
      favicon: 'frontend/src/favicon.ico'
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer']
    })
  ]
}