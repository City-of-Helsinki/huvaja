import React, { PropTypes } from 'react';

ReservationRow.propTypes = {
  hostName: PropTypes.string.isRequired,
  place: PropTypes.string.isRequired,
  eventSubject: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  timeRange: PropTypes.string.isRequired,
};
export default function ReservationRow({
  place,
  eventSubject,
  hostName,
  onClick,
  timeRange,
}) {
  return (
    <a className="reservation-row" onClick={onClick} tabIndex="0">
      <div className="left">
        <div className="time-range">{timeRange}</div>
        <div className="host-name">{hostName}</div>
      </div>
      <div className="right">
        <div className="place">{place}</div>
        <div className="event-subject">{eventSubject}</div>
      </div>
    </a>
  );
}

