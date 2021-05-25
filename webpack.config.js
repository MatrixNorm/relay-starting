const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  target: "web",
  mode: "development",
  entry: "./src/main.tsx",
  output: {
    filename: "entry.js",
    path: path.resolve(__dirname, "dist"),
    // https://stackoverflow.com/questions/31945763/how-to-tell-webpack-dev-server-to-serve-index-html-for-any-route
    publicPath: "/",
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  resolve: {
    // ???
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
  devtool: "source-map",
  devServer: {
    historyApiFallback: true,
    contentBase: ["./src"],
    watchOptions: {
      ignored: /node_modules/,
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.template.html",
    }),
  ],
};
