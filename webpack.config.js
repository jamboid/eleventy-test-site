const path = require('path');
//const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpackDashboard = require('webpack-dashboard/plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WebpackNotifierPlugin = require("webpack-notifier");
// const fs = require('fs');

const config = {
  entry: ["./assets/js", "./assets/scss/screen.scss", "./assets/scss/theme.scss"],
  output: {
    filename: "assets/js/site.js",
    path: path.resolve(__dirname, "_site"),
    publicPath: "."
  },
  devtool: "source-map", 
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].css',
              context: './assets/scss/',
              outputPath: 'assets/css',
              publicPath: '/_site/assets/css'
            }
          },
          {
            loader: 'extract-loader'
          },
          {
            loader: "css-loader",
            options: {
              url: false,
              importLoaders: 2,
              sourceMap: true
            }
          },
          { loader: "postcss-loader",
            options: { sourceMap: true }
          }, 
          { loader: "sass-loader",
            options: { sourceMap: true }
          }
        ]
      }
    ]
  },
  resolve: {
    alias: {
      Modules: path.resolve(__dirname, "assets/js/modules/"),
      Sass: path.resolve(__dirname, "assets/scss/")
    }
  },
  plugins: [
    new webpackDashboard(),
    // new MiniCssExtractPlugin({
    //   filename: "/css/screen.css"
    // }),
    new CopyWebpackPlugin([{ from: "assets/img", to: "assets/img" }]),
    new WebpackNotifierPlugin({ alwaysNotify: true })
  ]
};

module.exports = config; 
