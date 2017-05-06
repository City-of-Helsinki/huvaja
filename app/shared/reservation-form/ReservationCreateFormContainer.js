import moment from 'moment';
import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';

import { fetchResource } from 'api/actions';
import { makeReservation } from 'api/actions/reservations';
import { currentUserSelector } from 'auth/selectors';
import { slotSize } from 'shared/availability-view';
import createFormSubmitHandler from 'utils/createFormSubmitHandler';
import ReservationForm from './ReservationForm';

function datePropSelector(state, props) {
  return props.date;
}

function queryBeginSelector(state, props) {
  return props.queryBegin;
}

function resourceSelector(state, props) {
  return props.resource;
}

function getInitialTime(date) {
  const begin = moment(date, moment.ISO_8601, true);
  if (begin.isValid() && date.indexOf('T') !== -1) {
    const end = begin.clone().add(slotSize, 'minutes');
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
  return {
    begin: { date, time: null },
    end: { date, time: null },
  };
}

const initialValuesSelector = createSelector(
  currentUserSelector,
  resourceSelector,
  datePropSelector,
  queryBeginSelector,
  (currentUser, resource, date, queryBegin) => ({
    hostName: currentUser ? currentUser.displayName : '',
    reserverName: currentUser ? currentUser.displayName : '',
    resource: resource.name.fi,
    time: getInitialTime(queryBegin || date),
  })
);

const formDateSelector = state => (
  state.form.resourceReservation &&
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
  makeReservation,
};

function formatTime({ date, time }) {
  return moment(`${date}T${time}:00`).format();
}

export function mergeProps(stateProps, dispatchProps, ownProps) {
  const props = { ...ownProps, ...stateProps, ...dispatchProps };
  return {
    ...props,
    onSubmit: createFormSubmitHandler(
      (actionOptions, values) => props.makeReservation(
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

export default connect(selector, actions, mergeProps)(ReservationForm);
