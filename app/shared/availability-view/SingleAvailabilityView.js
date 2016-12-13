import dragscroll from 'dragscroll';
import moment from 'moment';
import React, { PropTypes } from 'react';

import DateSelector from './DateSelector';
import TimelineGroup from './TimelineGroups/TimelineGroup';
import utils from './TimelineGroups/TimelineGroup/utils';

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

  constructor(props) {
    super(props);
    this.scrollToInitial = this.scrollToInitial.bind(this);
  }

  componentDidMount() {
    dragscroll.reset();
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
        <DateSelector value={this.props.date} onChange={this.props.onDateChange} />
        <TimelineGroup
          className="dragscroll"
          date={this.props.date}
          onReservationSlotClick={this.props.onReservationSlotClick}
          ref={this.scrollToInitial}
          resources={[this.props.resource]}
          selection={this.props.selection}
        />
      </div>
    );
  }
}
