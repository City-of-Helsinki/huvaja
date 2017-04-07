import React, { PropTypes } from 'react';

import Reservation from './Reservation';
import ReservationSlot from './ReservationSlot';

export default class AvailabilityTimeline extends React.Component {
  static propTypes = {
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
    const { onReservationClick, onReservationSlotClick, selection } = this.props;
    return (
      <div
        className="availability-timeline"
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        {this.props.items.map((item) => {
          if (item.type === 'reservation-slot') {
            return (
              <ReservationSlot
                {...item.data}
                key={item.key}
                onClick={onReservationSlotClick}
                selection={selection}
              />
            );
          }
          return (
            <Reservation
              {...item.data}
              key={item.key}
              onClick={onReservationClick}
            />
          );
        })}
      </div>
    );
  }
}
