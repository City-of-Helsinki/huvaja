import React, { PropTypes } from 'react';

import SingleAvailabilityView from 'shared/availability-view/SingleAvailabilityView';
import ResourceInfo from './info';
import ReservationForm from './reservation-form/';

ResourcePage.propTypes = {
  date: PropTypes.string.isRequired,
  onDateChange: PropTypes.func.isRequired,
  resource: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
  unit: PropTypes.shape({
    name: PropTypes.shape({
      fi: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
export default function ResourcePage(props) {
  return (
    <div>
      <ResourceInfo resource={props.resource} unit={props.unit} />
      <SingleAvailabilityView
        date={props.date}
        resource={props.resource.id}
        onDateChange={props.onDateChange}
      />
      <ReservationForm resource={props.resource} />
    </div>
  );
}

