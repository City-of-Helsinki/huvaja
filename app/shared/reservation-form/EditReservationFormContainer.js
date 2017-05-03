import moment from 'moment';
import React from 'react';
import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';

import { editReservation } from 'api/actions/reservations';
import createFormSubmitHandler from 'utils/createFormSubmitHandler';
// import ReservationForm from './ReservationForm';


function reservationSelector(state, props) {
  return state.data.reservations[props.reservationId] || {};
}

function resourcesSelector(state) {
  return state.data.resources || [];
}

const resourceSelector = createSelector(
  reservationSelector,
  resourcesSelector,
  (reservation, resources) => resources[reservation && reservation.resource] || {}
);

const initialValuesSelector = createSelector(
  reservationSelector,
  resourceSelector,
  (reservation, resource) => ({
    begin: reservation.begin,
    end: reservation.end,
    eventDescription: reservation.eventDescription,
    eventName: reservation.eventSubject,
    hostName: reservation.hostName,
    numberOfParticipants: reservation.numberOfParticipants,
    reserverName: reservation.reserverName,
    resource: (resource.name && resource.name.fi) || '',
  })
);

export const selector = createStructuredSelector({
  initialValues: initialValuesSelector,
});

const actions = {
  editReservation,
};

function formatTime({ date, time }) {
  return moment(`${date}T${time}:00`).format();
}

export function mergeProps(stateProps, dispatchProps, ownProps) {
  const props = { ...ownProps, ...stateProps, ...dispatchProps };
  return {
    ...props,
    onSubmit: createFormSubmitHandler(
      (actionOptions, values) => props.editReservation(
        {
          begin: formatTime(values.time.begin),
          end: formatTime(values.time.end),
          event_description: values.eventDescription,
          event_subject: values.eventName,
          host_name: values.hostName,
          number_of_participants: values.numberOfParticipants,
          reserver_name: values.reserverName,
          resource: props.resource.id,
        },
        actionOptions
      )
    ),
  };
}

function ReservationFormContainer() {
  return (<h4>Varaus tehty: some day at some time</h4>);
}

export default connect(selector, actions, mergeProps)(ReservationFormContainer);
