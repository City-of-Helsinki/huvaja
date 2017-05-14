import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import uiActions from 'actions/uiActions';
import ResourceField from './ResourceField';

UnconnectedResourceFieldContainer.propTypes = {
  id: PropTypes.string.isRequired,
  controlProps: PropTypes.object,
  hideSelector: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  showSelector: PropTypes.func.isRequired,
  validationState: PropTypes.string,
};
export function UnconnectedResourceFieldContainer(props) {
  return <ResourceField {...props} />;
}

const actions = {
  hideSelector: uiActions.hideResourceSelectorModal,
  showSelector: uiActions.showResourceSelectorModal,
};

export default connect(null, actions)(UnconnectedResourceFieldContainer);

