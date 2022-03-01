const { CheckerPlugin } = require("awesome-typescript-loader")
const { optimize } = require("webpack")
const { join, resolve } = require("path")
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")
const Dotenv = require("dotenv-webpack")

let prodPlugins = []
if (process.env.NODE_ENV === "production") {
  prodPlugins.push(new optimize.AggressiveMergingPlugin())
}

module.exports = {
  mode: process.env.NODE_ENV,
  devtool: "inline-source-map",
  entry: {
    background: join(__dirname, "src/background/background.ts"),
  },
  output: {
    path: join(__dirname, "dist"),
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.ts?$/,
        use: "ts-loader",
      },
    ],
  },

  plugins: [new CheckerPlugin(), new NodePolyfillPlugin(), new Dotenv(), ...prodPlugins],
  resolve: {
    extensions: [".ts", ".js"],
  },
}
