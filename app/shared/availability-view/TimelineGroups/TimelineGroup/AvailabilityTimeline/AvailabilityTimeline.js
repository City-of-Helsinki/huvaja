import React, { PropTypes } from 'react';

import Reservation from './Reservation';
import ReservationSlot from './ReservationSlot';

AvailabilityTimeline.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['reservation', 'reservation-slot']).isRequired,
      data: PropTypes.object,
    })
  ).isRequired,
};

export default function AvailabilityTimeline(props) {
  return (
    <div className="availability-timeline">
      {props.items.map((item) => {
        if (item.type === 'reservation-slot') {
          return <ReservationSlot key={item.key} {...item.data} />;
        }
        return <Reservation key={item.key} {...item.data} />;
      })}
    </div>
  );
}
