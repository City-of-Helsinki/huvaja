import moment from 'moment';
import React, { PropTypes } from 'react';

import AvailabilityView from 'shared/availability-view';
import ResourceInfo from './info';
import ReservationForm from './reservation-form/';

function noop() {}

ResourcePage.propTypes = {
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
      <AvailabilityView
        date={moment('2016-11-25')}
        groups={[
          { name: props.unit.name.fi, resources: [props.resource.id] },
        ]}
        onDateChange={noop}
      />
      <ReservationForm resource={props.resource} />
    </div>
  );
}

