/* eslint-disable no-console */
const express = require('express');
const morgan = require('morgan');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const config = require('../config/webpack.development');
const auth = require('./auth');

const app = express();
const compiler = webpack(config);
const port = 3000;
const serverSettings = {
  publicPath: config.output.publicPath,
  quiet: false,
  noInfo: false,
  stats: {
    assets: false,
    chunkModules: false,
    chunks: true,
    colors: true,
    hash: false,
    progress: false,
    timings: false,
    version: false,
  },
};

console.log('Starting development server...');

const devMiddleware = webpackMiddleware(compiler, serverSettings);
app.use(devMiddleware);
app.use(webpackHotMiddleware(compiler));


// Request logging
app.use(morgan('combined'));

app.use('/', auth);

app.use((req, res, next) => {
  if (req.method === 'GET' && req.accepts('html')) {
    res.write(devMiddleware.fileSystem.readFileSync('/index.html'));
    res.send();
    next();
  } else {
    next();
  }
});

app.listen(port, 'localhost', (error) => { // eslint-disable-line
  if (error) {
    return console.log(error);
  }

  console.log(`Listening at http://localhost:${port}/`);
});
