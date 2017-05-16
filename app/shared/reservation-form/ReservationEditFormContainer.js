import moment from 'moment';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { createSelector, createStructuredSelector } from 'reselect';

import { fetchResource } from 'api/actions';
import { editReservation } from 'api/actions/reservations';
import createFormSubmitHandler from 'utils/createFormSubmitHandler';
import ReservationForm from './ReservationForm';
import utils from './utils';

function reservationSelector(state, props) {
  return props.reservation;
}

function resourcesSelector(state) {
  return state.data.resources;
}

function initialResourceIdSelector(state, props) {
  return props.initialResource.id;
}

const formResourceIdSelector = state => (
  state.form.resourceReservation &&
  state.form.resourceReservation.values.resource
);

const resourceIdSelector = createSelector(
  formResourceIdSelector,
  initialResourceIdSelector,
  (formResourceId, initialResourceId) => formResourceId || initialResourceId
);

const resourceSelector = createSelector(
  resourceIdSelector,
  resourcesSelector,
  (resourceId, resources) => resources[resourceId]
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
  initialResourceIdSelector,
  (reservation, resourceId) => ({
    eventDescription: reservation.eventDescription,
    eventName: reservation.eventSubject,
    hostName: reservation.hostName,
    numberOfParticipants: reservation.numberOfParticipants,
    reserverName: reservation.reserverName,
    resource: resourceId,
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

const timeRangeSelector = state => (
  state.form.resourceReservation &&
  state.form.resourceReservation.values.time
);

export const selector = createStructuredSelector({
  initialValues: initialValuesSelector,
  resource: resourceSelector,
  timelineDate: timelineDateSelector,
  timeRange: timeRangeSelector,
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
  const callback = (actionOptions, values) => props.editReservation(
    {
      begin: formatTime(values.time.begin),
      end: formatTime(values.time.end),
      event_description: values.eventDescription,
      event_subject: values.eventName,
      host_name: values.hostName,
      id: props.reservation.id,
      number_of_participants: values.numberOfParticipants,
      reserver_name: values.reserverName,
      resource: values.resource,
    },
    actionOptions
  );
  const successHandler = (action) => {
    const begin = utils.parseBeginDate(action);
    const url = utils.getResourceUrl(props.resource.id, begin);
    // Use setTimeout to make url change happen after form handling has
    // been fully completed.
    window.setTimeout(
      () => browserHistory.push(url),
      0
    );
  };
  return {
    ...props,
    onSubmit: (...args) => (
      createFormSubmitHandler(callback)(...args)
        .then(successHandler)
    ),
  };
}

export default connect(selector, actions, mergeProps)(ReservationForm);
