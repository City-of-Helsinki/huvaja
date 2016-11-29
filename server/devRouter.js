const express = require('express');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const config = require('../config/webpack.development');

const router = express.Router();  // eslint-disable-line new-cap
const compiler = webpack(config);
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

const devMiddleware = webpackMiddleware(compiler, serverSettings);
router.use(devMiddleware);
router.use(webpackHotMiddleware(compiler));

router.use((req, res, next) => {
  if (req.method === 'GET' && req.accepts('html')) {
    res.write(devMiddleware.fileSystem.readFileSync('/index.html'));
    res.send();
    next();
  } else {
    next();
  }
});

module.exports = router;
