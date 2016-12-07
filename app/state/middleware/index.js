import { applyMiddleware } from 'redux';
import { apiMiddleware } from 'redux-api-middleware';

import sideEffects from './sideEffects';

const isDevelopment = process.env.NODE_ENV !== 'production';
const storeEnhancers = [applyMiddleware(apiMiddleware, sideEffects)];

if (isDevelopment) {
  const createLogger = require('redux-logger'); // eslint-disable-line global-require

  const loggerMiddleware = createLogger({
    collapsed: true,
    duration: true,
  });
  storeEnhancers.push(applyMiddleware(loggerMiddleware));
}

export default storeEnhancers;
