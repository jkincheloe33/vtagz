'use strict';

const path = require('path');
const { DefinePlugin } = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

const ORIGINS = {
  local: 'http://localhost:3010',
  development: 'https://dev.vtagz.com',
  staging: 'https://stage.vtagz.com',
  production: 'https://vtagz.com',
};

const targetEnv = process.env.TARGET_ENV || 'production';

const config = {
  entry: './app/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.(gql)$/,
        exclude: /node_modules/,
        type: 'asset/source',
      },
      {
        test: /\.(png|jpe?g|svg|gif|mp4)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.pug$/,
        exclude: /node_modules/,
        use: ['pug-loader'],
      },
    ],
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'app'),
    },
    extensions: ['.js', '.jsx', '.styl'],
  },
  plugins: [
    new NodePolyfillPlugin(),
    new DefinePlugin({
      'process.env.TARGET_ENV': JSON.stringify(targetEnv),
    }),
    new ESLintPlugin({
      failOnError: false,
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          context: 'app/static',
          from: '*.html',
          force: true,
        },
        {
          context: 'app/static',
          from: '*.txt',
          force: true,
        },
        {
          from: 'app/static/.well-known/apple-developer-merchantid-domain-association',
          to: '.well-known/apple-developer-merchantid-domain-association',
          toType: 'file',
        },
      ],
    }),
    new HtmlWebpackPlugin({
      template: 'app/static/index.pug',
      title: 'VTAGZ',
      favicon: 'app/static/favicon.png',
      isProduction: targetEnv === 'production',
      origin: ORIGINS[targetEnv],
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
};

module.exports = config;
