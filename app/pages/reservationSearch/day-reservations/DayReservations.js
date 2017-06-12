import React, { PropTypes } from 'react';

import constants from 'constants/AppConstants';
import ReservationRow from './reservation-row';

DayReservations.propTypes = {
  day: PropTypes.object.isRequired,
  reservations: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
};
export default function DayReservations({ day, reservations }) {
  return (
    <div className="day-reservations">
      <div className="day">{day.format(constants.DATE_FORMAT)}</div>
      <div className="reservations">
        {reservations.map(id =>
          <ReservationRow id={id} key={id} />
        )}
      </div>
    </div>
  );
}

