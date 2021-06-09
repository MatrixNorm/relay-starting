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
          react: {
            name: "react",
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            chunks: "all",
          },
          relay: {
            name: "relay",
            test: /[\\/]node_modules[\\/](react-relay|relay-runtime)[\\/]/,
            chunks: "all",
          },
          vendor: {
            name: "vendors",
            test: (mod) => {
              if (/[\\/]node_modules[\\/](react|react-dom)[\\/]/.test(mod.context)) {
                return false;
              }
              if (
                /[\\/]node_modules[\\/](react-relay|relay-runtime)[\\/]/.test(mod.context)
              ) {
                return false;
              }
              if (/[\\/]node_modules[\\/]/.test(mod.context)) {
                return true;
              }
              return false;
            },
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
