import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from 'screens/App';
import HomePage from 'screens/home';

export default (
  <Route>
    <Route component={App} path="/">
      <IndexRoute component={HomePage} />
    </Route>
  </Route>
);
