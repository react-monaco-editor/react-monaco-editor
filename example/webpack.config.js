const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
const path = require("path");

// const MonacoEditorSrc = path.join(__dirname, "..", "src");

module.exports = {
  entry: "./index.js",
  mode: "development",
  devtool: "source-map",
  output: {
    path: path.join(__dirname, "./lib/t"),
    filename: "index.js",
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: ["file?name=[name].[ext]"],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env", "@babel/preset-react"],
              plugins: ["@babel/plugin-proposal-class-properties"],
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.ttf$/,
        type: 'asset/resource'
      },
    ],
  },
  resolve: {
    extensions: [".js", ".json"],
    // Remove alias until https://github.com/microsoft/monaco-editor-webpack-plugin/issues/68 is fixed
    // alias: { "react-monaco-editor": MonacoEditorSrc }
  },
  plugins: [
    new MonacoWebpackPlugin({
      languages: ["json", "javascript", "typescript"],
    }),
  ],
  devServer: { contentBase: "./" },
};
