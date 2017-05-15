import 'moment/locale/fi';
import 'moment-timezone';
import moment from 'moment';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { applyRouterMiddleware, browserHistory, Router } from 'react-router';
import { useScroll } from 'react-router-scroll';

import 'assets/styles/main.scss';
import store from 'state/store';
import routes from './routes';

moment.tz.setDefault('Europe/Helsinki');

render(
  <Provider store={store}>
    <Router
      history={browserHistory}
      render={applyRouterMiddleware(useScroll())}
    >
      {routes}
    </Router>
  </Provider>,
  document.getElementById('root')
);
