import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { favoriteResource, unfavoriteResource } from 'api/actions';
import FavoriteButton from './FavoriteButton';

export class UnconnectedFavoriteButtonContainer extends Component {
  static propTypes = {
    favoriteResource: PropTypes.func.isRequired,
    resource: PropTypes.shape({
      id: PropTypes.string.isRequired,
      isFavorite: PropTypes.bool.isRequired,
    }).isRequired,
    unfavoriteResource: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const { resource } = this.props;
    if (resource.isFavorite) {
      this.props.unfavoriteResource(resource.id);
    } else {
      this.props.favoriteResource(resource.id);
    }
  }

  render() {
    return (
      <FavoriteButton
        favorited={this.props.resource.isFavorite}
        onClick={this.handleClick}
      />
    );
  }
}

const actions = {
  favoriteResource,
  unfavoriteResource,
};

export default connect(null, actions)(UnconnectedFavoriteButtonContainer);
