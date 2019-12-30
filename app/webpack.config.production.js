const merge = require('webpack-merge');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const baseConfig = require('./webpack.config.base.js').webpack_config;
const rootDir = require('./webpack.config.base.js').rootDir;

const config = merge(baseConfig, {
  mode: 'production',

  module: {
    rules: [
      {
        test: /\.(sass|scss)$/,
        use: [
          MiniCssExtractPlugin.loader,
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
                cssnano()
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
              name: '[name].[ext]',
              outputPath: 'materials/',
              publicPath: url => {
                return rootDir + '/materials/' + url;
              }
            }
          }
        ]
      },
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].css'
    }),
  ],
  optimization: {
    minimizer: [
      new TerserPlugin({
        extractComments: 'all',
      })
    ]
  }
});

module.exports = config;
