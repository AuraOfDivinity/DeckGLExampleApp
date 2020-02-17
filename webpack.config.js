const resolve = require("path").resolve;
const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "build"),
    publicPath: "/",
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: ["css-loader"]
      }
    ]
  },
  resolve: {
    extensions: ["*", ".js", ".jsx"],
    alias: {
      "mapbox-gl$": resolve("./node_modules/mapbox-gl/dist/mapbox-gl.js")
    }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || "development"),
        MapboxAccessToken: JSON.stringify(process.env.MapboxAccessToken)
      }
    }),
    new HtmlWebpackPlugin({
      template: path.resolve("./index.html"),
      filename: path.join(".", "build", "index.html")
    })
  ],
  devServer: {
    contentBase: "./build",
    hot: true
  }
};
