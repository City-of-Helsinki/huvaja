import isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import { handleActions } from 'redux-actions';

export function getInitialState() {
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
  CHANGE_RESOURCE_SEARCH_FILTERS: (state, action) => ({
    ...state,
    ...action.payload,
  }),
  ENTER_OR_CHANGE_SEARCH_PAGE: (state, action) => {
    if (isEmpty(action.payload.query)) return getInitialState();
    return state;
  },
}, getInitialState());
