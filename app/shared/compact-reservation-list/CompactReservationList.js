import classNames from 'classnames';
import React, { Component, PropTypes } from 'react';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';

import TimeRange from 'shared/time-range';

class CompactReservationList extends Component {
  renderFixedReservation = reservation => this.renderReservation(reservation);

  renderRemovableReservation = reservation => this.renderReservation(reservation, true);

  renderReservation = (reservation, removable = false) => {
    const resourceName = this.props.resourceNames ?
      this.props.resourceNames[reservation.resource] :
      null;
    const className = classNames(
      'compact-reservation-list-item',
      {
        'compact-reservation-list-item-failure': this.props.failure,
        'compact-reservation-list-item-success': this.props.success,
      },
    );
    return (
      <li className={className} key={reservation.begin}>
        <div className="compact-reservation-list-item-content">
          {resourceName && <span>{resourceName}</span>}
          <TimeRange
            begin={reservation.begin}
            beginFormat={this.props.beginFormat}
            endFormat={this.props.endFormat}
            end={reservation.end}
          />
          {removable &&
            <Glyphicon
              glyph="remove-circle"
              onClick={() => this.props.onRemoveClick(reservation.begin)}
            />
          }
        </div>
        {this.props.subtitle &&
          <div className="compact-reservation-list-subtitle">
            {reservation[this.props.subtitle]}
          </div>
        }
      </li>
    );
  }

  render() {
    const className = classNames(
      this.props.className,
      'compact-reservation-list',
    );
    return (
      <ul className={className}>
        {this.props.reservations.map(this.renderFixedReservation)}
        {this.props.removableReservations && this.props.removableReservations.map(
          this.renderRemovableReservation
        )}
      </ul>
    );
  }
}

CompactReservationList.propTypes = {
  beginFormat: PropTypes.string,
  className: PropTypes.string,
  endFormat: PropTypes.string,
  failure: PropTypes.bool,
  onRemoveClick: PropTypes.func,
  removableReservations: PropTypes.array,
  reservations: PropTypes.array.isRequired,
  resourceNames: PropTypes.object,
  subtitle: PropTypes.string,
  success: PropTypes.bool,
};

export default CompactReservationList;
