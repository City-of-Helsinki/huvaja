import isEqual from 'lodash/isEqual';
import pick from 'lodash/pick';
import moment from 'moment';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { createSelector, createStructuredSelector } from 'reselect';

import uiActions from 'actions/uiActions';
import {
  deleteCateringOrder,
  editCateringOrder,
  fetchCateringProducts,
  fetchCateringProductCategories,
  fetchResource,
  makeCateringOrder,
} from 'api/actions';
import { editReservation } from 'api/actions/reservations';
import { createCateringProviderSelector } from 'api/selectors';
import { createAlwaysResolvingAPIPromise } from 'api/utils';
import cateringUtils from 'shared/reservation-form/catering/utils';
import {
  fields as cateringOrderFields,
} from 'shared/reservation-form/catering/catering-form/CateringForm';
import createFormSubmitHandler from 'utils/createFormSubmitHandler';
import ReservationForm from './ReservationForm';
import utils from './utils';

function reservationSelector(state, props) {
  return props.reservation;
}

function cateringOrderSelector(state, props) {
  return props.cateringOrder;
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

const unitIdSelector = createSelector(resourceSelector, resource => resource && resource.unit);

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
  cateringOrderSelector,
  (reservation, resourceId, cateringOrder) => ({
    cateringOrder: cateringOrder && pick(cateringOrder, cateringOrderFields),
    eventDescription: reservation.eventDescription,
    eventSubject: reservation.eventSubject,
    hostName: reservation.hostName,
    numberOfParticipants: reservation.numberOfParticipants,
    participants: reservation.participants,
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

const numberOfParticipantsSelector = state => (
  state.form.resourceReservation &&
  state.form.resourceReservation.values.numberOfParticipants &&
  parseInt(state.form.resourceReservation.values.numberOfParticipants, 10)
);

const isOrderingCateringSelector = (state) => {
  const cateringOrder = (
    state.form.resourceReservation &&
    state.form.resourceReservation.values.cateringOrder
  );
  return cateringUtils.hasOrders(cateringOrder);
};

export const selector = createStructuredSelector({
  cateringProvider: createCateringProviderSelector(unitIdSelector),
  formDate: formDateSelector,
  initialValues: initialValuesSelector,
  isOrderingCatering: isOrderingCateringSelector,
  numberOfParticipants: numberOfParticipantsSelector,
  resource: resourceSelector,
  timelineDate: timelineDateSelector,
  timeRange: timeRangeSelector,
});

const actions = {
  deleteCateringOrder,
  editCateringOrder,
  editReservation,
  fetchCateringProducts,
  fetchCateringProductCategories,
  fetchResource,
  makeCateringOrder,
  showReservationSuccessModal: uiActions.showReservationSuccessModal,
};

function formatTime({ date, time }) {
  return moment(`${date}T${time}:00`).format();
}

// Create, edit or delete depending on how the catering order data has changed.
// Or, just resolve the promise if nothing has changed.
export function doUpdateCateringOrder(
  actionOptions,
  editReservationSuccessAction,
  props
) {
  const reservationId = editReservationSuccessAction.payload.id;
  const oldFormData = props.initialValues.cateringOrder;
  const newFormData = editReservationSuccessAction.meta.cateringOrder;
  const data = {
    ...newFormData,
    reservation: reservationId,
  };
  if (props.cateringOrder) {
    data.id = props.cateringOrder.id;
  }

  const hasOrders = cateringUtils.hasOrders;
  if (!hasOrders(oldFormData) && hasOrders(newFormData)) {
    props.makeCateringOrder(data, actionOptions);
  } else if (hasOrders(oldFormData) && !hasOrders(newFormData)) {
    props.deleteCateringOrder(data.id, {
      ...actionOptions,
      meta: {
        ...actionOptions.meta,
        id: data.id,
        reservationId,
      },
    });
  } else if (isEqual(oldFormData, newFormData)) {
    actionOptions.successMeta.sideEffect();
  } else {
    props.editCateringOrder(data, actionOptions);
  }
}

export function mergeProps(stateProps, dispatchProps, ownProps) {
  const props = { ...ownProps, ...stateProps, ...dispatchProps };
  const updateReservation = (actionOptions, values) => {
    const reservationData = {
      begin: formatTime(values.time.begin),
      end: formatTime(values.time.end),
      event_description: values.eventDescription,
      event_subject: values.eventSubject,
      host_name: values.hostName,
      id: props.reservation.id,
      number_of_participants: values.numberOfParticipants,
      participants: values.participants,
      reserver_name: values.reserverName,
      resource: values.resource,
    };
    const options = {
      ...actionOptions,
      successMeta: {
        ...actionOptions.successMeta,
        cateringOrder: values.cateringOrder,
      },
    };
    props.editReservation(reservationData, options);
  };
  const updateCateringOrder = (actionOptions, editReservationSuccessAction) => (
    doUpdateCateringOrder(
      actionOptions,
      editReservationSuccessAction,
      props,
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
    );
  };
  return {
    ...props,
    // onSubmit will first send PUT reservation request. On success, catering
    // order is POSTed, PUTed or DELETEd if catering order data has changed.
    onSubmit: (...args) => (
      createFormSubmitHandler(updateReservation)(...args)
        .then(createAlwaysResolvingAPIPromise(updateCateringOrder))
        .then(successHandler)
    ),
  };
}

export default connect(selector, actions, mergeProps)(ReservationForm);
