import React, { PropTypes } from 'react';

import DateSelector from './DateSelector';
import TimelineGroups from './TimelineGroups';
import Sidebar from './Sidebar';

export default class AvailabilityView extends React.Component {
  static propTypes = {
    date: PropTypes.string.isRequired,
    groups: PropTypes.arrayOf(PropTypes.object).isRequired,
    onDateChange: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.clearHighlightedTimeTimeout = null;
    this.state = { highlightedResourceId: null };
  }

  handleAvailabilityTimelineMouseEnter = (resourceId) => {
    this.setState({ highlightedResourceId: resourceId });
    if (this.clearHighlightedTimeTimeout) {
      window.clearTimeout(this.clearHighlightedTimeTimeout);
      this.clearHighlightedTimeTimeout = null;
    }
  };

  handleAvailabilityTimelineMouseLeave = () => {
    // Usually when the mouse leaves an AvailabilityTimeline, it immediately afterwards enters
    // another one. In that case setting highlightedResourceId to null between leaving the previous
    // one and entering the next one is unnecessary.
    this.clearHighlightedTimeTimeout = window.setTimeout(
      () => this.setState({ highlightedResourceId: null }),
      50,
    );
  };

  render() {
    return (
      <div className="availability-view">
        <div className="left">
          <div className="top-left" />
          <Sidebar
            date={this.props.date}
            groups={this.props.groups}
            highlightedResourceId={this.state.highlightedResourceId}
          />
        </div>
        <div className="right">
          <DateSelector value={this.props.date} onChange={this.props.onDateChange} />
          <TimelineGroups
            date={this.props.date}
            groups={this.props.groups}
            onAvailabilityViewMouseEnter={this.handleAvailabilityTimelineMouseEnter}
            onAvailabilityViewMouseLeave={this.handleAvailabilityTimelineMouseLeave}
          />
        </div>
      </div>
    );
  }
}
