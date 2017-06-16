import classnames from 'classnames';
import React, { PropTypes } from 'react';

import Reservation from './Reservation';
import ReservationSlot from './ReservationSlot';

export default class AvailabilityTimeline extends React.Component {
  static propTypes = {
    canMakeReservations: PropTypes.bool.isRequired,
    id: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        type: PropTypes.oneOf(['reservation', 'reservation-slot']).isRequired,
        data: PropTypes.object,
      })
    ).isRequired,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    onReservationClick: PropTypes.func.isRequired,
    onReservationSlotClick: PropTypes.func,
    onReservationSlotMouseDown: PropTypes.func,
    onReservationSlotMouseEnter: PropTypes.func,
    onReservationSlotMouseUp: PropTypes.func,
    selection: PropTypes.object,
  };

  handleMouseEnter = () => {
    if (this.props.onMouseEnter) {
      this.props.onMouseEnter(this.props.id);
    }
  }

  handleMouseLeave = () => {
    if (this.props.onMouseLeave) {
      this.props.onMouseLeave(this.props.id);
    }
  }

  render() {
    return (
      <div
        className={classnames(
          'availability-timeline',
          { 'availability-timeline-can-make-reservations': this.props.canMakeReservations },
        )}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        {this.props.items.map((item) => {
          if (item.type === 'reservation-slot') {
            return (
              <ReservationSlot
                {...item.data}
                key={item.key}
                onClick={this.props.onReservationSlotClick}
                onMouseDown={this.props.onReservationSlotMouseDown}
                onMouseEnter={this.props.onReservationSlotMouseEnter}
                onMouseUp={this.props.onReservationSlotMouseUp}
                selection={this.props.selection}
              />
            );
          }
          return (
            <Reservation
              {...item.data}
              key={item.key}
              onClick={this.props.onReservationClick}
            />
          );
        })}
      </div>
    );
  }
}
