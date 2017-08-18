const path = require('path')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')

const MonacoEditorSrc = path.join(__dirname, '..', '..', 'src')


module.exports = {
  entry: './app.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.html$/,
        loader: 'file?name=[name].[ext]',
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    alias: { 'react-monaco-editor': MonacoEditorSrc }
  },
  plugins: [
    new ProgressBarPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.SourceMapDevToolPlugin({ exclude: /node_modules/ }),
    new CopyWebpackPlugin([
      {
        from: 'index.js',
        to: '.'
      },
      {
        from: 'index.html',
        to: '.'
      },
      {
        from: 'node_modules/monaco-editor/min/vs',
        to: 'vs',
      }
    ])
  ]
}
