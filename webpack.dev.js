'use strict';

const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

const path = require('path');
const { DefinePlugin } = require('webpack');

const config = merge(common, {
  mode: 'development',
  devtool: 'eval-source-map',
  output: {
    filename: '[contenthash].[name].js',
  },
  plugins: [
    new DefinePlugin({
      'process.env.DISABLE_AMPLITUDE': true,
      BUILD_VERSION: JSON.stringify(process.env.CIRCLE_SHA1),
    }),
  ],
  module: {
    rules: [
      // bootstrap-loader
      {
        test: /\.(scss)$/,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
      },
      {
        test: /\.css$/,
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
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.styl$/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'stylus-loader'],
      },
    ],
  },
  devServer: {
    allowedHosts: 'all',
    client: {
      overlay: false,
      webSocketURL: {
        hostname: 'local.vtagz.com',
        port: 3010,
      },
    },
    compress: true,
    historyApiFallback: true,
    host: process.env.FAST_TRACK ? 'local.vtagz.com' : 'localhost',
    port: 3010,
    open: true,
    hot: true,
    server: process.env.FAST_TRACK ? 'https' : 'http', // use https for fast tracking to stage
    static: {
      directory: path.join(__dirname, 'dist'),
      watch: {
        usePolling: true,
        interval: 1000,
      },
    },
  },
});

module.exports = config;
