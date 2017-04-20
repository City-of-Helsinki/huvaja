import React, { PropTypes } from 'react';

import ReservationRow from './reservation-row';

DayReservations.propTypes = {
  day: PropTypes.object.isRequired,
  reservations: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
};
export default function DayReservations({ day, reservations }) {
  return (
    <div className="day-reservations">
      <div className="day">{day.format('dd D.M.YYYY')}</div>
      <div className="reservations">
        {reservations.map(id =>
          <ReservationRow id={id} key={id} />
        )}
      </div>
    </div>
  );
}

