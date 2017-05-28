import moment from 'moment';
import React from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { createSelector, createStructuredSelector } from 'reselect';

import { fetchCateringProducts, fetchCateringProductCategories, fetchResource } from 'api/actions';
import recurringReservationsActions from 'actions/recurringReservations';
import { makeReservation } from 'api/actions/reservations';
import { createCateringProviderSelector } from 'api/selectors';
import { currentUserSelector } from 'auth/selectors';
import { slotSize } from 'shared/availability-view';
import createFormSubmitHandler from 'utils/createFormSubmitHandler';
import timeUtils from 'utils/timeUtils';
import ReservationForm from './ReservationForm';
import utils from './utils';

function beginPropSelector(state, props) {
  return props.begin;
}

function endPropSelector(state, props) {
  return props.end;
}

function initialResourceSelector(state, props) {
  return props.initialResource;
}

function getInitialTime(beginString, endString) {
  const begin = moment(beginString, moment.ISO_8601, true);
  if (begin.isValid() && beginString.indexOf('T') !== -1) {
    let end = moment(endString, moment.ISO_8601, true);
    end = end.isValid() ? end : begin.clone().add(slotSize, 'minutes');
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
    begin: { date: beginString, time: null },
    end: { date: beginString, time: null },
  };
}

const initialValuesSelector = createSelector(
  currentUserSelector,
  initialResourceSelector,
  beginPropSelector,
  endPropSelector,
  (currentUser, initialResource, begin, end) => ({
    hostName: currentUser ? currentUser.displayName : '',
    reserverName: currentUser ? currentUser.displayName : '',
    resource: initialResource && initialResource.id,
    time: getInitialTime(begin, end),
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

const timeRangeSelector = state => (
  state.form.resourceReservation &&
  state.form.resourceReservation.values.time
);

function resourcesSelector(state) {
  return state.data.resources;
}

const formResourceIdSelector = state => (
  state.form.resourceReservation &&
  state.form.resourceReservation.values.resource
);

const resourceIdSelector = createSelector(
  formResourceIdSelector,
  initialValuesSelector,
  (formResourceId, initialValues) => formResourceId || initialValues.resource
);

const resourceSelector = createSelector(
  resourcesSelector,
  resourceIdSelector,
  (resources, resourceId) => resources[resourceId]
);

const unitIdSelector = createSelector(
  resourceSelector,
  resource => resource && resource.unit
);

const numberOfParticipantsSelector = state => (
  state.form.resourceReservation &&
  state.form.resourceReservation.values.numberOfParticipants &&
  parseInt(state.form.resourceReservation.values.numberOfParticipants, 10)
);

const recurringReservationsSelector = state => (
  state.recurringReservations.reservations
);
const baseReservationSelector = createSelector(
  timeRangeSelector,
  (timeRange) => {
    const { begin, end } = timeUtils.getDateTimeRangeFieldMoments(timeRange);
    if (!begin || !end) return [];
    return [{
      begin: begin.format(),
      end: end.format(),
    }];
  }
);

const isRecurringSelector = state => Boolean(
  state.form.resourceReservation &&
  state.form.resourceReservation.values.isRecurring
);

export const selector = createStructuredSelector({
  baseReservation: baseReservationSelector,
  cateringProvider: createCateringProviderSelector(unitIdSelector),
  initialValues: initialValuesSelector,
  isRecurring: isRecurringSelector,
  numberOfParticipants: numberOfParticipantsSelector,
  recurringReservations: recurringReservationsSelector,
  resource: resourceSelector,
  timelineDate: timelineDateSelector,
  timeRange: timeRangeSelector,
});

const actions = {
  changeBaseTime: recurringReservationsActions.changeBaseTime,
  fetchCateringProducts,
  fetchCateringProductCategories,
  fetchResource,
  makeReservation,
  removeRecurringReservation: recurringReservationsActions.removeReservation,
};

function formatTime({ date, time }) {
  return moment(`${date}T${time}:00`).format();
}

export function mergeProps(stateProps, dispatchProps, ownProps) {
  const props = { ...ownProps, ...stateProps, ...dispatchProps };
  const callback = (actionOptions, values) => {
    const reservationData = {
      begin: formatTime(values.time.begin),
      end: formatTime(values.time.end),
      event_description: values.eventDescription,
      event_subject: values.eventSubject,
      host_name: values.hostName,
      number_of_participants: values.numberOfParticipants,
      reserver_name: values.reserverName,
      resource: values.resource,
    };
    const options = (
      values.isRecurring ?
      {
        ...actionOptions,
        successMeta: {
          ...actionOptions.successMeta,
          recurringReservations: stateProps.recurringReservations,
          reservationData,
        },
      } :
      actionOptions
    );
    props.makeReservation(reservationData, options);
  };
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

function UnconnectedReservationForm(props) {
  return <ReservationForm allowRecurring {...props} />;
}

export default connect(selector, actions, mergeProps)(UnconnectedReservationForm);
