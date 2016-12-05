import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { makeReservation } from 'api/actions/reservations';
import ReservationForm from './ReservationForm';

const resourceSelector = (state, props) => props.resource;

const reservationFormSelector = createSelector(
  resourceSelector,
  resource => ({
    initialValues: {
      resource: resource.name.fi,
    },
  })
);

const actions = {
  makeReservation,
};

export function mergeProps(stateProps, dispatchProps, ownProps) {
  const props = { ...ownProps, ...stateProps, ...dispatchProps };
  return {
    ...props,
    onSubmit: values => props.makeReservation({
      begin: values.time.begin,
      end: values.time.end,
      resource: props.resource.id,
      event_subject: values.eventName,
      number_of_participants: values.numberOfParticipants,
    }),
  };
}

export default connect(reservationFormSelector, actions, mergeProps)(ReservationForm);
