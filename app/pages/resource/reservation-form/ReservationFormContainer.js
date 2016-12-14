import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';

import { makeReservation } from 'api/actions/reservations';
import { currentUserSelector } from 'auth/selectors';
import createFormSubmitHandler from 'utils/createFormSubmitHandler';
import ReservationForm from './ReservationForm';

function hasTimeSelector(state) {
  const form = state.form.resourceReservation;
  return Boolean(form && form.values.time);
}

function resourceSelector(state, props) {
  return props.resource;
}

const initialValuesSelector = createSelector(
  currentUserSelector,
  resourceSelector,
  (currentUser, resource) => ({
    hostName: currentUser ? currentUser.displayName : '',
    reserverName: currentUser ? currentUser.displayName : '',
    resource: resource.name.fi,
  })
);

export const selector = createStructuredSelector({
  hasTime: hasTimeSelector,
  initialValues: initialValuesSelector,
});

const actions = {
  makeReservation,
};

export function mergeProps(stateProps, dispatchProps, ownProps) {
  const props = { ...ownProps, ...stateProps, ...dispatchProps };
  return {
    ...props,
    onSubmit: createFormSubmitHandler(
      (actionOptions, values) => props.makeReservation(
        {
          begin: values.time.begin,
          end: values.time.end,
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
