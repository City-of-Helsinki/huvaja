import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import recurringReservationsActions from 'actions/recurringReservations';
import RecurringReservationControls from './RecurringReservationControls';

function getFrequencyOptions() {
  return [
    { label: 'Päivittäin', value: 'days' },
    { label: 'Viikoittain', value: 'weeks' },
    { label: 'Kuukausittain', value: 'months' },
  ];
}

function recurringReservationsSelector(state) {
  return state.recurringReservations;
}

export const selector = createSelector(
  recurringReservationsSelector,
  recurringReservations => ({
    frequency: recurringReservations.frequency,
    frequencyOptions: getFrequencyOptions(),
    isVisible: Boolean(recurringReservations.baseTime),
    lastTime: recurringReservations.lastTime,
    numberOfOccurrences: recurringReservations.numberOfOccurrences,
  })
);

const actions = {
  changeFrequency: recurringReservationsActions.changeFrequency,
  changeLastTime: recurringReservationsActions.changeLastTime,
  changeNumberOfOccurrences: recurringReservationsActions.changeNumberOfOccurrences,
};

export function mergeProps(stateProps, dispatchProps) {
  return {
    ...stateProps,
    ...dispatchProps,
    changeFrequency: ({ value }) => dispatchProps.changeFrequency(value),
  };
}

export default connect(selector, actions, mergeProps)(RecurringReservationControls);
