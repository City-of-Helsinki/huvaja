import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from 'pages/App';
import HomePage from 'pages/home';
import ResourcePage from 'pages/resource';

export default (
  <Route>
    <Route component={App} path="/">
      <IndexRoute component={HomePage} />
      <Route component={ResourcePage} path="/resources/:id" />
    </Route>
  </Route>
);
