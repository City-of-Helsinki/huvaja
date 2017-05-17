import React, { PropTypes } from 'react';
import FontAwesome from 'react-fontawesome';

function renderNumberOfParticipants(number) {
  if (!number) return null;
  return (
    <span className="number-of-participants">
      <FontAwesome className="icon" name="user" /> {number}
    </span>
  );
}

ReservationRow.propTypes = {
  hostName: PropTypes.string.isRequired,
  place: PropTypes.string.isRequired,
  eventSubject: PropTypes.string.isRequired,
  numberOfParticipants: PropTypes.number,
  onClick: PropTypes.func.isRequired,
  timeRange: PropTypes.string.isRequired,
};
export default function ReservationRow({
  place,
  eventSubject,
  hostName,
  numberOfParticipants,
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
        <div className="right-top">
          <div className="place">{place}</div>
          <div className="icons">
            {renderNumberOfParticipants(numberOfParticipants)}
          </div>
        </div>
        <div className="event-subject">{eventSubject}</div>
      </div>
    </a>
  );
}

