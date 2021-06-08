const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = (env) => {
  const plugins = [
    new HtmlWebpackPlugin({
      template: "./index.template.html",
    }),
    env.bundleanalyzer &&
      (() => {
        const BundleAnalyzerPlugin =
          require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
        return new BundleAnalyzerPlugin({
          analyzerMode: "server",
        });
      })(),
  ].filter(Boolean);

  return {
    target: "web",
    mode: env.prod ? "production" : "development",
    entry: { app: "./src/main.tsx" },
    output: {
      filename: "[name].js",
      path: path.resolve(__dirname, "dist"),
      // https://stackoverflow.com/questions/31945763/how-to-tell-webpack-dev-server-to-serve-index-html-for-any-route
      publicPath: "/",
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          vendor: {
            name: "node_vendors",
            test: /[\\/]node_modules[\\/]/,
            chunks: "all",
          },
        },
      },
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
      alias: {
        __relay__: path.resolve(__dirname, "src/__relay__"),
      },
    },
    devtool: "source-map",
    devServer: {
      historyApiFallback: true,
      contentBase: ["./src"],
      watchOptions: {
        ignored: /node_modules/,
      },
    },
    plugins,
  };
};
