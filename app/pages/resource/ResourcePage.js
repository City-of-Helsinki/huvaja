import React, { PropTypes } from 'react';

import ResourceInfo from './info';
import ReservationForm from './reservation-form/';
import SelectableSingleAvailabilityView from './SelectableSingleAvailabilityView';

ResourcePage.propTypes = {
  currentUser: PropTypes.object,
  date: PropTypes.string.isRequired,
  onDateChange: PropTypes.func.isRequired,
  resource: PropTypes.object.isRequired,
  unit: PropTypes.object.isRequired,
};
export default function ResourcePage(props) {
  return (
    <div>
      <ResourceInfo
        isLoggedIn={Boolean(props.currentUser)}
        resource={props.resource}
        unit={props.unit}
      />
      <SelectableSingleAvailabilityView
        date={props.date}
        resource={props.resource}
        onDateChange={props.onDateChange}
      />
      <ReservationForm resource={props.resource} />
    </div>
  );
}
