import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import uiActions from 'actions/uiActions';
import { fetchResources } from 'api/actions';
import resourceSearchUtils from 'utils/resourceSearchUtils';
import ResourceSelector from './ResourceSelector';
import selector from './resourceSelectorSelector';

export class UnconnectedResourceSelectorContainer extends React.Component {
  static propTypes = {
    availableResources: PropTypes.array.isRequired,
    clear: PropTypes.func.isRequired,
    fetchResources: PropTypes.func.isRequired,
    isFetching: PropTypes.bool.isRequired,
    onSelect: PropTypes.func.isRequired,
    resources: PropTypes.array,
    selectedResourceId: PropTypes.string,
    selectedTimeRange: PropTypes.object,
    unavailableResources: PropTypes.array.isRequired,
  };

  componentDidMount() {
    this.props.clear();
    const availableBetween = this.getAvailableBetweenParam();
    if (availableBetween.length) {
      const meta = { resourceSelector: true };
      this.props.fetchResources({ availableBetween }, false, meta);
    }
  }

  getAvailableBetweenParam = () => {
    const timeRange = this.props.selectedTimeRange;
    return (
      timeRange ?
      resourceSearchUtils.getAvailableBetween(
        timeRange.begin.date,
        timeRange.begin.time,
        timeRange.end.date,
        timeRange.end.time,
      ) :
      ''
    );
  }

  render() {
    return (
      <ResourceSelector
        availableResources={this.props.availableResources}
        isFetching={this.props.isFetching}
        onSelect={this.props.onSelect}
        resources={this.props.resources}
        selectedResourceId={this.props.selectedResourceId}
        unavailableResources={this.props.unavailableResources}
      />
    );
  }
}

const actions = {
  fetchResources,
  clear: uiActions.clearResourceSelector,
};

export default connect(selector, actions)(UnconnectedResourceSelectorContainer);
