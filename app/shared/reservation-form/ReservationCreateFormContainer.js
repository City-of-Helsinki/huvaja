import moment from 'moment';
import React from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { createSelector, createStructuredSelector } from 'reselect';

import uiActions from 'actions/uiActions';
import {
  fetchCateringProducts,
  fetchCateringProductCategories,
  fetchResource,
  makeCateringOrder,
} from 'api/actions';
import recurringReservationsActions from 'actions/recurringReservations';
import { makeReservation } from 'api/actions/reservations';
import { createCateringProviderSelector } from 'api/selectors';
import { createAlwaysResolvingAPIPromise } from 'api/utils';
import { currentUserSelector } from 'auth/selectors';
import { slotSize } from 'shared/availability-view';
import cateringUtils from 'shared/reservation-form/catering/utils';
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
    if (!begin || !end) return null;
    return {
      begin: begin.format(),
      end: end.format(),
    };
  }
);

const isRecurringSelector = state => Boolean(
  state.form.resourceReservation &&
  state.form.resourceReservation.values.isRecurring
);

const isOrderingCateringSelector = (state) => {
  const cateringOrder = (
    state.form.resourceReservation &&
    state.form.resourceReservation.values.cateringOrder
  );
  return cateringUtils.hasOrders(cateringOrder);
};

export const selector = createStructuredSelector({
  baseReservation: baseReservationSelector,
  cateringProvider: createCateringProviderSelector(unitIdSelector),
  formDate: formDateSelector,
  initialValues: initialValuesSelector,
  isOrderingCatering: isOrderingCateringSelector,
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
  makeCateringOrder,
  makeReservation,
  removeRecurringReservation: recurringReservationsActions.removeReservation,
  showReservationSuccessModal: uiActions.showReservationSuccessModal,
};

function formatTime({ date, time }) {
  return moment(`${date}T${time}:00`).format();
}

// Note that recurring reservations and catering orders cannot be created
// at the same time, so meta will only include data for one of these.
function getExtraSuccessMeta(
  actionOptions,
  values,
  props,
  reservationData
) {
  if (values.isRecurring) {
    return {
      recurringReservations: props.recurringReservations,
      reservationData,
    };
  }
  if (cateringUtils.hasOrders(values.cateringOrder)) {
    return {
      cateringOrder: values.cateringOrder,
    };
  }
  return {};
}

export function doCreateCateringOrder(
  actionOptions,
  createReservationSuccessAction,
  makeOrder
) {
  if (!createReservationSuccessAction.meta.cateringOrder) {
    // No catering order to create so just resolve the promise.
    actionOptions.successMeta.sideEffect();
    return;
  }
  const cateringOrderData = {
    reservation: createReservationSuccessAction.payload.id,
    ...createReservationSuccessAction.meta.cateringOrder,
  };
  makeOrder(cateringOrderData, actionOptions);
}

export function mergeProps(stateProps, dispatchProps, ownProps) {
  const props = { ...ownProps, ...stateProps, ...dispatchProps };
  const createReservation = (actionOptions, values) => {
    const reservationData = {
      begin: formatTime(values.time.begin),
      end: formatTime(values.time.end),
      event_description: values.eventDescription,
      event_subject: values.eventSubject,
      host_name: values.hostName,
      number_of_participants: values.numberOfParticipants,
      participants: values.participants,
      reserver_name: values.reserverName,
      resource: values.resource,
    };
    const options = {
      ...actionOptions,
      successMeta: {
        ...actionOptions.successMeta,
        ...getExtraSuccessMeta(actionOptions, values, props, reservationData),
      },
    };
    props.makeReservation(reservationData, options);
  };
  const createCateringOrder = (actionOptions, createReservationSuccessAction) => (
    doCreateCateringOrder(
      actionOptions,
      createReservationSuccessAction,
      props.makeCateringOrder,
    )
  );
  const successHandler = () => {
    const url = utils.getResourceUrl(props.resource.id, props.formDate);
    // Use setTimeout to make url change happen after form handling has
    // been fully completed.
    window.setTimeout(
      () => {
        browserHistory.push(url);
        dispatchProps.showReservationSuccessModal();
      },
      0
    );
  };
  return {
    ...props,
    // onSubmit will first send POST reservation request. On success, if the
    // reservation form has catering order data, catering order is POSTed.
    // If reservation form has recurring reservation data, all reservations
    // except the first one will be sent by a middleware. Creating recurring
    // reservations with catering orders is not allowed.
    onSubmit: (...args) => (
      createFormSubmitHandler(createReservation)(...args)
        .then(createAlwaysResolvingAPIPromise(createCateringOrder))
        .then(successHandler)
    ),
  };
}

export function UnconnectedReservationCreateFormContainer(props) {
  return <ReservationForm allowRecurring {...props} />;
}

export default connect(selector, actions, mergeProps)(UnconnectedReservationCreateFormContainer);
