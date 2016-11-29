/* eslint-disable no-console */
const express = require('express');
const morgan = require('morgan');

const auth = require('./auth');
const devRouter = require('./devRouter');

const app = express();
const port = 3000;

console.log('Starting development server...');

// Request logging
app.use(morgan('combined'));

app.use('/', auth);
app.use('/', devRouter);

app.listen(port, 'localhost', (error) => { // eslint-disable-line
  if (error) {
    return console.log(error);
  }

  console.log(`Listening at http://localhost:${port}/`);
});
