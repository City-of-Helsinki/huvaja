import moment from 'moment';
import React, { PropTypes } from 'react';

import SingleAvailabilityView from 'shared/availability-view/SingleAvailabilityView';

function noop() {}

export default class SelectableSingleAvailabilityView extends React.Component {
  static propTypes = {
    date: PropTypes.string.isRequired,
    hideDateSelector: PropTypes.bool,
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

  constructor(props) {
    super(props);
    this.state = { isSelecting: false, selection: null };
  }

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

  handleReservationSlotMouseDown = (slot) => {
    this.setState({
      isSelecting: true,
      selection: slot,
    });
    this.setSelection(slot);
  }

  handleReservationSlotMouseEnter = (slot) => {
    if (!this.state.isSelecting) {
      return;
    }
    const { begin, end } = this.state.selection;
    const selection = {
      begin: slot.begin < begin ? slot.begin : begin,
      end: slot.end > end ? slot.end : end,
    };
    this.setSelection(selection);
  }

  handleReservationSlotMouseUp = () => {
    this.setState({
      isSelecting: false,
      selection: null,
    });
  }

  render() {
    return (
      <div className="selectable-availability-view">
        <SingleAvailabilityView
          date={this.props.date}
          hideDateSelector={this.props.hideDateSelector}
          resource={this.props.resource.id}
          onReservationSlotClick={noop}
          onReservationSlotMouseDown={this.handleReservationSlotMouseDown}
          onReservationSlotMouseEnter={this.handleReservationSlotMouseEnter}
          onReservationSlotMouseUp={this.handleReservationSlotMouseUp}
          onDateChange={this.props.onDateChange}
          selection={this.getSelection()}
        />
      </div>
    );
  }
}
