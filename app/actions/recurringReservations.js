import { createAction } from 'redux-actions';

export default {
  changeBaseTime: createAction('app/recurringReservations/CHANGE_BASE_TIME'),
  changeFrequency: createAction('app/recurringReservations/CHANGE_FREQUENCY'),
  changeLastTime: createAction('app/recurringReservations/CHANGE_LAST_TIME'),
  changeNumberOfOccurrences: createAction('app/recurringReservations/CHANGE_NUMBER_OF_OCCURRENCES'),
  removeReservation: createAction('app/recurringReservations/REMOVE_RESERVATION'),
};
