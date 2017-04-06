import 'moment/locale/fi';
import 'moment-timezone';
import moment from 'moment';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { browserHistory, Router } from 'react-router';

import 'assets/styles/app.less';
import store from 'state/store';
import routes from './routes';

moment.tz.setDefault('Europe/Helsinki');

render(
  <Provider store={store}>
    <Router history={browserHistory}>
      {routes}
    </Router>
  </Provider>,
  document.getElementById('root')
);
