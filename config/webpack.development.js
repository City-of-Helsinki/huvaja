const path = require('path');

const dotenv = require('dotenv');
const webpack = require('webpack');
const merge = require('webpack-merge');

const common = require('./webpack.common');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

module.exports = merge(common, {
  entry: [
    'babel-polyfill',
    'webpack-hot-middleware/client',
    path.resolve(__dirname, '../app/index.js'),
  ],
  debug: true,
  devtool: 'cheap-module-eval-source-map',
  output: {
    path: '/',
    filename: 'app.js',
    publicPath: '/',
  },
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, '../app'),
        loader: 'eslint',
      },
    ],
    loaders: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, '../app'),
        exclude: path.resolve(__dirname, '../node_modules'),
        loader: 'babel',
        query: {
          presets: ['es2015', 'node6', 'react', 'react-hmre', 'stage-2'],
        },
      },
      {
        test: /\.css$/,
        loader: 'style!css!postcss-loader',
      },
      {
        test: /\.scss$/,
        loader: 'style!css!postcss-loader!sass',
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
      'process.env.SENTRY_DSN': JSON.stringify(process.env.SENTRY_DSN),
      SETTINGS: {
        API_URL: JSON.stringify(process.env.API_URL || 'https://api.hel.fi/virkarespa/v1/'),
        REPORT_URL: JSON.stringify(
          process.env.REPORT_URL || 'https://api.hel.fi/virkarespa/reports/'
        ),
      },
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
  ],
});
