import moment from 'moment';
import React, { PropTypes } from 'react';

import SingleAvailabilityView from 'shared/availability-view/SingleAvailabilityView';

export default class SelectableSingleAvailabilityView extends React.Component {
  static propTypes = {
    date: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onDateChange: PropTypes.func.isRequired,
    resource: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
    value: PropTypes.shape({
      begin: PropTypes.shape({
        date: PropTypes.string.isRequired,
        time: PropTypes.string,
      }).isRequired,
      end: PropTypes.shape({
        date: PropTypes.string.isRequired,
        time: PropTypes.string,
      }).isRequired,
    }).isRequired,
  };

  getSelection() {
    const { begin, end } = this.props.value;
    if (begin.time && end.time) {
      return {
        begin: `${begin.date}T${begin.time}:00.000`,
        end: `${end.date}T${end.time}:00.000`,
      };
    }
    return null;
  }

  setSelection(selection) {
    this.props.onChange({
      begin: {
        date: moment(selection.begin).format('YYYY-MM-DD'),
        time: moment(selection.begin).format('HH:mm'),
      },
      end: {
        date: moment(selection.end).format('YYYY-MM-DD'),
        time: moment(selection.end).format('HH:mm'),
      },
    });
  }

  handleReservationSlotClick = (slot) => {
    this.setSelection(slot);
  }

  render() {
    return (
      <div className="selectable-availability-view">
        <SingleAvailabilityView
          date={this.props.date}
          resource={this.props.resource.id}
          onReservationSlotClick={this.handleReservationSlotClick}
          onDateChange={this.props.onDateChange}
          selection={this.getSelection()}
        />
      </div>
    );
  }
}
