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
      { test: /\.(css)$/, use: ["style-loader", "css-loader"] },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        loader: "url-loader?limit=100000"
      }
    ]
  },
  devServer: {
    port: 3000,
    proxy: {
      "/db": "http://localhost:8080"
    }
  },
  mode: "development",
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/app/index.html"
    })
  ]
};
