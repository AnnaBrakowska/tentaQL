const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebPackPlugin = require("clean-webpack-plugin");
const outputDir = "dist";

module.exports = {
  entry: "./src/app/index.js",
  output: {
    path: path.resolve(__dirname, outputDir),
    filename: "bundle.js"
  },
  module: {
    rules: [
      { test: /\.(js)$/, use: "babel-loader" },
      { test: /\.(css)$/, use: ["style-loader", "css-loader"] }
    ]
  },
  devServer: {
    inline: true,
    port: 3000,
    proxy: {
      "/db/*": {
        target: "http://localhost:8080",
        secure: false,
        changeOrigin: true
      }
    }
  },
  mode: "development",
  plugins: [
    new CleanWebPackPlugin([outputDir]),
    new HtmlWebpackPlugin({
      template: "./src/app/index.html"
    })
  ]
};
