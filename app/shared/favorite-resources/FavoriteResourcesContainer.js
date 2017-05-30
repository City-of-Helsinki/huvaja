import React, { PropTypes } from 'react';
import Loader from 'react-loader';
import { connect } from 'react-redux';

import { unfavoriteResource } from 'api/actions';
import selector from './favoriteResourcesSelector';
import FavoriteResources from './FavoriteResources';

UnconnectedFavoriteResourcesContainer.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  resources: PropTypes.array.isRequired,
  unfavoriteResource: PropTypes.func.isRequired,
};
export function UnconnectedFavoriteResourcesContainer(props) {
  return (
    <Loader loaded={!props.isFetching}>
      <FavoriteResources
        resources={props.resources}
        unfavoriteResource={props.unfavoriteResource}
      />
    </Loader>
  );
}

const actions = {
  unfavoriteResource,
};

export default connect(selector, actions)(UnconnectedFavoriteResourcesContainer);
