import moment from 'moment';
import React, { PropTypes } from 'react';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Popover from 'react-bootstrap/lib/Popover';
import FontAwesome from 'react-fontawesome';

import utils from '../utils';

Reservation.propTypes = {
  begin: PropTypes.string.isRequired,
  end: PropTypes.string.isRequired,
  eventSubject: PropTypes.string,
  id: PropTypes.number.isRequired,
  numberOfParticipants: PropTypes.number,
  onClick: PropTypes.func.isRequired,
  reserverName: PropTypes.string,
};

function Reservation(props) {
  const startTime = moment(props.begin);
  const endTime = moment(props.end);
  const width = utils.getTimeSlotWidth({ startTime, endTime });
  const popover = (
    <Popover id={`popover-${props.id}`} title={props.eventSubject}>
      <div>
        <FontAwesome fixedWidth name="clock-o" />{' '}
        {startTime.format('HH:mm')} - {endTime.format('HH:mm')}
      </div>
      <div><FontAwesome fixedWidth name="user" /> {props.reserverName}</div>
      <div><FontAwesome fixedWidth name="users" /> {props.numberOfParticipants}</div>
    </Popover>
  );
  return (
    <OverlayTrigger
      onClick={() => props.onClick(props.id)}
      overlay={popover}
      placement="top"
      trigger={['hover', 'focus']}
    >
      <div className="reservation" style={{ width }}>
        <div className="times">
          <div className="start-time">{startTime.format('HH:mm')}</div>
          <div className="end-time">{endTime.format('HH:mm')}</div>
        </div>
        <div className="names">
          <div className="event-subject">{props.eventSubject}</div>
          <div className="reserver-name">{props.reserverName}</div>
        </div>
      </div>
    </OverlayTrigger>
  );
}

export default Reservation;
