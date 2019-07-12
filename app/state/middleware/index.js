import { applyMiddleware } from 'redux';
import { apiMiddleware } from 'redux-api-middleware';

import createRecurringReservations from './createRecurringReservations';
import sideEffects from './sideEffects';
import createSentryMiddleware from './sentry';

const middlewares = [
  apiMiddleware,
  sideEffects,
  createRecurringReservations,
];
const sentryMiddleware = createSentryMiddleware();
if (sentryMiddleware) {
  middlewares.push(sentryMiddleware);
}

const storeEnhancers = [applyMiddleware(...middlewares)];

const isDevelopment = process.env.NODE_ENV !== 'production';
if (isDevelopment) {
  const createLogger = require('redux-logger'); // eslint-disable-line global-require

  const loggerMiddleware = createLogger({
    collapsed: true,
    duration: true,
  });
  storeEnhancers.push(applyMiddleware(loggerMiddleware));
}

export default storeEnhancers;
