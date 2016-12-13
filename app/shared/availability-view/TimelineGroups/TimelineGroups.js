import dragscroll from 'dragscroll';
import React, { PropTypes } from 'react';

import TimelineGroup from './TimelineGroup';

export default class TimelineGroups extends React.Component {
  static propTypes = {
    date: PropTypes.string.isRequired,
    groups: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
      })
    ).isRequired,
  };

  componentDidMount() {
    dragscroll.reset();
  }

  render() {
    return (
      <div className="dragscroll timeline-groups">
        {this.props.groups.map(group =>
          <TimelineGroup date={this.props.date} key={group.name} {...group} />
        )}
      </div>
    );
  }
}
