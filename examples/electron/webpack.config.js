const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

const MonacoEditorSrc = path.join(__dirname, '..', '..', 'src');

module.exports = {
  entry: './app.js',
  target: 'electron-main',
  mode: 'development',
  devtool: 'source-map',
  output: {
    path: path.join(__dirname, '.'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: ['file?name=[name].[ext]'],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [{ loader: 'babel-loader' }]
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader' ]
      }
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    alias: { 'react-monaco-editor': MonacoEditorSrc }
  },
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
    new MonacoWebpackPlugin({
      languages: ['javascript']
    })
  ]
};
