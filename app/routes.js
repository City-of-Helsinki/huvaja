import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from 'pages/App';
import HomePage from 'pages/home';

export default (
  <Route>
    <Route component={App} path="/">
      <IndexRoute component={HomePage} />
    </Route>
  </Route>
);
