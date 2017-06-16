import classnames from 'classnames';
import moment from 'moment';
import React, { PropTypes } from 'react';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Popover from 'react-bootstrap/lib/Popover';
import FontAwesome from 'react-fontawesome';

import utils from '../utils';
import Link from './Link';

Reservation.propTypes = {
  begin: PropTypes.string.isRequired,
  end: PropTypes.string.isRequired,
  eventSubject: PropTypes.string,
  id: PropTypes.number.isRequired,
  numberOfParticipants: PropTypes.number,
  onClick: PropTypes.func.isRequired,
  reserverName: PropTypes.string,
  userPermissions: PropTypes.shape({
    canModify: PropTypes.bool.isRequired,
  }).isRequired,
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
      {Boolean(props.numberOfParticipants) && (
        <div><FontAwesome fixedWidth name="users" /> {props.numberOfParticipants}</div>
      )}
    </Popover>
  );
  return (
    <Link
      className="reservation-link"
      onClick={() => props.onClick(props.id)}
    >
      <OverlayTrigger
        overlay={popover}
        placement="top"
        trigger={['hover', 'focus']}
      >
        <div
          className={classnames(
            'reservation',
            { 'reservation-can-modify': props.userPermissions.canModify },
          )}
          style={{ width }}
        >
          <div className="names">
            <div className="event-subject">{props.eventSubject}</div>
            <div className="reserver-name">{props.reserverName}</div>
          </div>
        </div>
      </OverlayTrigger>
    </Link>
  );
}

export default Reservation;
