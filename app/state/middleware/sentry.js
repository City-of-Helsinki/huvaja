import * as Sentry from '@sentry/browser';
import createSentryMiddleware from 'redux-sentry-middleware';


if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
  });
}

function createMiddleware() {
  if (!process.env.SENTRY_DSN) {
    return null;
  }
  return createSentryMiddleware(Sentry, {
    getUserContext: (state) => {
      const user = state.auth.user;
      const email = user.emails ? user.emails[0].value : '';

      return {
        email,
        name: `${user.firstName} ${user.lastName}`,
        id: user.id,
      };
    },
    stateTransformer: (state) => {
      const out = { ...state };
      delete out.auth;
      delete out.data;
      return out;
    },
  });
}

export default createMiddleware;
