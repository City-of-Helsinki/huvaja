import 'babel-polyfill';
import 'moment/locale/fi';
import 'moment-timezone';
import moment from 'moment';

/* eslint-disable no-console */
console.warning = (...args) => { throw Error(`console.warning: ${args.join(' ')}`); };
console.error = (...args) => { throw Error(`console.error: ${args.join(' ')}`); };
/* eslint-enable */

moment.tz.setDefault('Europe/Helsinki');

const testsContext = require.context('../app', true, /spec.js$/);
testsContext.keys().forEach(testsContext);
