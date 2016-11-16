import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from 'pages/App';
import SearchPage from 'pages/search';
import ResourcePage from 'pages/resource';

export default (
  <Route>
    <Route component={App} path="/">
      <IndexRoute component={SearchPage} />
      <Route component={ResourcePage} path="/resources/:id" />
    </Route>
  </Route>
);
