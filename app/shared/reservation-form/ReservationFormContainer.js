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

export default connect(reservationFormSelector)(ReservationForm);
