import moment from 'moment';
import React, { PropTypes } from 'react';
import { browserHistory } from 'react-router';

import { slotSize } from 'shared/availability-view';
import SingleAvailabilityView from 'shared/availability-view/SingleAvailabilityView';

export default class SelectableSingleAvailabilityView extends React.Component {
  static propTypes = {
    date: PropTypes.string.isRequired,
    onDateChange: PropTypes.func.isRequired,
    resource: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);
    this.handleReservationSlotClick = this.handleReservationSlotClick.bind(this);
    const query = browserHistory.getCurrentLocation().query;
    if (query.begin && query.begin.indexOf('T') !== -1) {
      this.state = {
        mode: 'end',
        selection: {
          begin: query.begin,
          end: moment(query.begin).add(slotSize, 'minutes').format(),
        },
      };
    } else {
      this.state = {
        mode: 'begin',
        selection: undefined,
      };
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.date !== nextProps.date) {
      this.setState({ mode: 'begin' });
    }
  }

  handleReservationSlotClick(slot) {
    if (this.state.mode === 'begin') {
      this.setState({
        mode: 'end',
        selection: {
          begin: slot.begin,
          end: slot.end,
        },
      });
    } else {
      if (this.state.selection.begin >= slot.end) return;
      this.setState({
        mode: 'begin',
        selection: {
          begin: this.state.selection.begin,
          end: slot.end,
        },
      });
    }
  }

  render() {
    return (
      <div className="selectable-availability-view">
        {this.state.mode === 'end'
          ? 'Valitse loppumisaika'
          : (this.state.selection === undefined && 'Valitse alkamisaika')}
        <SingleAvailabilityView
          date={this.props.date}
          resource={this.props.resource.id}
          onReservationSlotClick={this.handleReservationSlotClick}
          onDateChange={this.props.onDateChange}
          selection={this.state.selection}
        />
      </div>
    );
  }
}
