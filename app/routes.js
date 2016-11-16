import React from 'react';
import { Route, IndexRoute } from 'react-router';

import AppContainer from 'pages/AppContainer';
import SearchPage from 'pages/search';
import ResourcePage from 'pages/resource';

export default (
  <Route>
    <Route component={AppContainer} path="/">
      <IndexRoute component={SearchPage} />
      <Route component={ResourcePage} path="/resources/:id" />
    </Route>
  </Route>
);
