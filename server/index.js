/* eslint-disable global-require, no-console */
const isProduction = process.env.NODE_ENV === 'production';

if (!isProduction) {
  const path = require('path');
  require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
}

const express = require('express');
const morgan = require('morgan');

const auth = require('./auth');

const app = express();
const port = isProduction ? 8080 : 3000;

// Request logging
app.use(morgan('combined'));

app.use('/', auth);

if (isProduction) {
  const productionRouter = require('./productionRouter');

  console.log('Starting production server...');
  app.use('/', productionRouter);
} else {
  const devRouter = require('./devRouter');

  console.log('Starting development server...');
  app.use('/', devRouter);
}

app.listen(port, (error) => {
  if (error) {
    console.log(error);
  }
  console.log(`Listening at http://localhost:${port}/`);
});
