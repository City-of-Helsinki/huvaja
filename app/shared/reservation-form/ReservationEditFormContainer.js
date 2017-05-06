import moment from 'moment';
import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';

import { fetchResource } from 'api/actions';
import { editReservation } from 'api/actions/reservations';
import createFormSubmitHandler from 'utils/createFormSubmitHandler';
import ReservationForm from './ReservationForm';

function reservationSelector(state, props) {
  return props.reservation;
}

function resourcesSelector(state) {
  return state.data.resources;
}

const resourceSelector = createSelector(
  reservationSelector,
  resourcesSelector,
  (reservation, resources) => resources[reservation.resource]
);

function getInitialTime(reservation) {
  const begin = moment(reservation.begin);
  const end = moment(reservation.end);
  return {
    begin: {
      date: begin.format('YYYY-MM-DD'),
      time: begin.format('HH:mm'),
    },
    end: {
      date: end.format('YYYY-MM-DD'),
      time: end.format('HH:mm'),
    },
  };
}

const initialValuesSelector = createSelector(
  reservationSelector,
  resourceSelector,
  (reservation, resource) => ({
    eventDescription: reservation.eventDescription,
    eventName: reservation.eventSubject,
    hostName: reservation.hostName,
    numberOfParticipants: reservation.numberOfParticipants,
    reserverName: reservation.reserverName,
    resource: resource.name.fi,
    time: getInitialTime(reservation),
  })
);

const formDateSelector = state => (
  state.form.resourceReservation &&
  state.form.resourceReservation.values.time &&
  state.form.resourceReservation.values.time.begin.date
);

const timelineDateSelector = createSelector(
  formDateSelector,
  initialValuesSelector,
  (formDate, initialValues) => formDate || initialValues.time.begin.date
);

export const selector = createStructuredSelector({
  initialValues: initialValuesSelector,
  timelineDate: timelineDateSelector,
});

const actions = {
  fetchResource,
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
          id: props.reservation.id,
          number_of_participants: values.numberOfParticipants,
          reserver_name: values.reserverName,
          resource: props.resource.id,
        },
        actionOptions
      )
    ),
  };
}

export default connect(selector, actions, mergeProps)(ReservationForm);
