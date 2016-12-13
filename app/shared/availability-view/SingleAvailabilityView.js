import dragscroll from 'dragscroll';
import React, { PropTypes } from 'react';

import DateSelector from './DateSelector';
import TimelineGroup from './TimelineGroups/TimelineGroup';

export default class SingleAvailabilityView extends React.Component {
  static propTypes = {
    date: PropTypes.string.isRequired,
    onDateChange: PropTypes.func.isRequired,
    onReservationSlotClick: PropTypes.func,
    resource: PropTypes.string.isRequired,
    selection: PropTypes.shape({
      begin: PropTypes.string.isRequired,
      end: PropTypes.string.isRequired,
    }),
  };

  componentDidMount() {
    dragscroll.reset();
  }

  render() {
    return (
      <div className="availability-view availability-view-single">
        <DateSelector value={this.props.date} onChange={this.props.onDateChange} />
        <TimelineGroup
          className="dragscroll"
          date={this.props.date}
          onReservationSlotClick={this.props.onReservationSlotClick}
          resources={[this.props.resource]}
          selection={this.props.selection}
        />
      </div>
    );
  }
}
