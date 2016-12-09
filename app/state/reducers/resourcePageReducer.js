import moment from 'moment';
import { handleActions } from 'redux-actions';

function getInitialState() {
  return {
    begin: moment().format('YYYY-MM-DD'),
  };
}

export default handleActions({
  ENTER_OR_CHANGE_RESOURCE_PAGE: (state, action) => ({
    ...getInitialState(),
    ...action.payload.query,
  }),
}, getInitialState());
