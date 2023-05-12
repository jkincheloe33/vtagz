'use strict';

const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');

const { DefinePlugin } = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const config = merge(common, {
  mode: 'production',
  output: {
    filename: '[contenthash].[name].js',
  },
  plugins: [
    new DefinePlugin({
      'process.env.DISABLE_AMPLITUDE': false,
      BUILD_VERSION: JSON.stringify(process.env.CIRCLE_SHA1),
    }),
    new MiniCssExtractPlugin({ filename: '[contenthash].css' }),
  ],
  module: {
    rules: [
      // bootstrap-loader
      {
        test: /\.(scss)$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.css$/,
        // this is needed because the default is to exclude node_modules
        // make sure to use resolve() for different OS support
        include: [
          path.resolve('node_modules', 'normalize.css'),
          path.resolve('node_modules', 'react-toastify'),
          path.resolve('node_modules', 'react-datepicker'),
          path.resolve('node_modules', 'intl-tel-input'),
          path.resolve('node_modules', 'react-quill'),
          path.resolve('node_modules', 'jsoneditor'),
          path.resolve('node_modules', 'jsoneditor-react'),
          path.resolve('node_modules', 'quill-emoji'),
        ],
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.styl$/,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'stylus-loader',
        ],
      },
    ],
  },
  optimization: {
    minimizer: ['...', new CssMinimizerPlugin()],
  },
});

module.exports = config;
