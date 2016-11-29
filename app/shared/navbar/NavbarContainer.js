import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { currentUserSelector } from 'auth/selectors';
import Navbar from './Navbar';

export const selector = createStructuredSelector({
  user: currentUserSelector,
});

export default connect(selector)(Navbar);
