import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { makeReservation } from 'api/actions/reservations';
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
  resourceSelector,
  resource => ({ resource: resource.name.fi })
);
const selector = createSelector(
  hasTimeSelector,
  initialValuesSelector,
  (hasTime, initialValues) => ({ hasTime, initialValues })
);

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
          resource: props.resource.id,
          event_subject: values.eventName,
          number_of_participants: values.numberOfParticipants,
        },
        actionOptions
      )
    ),
  };
}

export default connect(selector, actions, mergeProps)(ReservationForm);
