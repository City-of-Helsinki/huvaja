import { camelizeKeys } from 'humps';
import pick from 'lodash/pick';
import moment from 'moment';
import { handleActions } from 'redux-actions';

import timeUtils from 'utils/timeUtils';

const DATE_FORMAT = 'YYYY-MM-DD';
const TIME_FORMAT = 'HH:mm';

function getAvailableFilters(availableBetween) {
  if (!availableBetween) return {};
  const parts = availableBetween.split(',');
  if (parts.length !== 2) return {};
  const start = timeUtils.parseDateTime(parts[0]);
  const end = timeUtils.parseDateTime(parts[1]);
  if (!start || !end) return {};
  return {
    availableStartDate: start.format(DATE_FORMAT),
    availableStartTime: start.format(TIME_FORMAT),
    availableEndDate: end.format(DATE_FORMAT),
    availableEndTime: end.format(TIME_FORMAT),
  };
}

export function parseUrlFilters(queryParams) {
  const camelized = camelizeKeys(queryParams);
  const { availableBetween, ...regular } = camelized;
  const correctKeys = Object.keys(getInitialState());
  const cleanedRegular = pick(regular, correctKeys);
  return { ...getAvailableFilters(availableBetween), ...cleanedRegular };
}

export function getInitialState() {
  const today = moment().format('YYYY-MM-DD');
  return {
    availableStartDate: today,
    availableStartTime: '',
    availableEndDate: today,
    availableEndTime: '',
    date: today,
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
    const urlFilters = parseUrlFilters({ ...action.payload.query });
    return {
      ...getInitialState(),
      ...urlFilters,
    };
  },
}, getInitialState());
