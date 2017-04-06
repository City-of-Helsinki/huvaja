import { camelizeKeys } from 'humps';
import moment from 'moment';
import { handleActions } from 'redux-actions';

function getInitialState() {
  return {
    date: moment().format('YYYY-MM-DD'),
    equipment: '',
    isFavorite: '',
    people: '',
    search: '',
    type: '',
    unit: '',
  };
}

export default handleActions({
  ENTER_OR_CHANGE_SEARCH_PAGE: (state, action) => {
    const filters = action.payload.query;
    return camelizeKeys({ ...getInitialState(), ...filters });
  },
}, getInitialState());
