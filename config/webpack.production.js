const path = require('path');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const merge = require('webpack-merge');

const common = require('./webpack.common');

const outputPath = path.resolve(__dirname, '../dist');

module.exports = merge(common, {
  entry: [
    'babel-polyfill',
    path.resolve(__dirname, '../app/index.js'),
  ],
  debug: false,
  devtool: 'source-map',
  output: {
    path: outputPath,
    publicPath: '/',
    filename: 'app.[hash].js',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, '../app'),
        loader: 'babel',
        query: {
          presets: ['es2015', 'node6', 'react', 'stage-2'],
        },
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style', 'css!postcss-loader'),
      },
      {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract('style', 'css!postcss-loader!less'),
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      SETTINGS: {
        API_URL: JSON.stringify(process.env.API_URL || 'https://api.hel.fi/virkarespa/v1/'),
      },
    }),
    new CleanWebpackPlugin([outputPath], { root: path.resolve(__dirname, '..') }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        screw_ie8: true,
        warnings: false,
      },
    }),
    new ExtractTextPlugin('app.[hash].css'),
  ],
});
