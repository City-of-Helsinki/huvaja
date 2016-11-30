import React, { PropTypes } from 'react';

import DateSelector from './DateSelector';
import TimelineGroup from './TimelineGroups/TimelineGroup';

SingleAvailabilityView.propTypes = {
  date: PropTypes.string.isRequired,
  onDateChange: PropTypes.func.isRequired,
  onReservationSlotClick: PropTypes.func,
  resource: PropTypes.string.isRequired,
  selection: PropTypes.shape({
    begin: PropTypes.string.isRequired,
    end: PropTypes.string.isRequired,
  }),
};
export default function SingleAvailabilityView(props) {
  return (
    <div className="availability-view availability-view-single">
      <DateSelector value={props.date} onChange={props.onDateChange} />
      <TimelineGroup
        date={props.date}
        onReservationSlotClick={props.onReservationSlotClick}
        resources={[props.resource]}
        selection={props.selection}
      />
    </div>
  );
}
