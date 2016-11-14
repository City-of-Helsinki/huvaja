/* eslint-disable global-require */

const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
  throw new Error('Production should only use Nginx, not Express.');
} else {
  require('./development-server');
}
