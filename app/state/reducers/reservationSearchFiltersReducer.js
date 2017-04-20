import isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import { handleActions } from 'redux-actions';

export function getInitialState() {
  return {
    end: moment().add(1, 'months').format('YYYY-MM-DD'),
    eventSubject: '',
    hasCatering: '',
    hasEquipment: '',
    hostName: '',
    isFavoriteResource: '',
    isOwn: '',
    reserverName: '',
    resourceName: '',
    start: moment().format('YYYY-MM-DD'),
    unit: '',
  };
}

export default handleActions({
  CHANGE_RESERVATION_SEARCH_FILTERS: (state, action) => ({
    ...state,
    ...action.payload,
  }),
  ENTER_OR_CHANGE_RESERVATION_SEARCH_PAGE: (state, action) => {
    if (isEmpty(action.payload.query)) return getInitialState();
    return state;
  },
}, getInitialState());
