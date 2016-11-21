import { connect } from 'react-redux';
import { createSelector } from 'reselect';

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

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, ownProps, stateProps, dispatchProps, {
    onSubmit: () => {},
  });
}


export default connect(reservationFormSelector, {}, mergeProps)(ReservationForm);
