const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

const MonacoEditorSrc = path.join(__dirname, '..', '..', 'src');

module.exports = {
  entry: './index.js',
  output: {
    path: path.join(__dirname, './lib/t'),
    filename: 'index.js',
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
        use: [{ loader: 'react-hot-loader/webpack' }, { loader: 'babel-loader' }]
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.json'],
    alias: { 'react-monaco-editor': MonacoEditorSrc }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.LoaderOptionsPlugin({ debug: true }),
    new webpack.SourceMapDevToolPlugin({ exclude: /node_modules/ }),
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development') },
    }),
    new CopyWebpackPlugin([{
      from: 'node_modules/monaco-editor/min/vs',
      to: 'vs',
    }]),
  ],
  devServer: { contentBase: './' }
}
