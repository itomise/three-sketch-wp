const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.config.base.js').webpack_config;
const rootDir = require('./webpack.config.base.js').rootDir;
const autoprefixer = require('autoprefixer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const config = merge(baseConfig, {
  mode: 'development',
  devtool: 'inline-source-map',
  // output: {
  //   path: path.resolve(__dirname, '../htdocs/tenant/lp/'),
  //   filename: 'js/[name].js'
  // },
  output: {
    publicPath: rootDir
  },
  // devServer: {
  //   contentBase: 'dist',
  //   host: '0.0.0.0',
  //   disableHostCheck: true,
  //   hot: true,
  //   inline: true,
  //   overlay: true,
  //   port: 8000,
  //   historyApiFallback: true,
  //   watchContentBase: true
  // },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css'
    })
  ],
  module: {
    rules: [
      {
        test: /\.(sass|scss)$/,
        use: [
          'css-hot-loader',
          'style-loader',
          // MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              url: true,
              importLoaders: 2,

            }
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                autoprefixer(),

              ]
            }
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
      {
        test: /\.(jpg|png|gif|svg)$/,
        use: [
          {
            // loader: 'url-loader',
            loader: 'file-loader',
            options: {
              name: '[name].[ext]'
            }
          }
        ]
      },
    ]
  }
});

// entryにhot-middlewareを追加する
for (const key in config.entry) {
  if (config.entry.hasOwnProperty(key)) {
    config.entry[key].unshift('webpack/hot/dev-server');
    config.entry[key].unshift('webpack-hot-middleware/client');
  }
}

// config.module.rules.push({
//   test: /\.(sass|scss)$/,
//   use: [
//     'css-hot-loader',
//     'style-loader',
//     {
//       loader: 'css-loader',
//       options: {
//         sourceMap: true,
//         importLoaders: 2
//       }
//     },
//     {
//       loader: 'postcss-loader',
//       options: {
//         sourceMap: true,
//         plugins: [
//           autoprefixer()
//         ]
//       }
//     },
//     {
//       loader: 'sass-loader',
//       options: {
//         sourceMap: true,
//         includePaths: [path.resolve('./node_modules/')]
//       }
//     },
//   ]
// });

module.exports = config;
