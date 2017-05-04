import { camelizeKeys } from 'humps';
import pick from 'lodash/pick';
import moment from 'moment';
import { handleActions } from 'redux-actions';

export function parseUrlFilters(queryParams) {
  const camelized = camelizeKeys(queryParams);
  const correctKeys = Object.keys(getInitialState());
  return pick(camelized, correctKeys);
}

export function getInitialState() {
  return {
    end: moment().add(1, 'weeks').format('YYYY-MM-DD'),
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
    const urlFilters = parseUrlFilters({ ...action.payload.query });
    return {
      ...getInitialState(),
      ...urlFilters,
    };
  },
}, getInitialState());
