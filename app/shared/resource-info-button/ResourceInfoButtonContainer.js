import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import uiActions from 'actions/uiActions';

UnconnectedResourceInfoButtonContainer.propTypes = {
  resourceId: PropTypes.string.isRequired,
  showResourceInfoModal: PropTypes.func.isRequired,
};
export function UnconnectedResourceInfoButtonContainer(props) {
  const onClick = () => props.showResourceInfoModal(props.resourceId);
  return (
    <div className="resource-info-button">
      <a onClick={onClick} tabIndex="0">
        Katso tilan tiedot
      </a>
    </div>
  );
}

const actions = {
  showResourceInfoModal: uiActions.showResourceInfoModal,
};

export default connect(null, actions)(UnconnectedResourceInfoButtonContainer);
