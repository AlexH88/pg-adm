// const path = require("path");
// const webpack = require("webpack");
// const HtmlWebpackPlugin = require("html-webpack-plugin");
// const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
// const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

// module.exports = env => ({
//   target: "web",
//   context: path.resolve(__dirname, "src"),
//   entry: {
//     app: "./index.tsx"
//   },
//   output: {
//     filename: "js/[name].[chunkhash].bundle.js",
//     publicPath: "/",
//     path: path.resolve(__dirname, "build")
//   },
//   resolve: {
//     modules: ["node_modules", "src"],
//     extensions: [".js", ".jsx", ".ts", ".tsx"]
//   },
//   performance: {
//     hints: false
//   },
//   optimization: {
//     minimizer: [new UglifyJsPlugin()],
//     sideEffects: true,
//     splitChunks: {
//       chunks: "all",
//       maxAsyncRequests: Infinity,
//       maxInitialRequests: Infinity,
//       cacheGroups: {
//         /*shared: {
//           test: /[\\/]src[\\/]shared[\\/]/
//         },
//         modules: {
//           test: /[\\/]src[\\/]modules[\\/]/
//         },
//         features: {
//           test: /[\\/]src[\\/]features[\\/]/
//         },*/
//         react: {
//           test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/
//         },
//         charts: {
//           test: /[\\/]node_modules[\\/](react-chartjs-2|chart.js|moment)[\\/]/
//         },
//         websocket: {
//           test: /[\\/]node_modules[\\/](sockjs-client|@stomp[\\/]stompjs)[\\/]/
//         }
//       }
//     }
//   },
//   module: {
//     rules: [
//       {
//         test: /\.(ts|tsx)$/,
//         use: [
//           {
//             loader: "babel-loader",
//             options: {
//               presets: ["@babel/env", "@babel/react"]
//             }
//           },
//           "awesome-typescript-loader"
//         ]
//       },
//       {
//         test: /\.(ttf|eot|otf|woff(2)?)(\?[a-z0-9]+)?$/,
//         use: "file-loader?name=fonts/[hash].[ext]"
//       },
//       {
//         test: /\.css$/,
//         exclude: /react-toolbox.*\.css$/,
//         use: [
//           //"style-loader",
//           MiniCssExtractPlugin.loader,
//           "css-loader"
//         ]
//       },
//       {
//         test: /react-toolbox.*\.css$/,
//         use: [
//           //"style-loader",
//           MiniCssExtractPlugin.loader,
//           {
//             loader: "css-loader",
//             options: {
//               importLoaders: 1,
//               modules: {
//                 mode: "local",
//                 localIdentName: "[name]--[local]--[hash:base64:8]"
//               }
//             }
//           },
//           {
//             loader: "postcss-loader",
//             options: {
//               ident: "postcss",
//               plugins: (loader) => [
//                 require("postcss-preset-env")({stage: 0}),
//                 require("postcss-import")({ root: loader.resourcePath }),
//                 require("postcss-url")(),
//                 require("postcss-reporter")(),
//                 require("postcss-browser-reporter")
//               ]
//             }
//           }
//         ]
//       },
//       {
//         test: /\.styl$/,
//         sideEffects: true,
//         use: [
//           // "style-loader",
//           MiniCssExtractPlugin.loader,
//           {
//             loader: "css-loader",
//             options: {
//               url: true,
//               import: true,
//               importLoaders: 1,
//               modules: {
//                 mode: "local",
//                 localIdentName: "[local]"
//               }
//             }
//           },
//           "stylus-loader"
//         ]
//       },
//       {
//         test: /\.(png|svg|gif|jpg)/,
//         loader: "url-loader",
//         options: {
//           name: "images/[name].[ext]",
//           limit: 100000
//         }
//       }
//     ]
//   },
//   plugins: [
//     // new BundleAnalyzerPlugin(),
//     new MiniCssExtractPlugin({
//       filename: "css/[name].css"
//     }),
//     new CleanWebpackPlugin(),
//     new webpack.DefinePlugin({
//       "process.env.API_URL": JSON.stringify(env.API_URL)
//     }),
//     new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /ru/),
//     new webpack.LoaderOptionsPlugin({
//       options: {
//         context: path.resolve(__dirname, "src")
//       }
//     }),
//     new HtmlWebpackPlugin({
//       filename: "index.html",
//       template: "assets/index.html"
//     })
//   ],
//   devServer: {
//     contentBase: path.resolve(__dirname, "build"),
//     port: 8081,
//     inline: true,
//     lazy: false,
//     hot: env.NODE_ENV === "development",
//     historyApiFallback: true,
//     stats: "errors-only"
//   },
//   watchOptions: {
//     poll: true
//   }
// });


const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = env => ({
  watchOptions: {
      poll: true
  },
  target: "web",
  context: path.resolve(__dirname, "src"),
  entry: {
    app: "./index.tsx"
  },
  output: {
    filename: "js/[name].[chunkhash].bundle.js",
    publicPath: "/",
    path: path.resolve(__dirname, "build")
  },
  resolve: {
    modules: ["node_modules", "src"],
    extensions: [".js", ".jsx", ".ts", ".tsx"]
  },
  performance: {
    hints: false
  },
  optimization: {
    // minimizer: [new UglifyJsPlugin()],
    sideEffects: true,
    splitChunks: {
      chunks: "all",
      maxAsyncRequests: Infinity,
      maxInitialRequests: Infinity,
      cacheGroups: {
        /*shared: {
          test: /[\\/]src[\\/]shared[\\/]/
        },
        modules: {
          test: /[\\/]src[\\/]modules[\\/]/
        },
        features: {
          test: /[\\/]src[\\/]features[\\/]/
        },*/
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/
        },
        charts: {
          test: /[\\/]node_modules[\\/](react-chartjs-2|chart.js|moment)[\\/]/
        },
        websocket: {
          test: /[\\/]node_modules[\\/](sockjs-client|@stomp[\\/]stompjs)[\\/]/
        }
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/env", "@babel/react"]
            }
          },
          "awesome-typescript-loader"
        ]
      },
      {
        test: /\.(ttf|eot|otf|woff(2)?)(\?[a-z0-9]+)?$/,
        use: "file-loader?name=fonts/[hash].[ext]"
      },
      {/*****/
          test: /pdf\.worker(\.min)?\.js$/,
          loader: 'file-loader'
      },
      {
        test: /\.css$/,
        exclude: /react-toolbox.*\.css$/,
        use: [
          //"style-loader",
          MiniCssExtractPlugin.loader,
          "css-loader"
        ]
      },
      {
        test: /react-toolbox.*\.css$/,
        use: [
          //"style-loader",
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              modules: {
                mode: "local",
                localIdentName: "[name]--[local]--[hash:base64:8]"
              }
            }
          },
          {
            loader: "postcss-loader",
            options: {
              ident: "postcss",
              plugins: (loader) => [
                require("postcss-preset-env")({stage: 0}),
                require("postcss-import")({ root: loader.resourcePath }),
                require("postcss-url")(),
                require("postcss-reporter")(),
                require("postcss-browser-reporter")
              ]
            }
          }
        ]
      },
      {
        test: /\.styl$/,
        sideEffects: true,
        use: [
          // "style-loader",
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              url: true,
              import: true,
              importLoaders: 1,
              modules: {
                mode: "local",
                localIdentName: "[local]"
              }
            }
          },
          "stylus-loader"
        ]
      },
      {
        test: /\.(png|svg|gif|jpg)/,
        loader: "url-loader",
        options: {
          name: "images/[name].[ext]",
          limit: 100000
        }
      }
    ]
  },
  plugins: [
    // new BundleAnalyzerPlugin(),
    new MiniCssExtractPlugin({
      filename: "css/[name].css"
    }),
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      "process.env.REACT_APP_API_URL": JSON.stringify(env.REACT_APP_API_URL)
    }),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /ru/),
    new webpack.LoaderOptionsPlugin({
      options: {
        context: path.resolve(__dirname, "src")
      }
    }),
    new HtmlWebpackPlugin({
      favicon: "assets/favicon.png",
      filename: "index.html",
      template: "assets/index.html"
    })
  ],
  devServer: {
    contentBase: path.resolve(__dirname, "build"),
    port: 8085,
    inline: true,
    lazy: false,
    hot: env.NODE_ENV === "development",
    historyApiFallback: true,
    stats: "errors-only"
  },
  watchOptions: {
    poll: true
  }
});