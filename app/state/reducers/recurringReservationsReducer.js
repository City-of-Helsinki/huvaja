import filter from 'lodash/filter';
import moment from 'moment';
import { handleActions } from 'redux-actions';
import { actionTypes as formActions } from 'redux-form';

import actions from 'actions/recurringReservations';

const MAX_DURATION_IN_YEARS = 1;
const MAX_OCCURRENCES = 100;

const initialState = {
  baseTime: null,
  frequency: 'weeks',
  lastTime: null,
  numberOfOccurrences: 1,
  reservations: [],
};

export function populateReservations({ baseTime, frequency, numberOfOccurrences }) {
  const reservations = [];
  if (!baseTime || !frequency) {
    return reservations;
  }
  const begin = moment(baseTime.begin);
  const end = moment(baseTime.end);
  for (let i = 1; i <= numberOfOccurrences; i += 1) {
    reservations.push({
      begin: begin.clone().add(i, frequency).toISOString(),
      end: end.clone().add(i, frequency).toISOString(),
    });
  }
  return reservations;
}

function setOccurrences(state, numberOfOccurrences) {
  const occurrences = numberOfOccurrences > MAX_OCCURRENCES ?
    MAX_OCCURRENCES :
    numberOfOccurrences;
  return {
    ...state,
    numberOfOccurrences: occurrences,
    lastTime: (
        moment(state.baseTime.begin)
        .add(occurrences, state.frequency)
        .format('YYYY-MM-DD')
    ),
  };
}

function limitDateState(state) {
  const start = moment(state.baseTime.begin).startOf('day');
  const end = moment(state.lastTime).startOf('day');
  const duration = moment.duration(end.diff(start));
  const maxDuration = moment.duration(MAX_DURATION_IN_YEARS, 'years');

  if (duration > maxDuration) {
    const numberOfOccurrences = parseInt(maxDuration.as(state.frequency), 10);
    return setOccurrences(state, numberOfOccurrences);
  }
  return state;
}

function adjustState(state, changeLastTime = false) {
  if (!state.baseTime || !state.frequency || (!state.lastTime && !state.numberOfOccurrences)) {
    return { ...state, reservations: [] };
  }
  let numberOfOccurrences = 1;
  if (changeLastTime) {
    const start = moment(state.baseTime.begin).startOf('day');
    const end = moment(state.lastTime).startOf('day');
    const duration = moment.duration(end.diff(start));
    if (duration > 0) {
      numberOfOccurrences = parseInt(duration.as(state.frequency), 10);
    }
  } else {
    numberOfOccurrences = state.numberOfOccurrences;
  }
  const newState = limitDateState(setOccurrences(state, numberOfOccurrences));
  return { ...newState, reservations: populateReservations(newState) };
}

export default handleActions({
  [actions.changeBaseTime]: (state, action) => adjustState({
    ...state, baseTime: action.payload,
  }),
  [actions.changeFrequency]: (state, action) => adjustState({
    ...state, frequency: action.payload,
  }),
  [actions.changeLastTime]: (state, action) => adjustState({
    ...state, lastTime: action.payload,
  }, true),
  [actions.changeNumberOfOccurrences]: (state, action) => adjustState({
    ...state, numberOfOccurrences: parseInt(action.payload, 10),
  }),
  [formActions.INITIALIZE]: (state, action) => {
    if (action.meta.form === 'resourceReservation') return initialState;
    return state;
  },
  [actions.removeReservation]: (state, action) => ({
    ...state,
    reservations: filter(state.reservations, reservation => reservation.begin !== action.payload),
  }),
}, initialState);
