import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import uiActions from 'actions/uiActions';
import ResourceSelectorModal from './ResourceSelectorModal';
import selector from './resourceSelectorModalSelector';

UnconnectedResourceSelectorModalContainer.propTypes = {
  onHide: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  selectedResource: PropTypes.object,
  selectedTimeRange: PropTypes.object,
  show: PropTypes.bool.isRequired,
  unit: PropTypes.object,
};
export function UnconnectedResourceSelectorModalContainer(props) {
  return (
    <ResourceSelectorModal
      onHide={props.onHide}
      onSelect={props.onSelect}
      selectedResource={props.selectedResource}
      selectedTimeRange={props.selectedTimeRange}
      show={props.show}
      unit={props.unit}
    />
  );
}

const actions = {
  onHide: uiActions.hideResourceSelectorModal,
};

export default connect(selector, actions)(UnconnectedResourceSelectorModalContainer);
