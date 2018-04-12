const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const WriteFilePlugin = require('write-file-webpack-plugin')

module.exports = {
  entry: [path.resolve('./src/index.js')],
  output: {
    path: path.resolve('./dist'),
    publicPath: '/',
    filename: 'graphiql-online.js'
  },
  module: {
    rules: [
      { test: /\.js$/, use: 'babel-loader', exclude: /node_modules/ },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'GraphiQL Online',
      favicon: path.resolve('./src/favicon.ico')
    }),
    new CopyWebpackPlugin([ { from: 'src/voyager.worker.js', to: 'voyager.worker.js' } ]),
    new WriteFilePlugin(),
  ]
}
