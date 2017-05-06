import moment from 'moment';
import React, { PropTypes } from 'react';

import DateSelector from './DateSelector';
import TimelineGroup from './TimelineGroups/TimelineGroup';
import utils from './TimelineGroups/TimelineGroup/utils';

export default class SingleAvailabilityView extends React.Component {
  static propTypes = {
    date: PropTypes.string.isRequired,
    excludeReservation: PropTypes.number,
    hideDateSelector: PropTypes.bool,
    onDateChange: PropTypes.func.isRequired,
    onReservationSlotClick: PropTypes.func,
    onReservationSlotMouseDown: PropTypes.func,
    onReservationSlotMouseEnter: PropTypes.func,
    onReservationSlotMouseUp: PropTypes.func,
    resource: PropTypes.string.isRequired,
    selection: PropTypes.shape({
      begin: PropTypes.string.isRequired,
      end: PropTypes.string.isRequired,
    }),
  };

  constructor(props) {
    super(props);
    this.scrollToInitial = this.scrollToInitial.bind(this);
  }

  scrollToInitial(component) {
    if (component) {
      const target = (
        this.props.selection
        ? utils.getTimeSlotWidth({
          startTime: moment(this.props.selection.begin).startOf('day'),
          endTime: moment(this.props.selection.begin),
        })
        : utils.getTimeSlotWidth({
          startTime: moment('2016-01-01T00:00:00'),
          endTime: moment('2016-01-01T08:00:00'),
        })
      );
      component.scrollTo(target);
    }
  }

  render() {
    return (
      <div className="availability-view availability-view-single">
        {
          this.props.hideDateSelector ?
          null :
          <DateSelector value={this.props.date} onChange={this.props.onDateChange} />
        }
        <TimelineGroup
          date={this.props.date}
          excludeReservation={this.props.excludeReservation}
          noStickyHours
          onReservationSlotClick={this.props.onReservationSlotClick}
          onReservationSlotMouseDown={this.props.onReservationSlotMouseDown}
          onReservationSlotMouseEnter={this.props.onReservationSlotMouseEnter}
          onReservationSlotMouseUp={this.props.onReservationSlotMouseUp}
          ref={this.scrollToInitial}
          resources={[this.props.resource]}
          selection={this.props.selection}
        />
      </div>
    );
  }
}
