import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import Loader from 'react-loader';

import { UnconnectedFavoriteResourcesContainer } from './FavoriteResourcesContainer';
import FavoriteResources from './FavoriteResources';

describe('shared/favorite-resources/FavoriteResourcesContainer', () => {
  const r1 = { id: 'r1' };

  const defaultProps = {
    isFetching: false,
    resources: [r1],
    unfavoriteResource: () => null,
  };

  function getWrapper(props) {
    return shallow(
      <UnconnectedFavoriteResourcesContainer {...defaultProps} {...props} />
    );
  }

  it('renders a FavoriteResources with correct props', () => {
    const favoriteResources = getWrapper().find(FavoriteResources);
    expect(favoriteResources).to.have.length(1);
    expect(favoriteResources.prop('resources')).to.deep.equal(defaultProps.resources);
    expect(favoriteResources.prop('unfavoriteResource')).to.deep.equal(defaultProps.unfavoriteResource);
  });

  describe('Loader', () => {
    it('is rendered', () => {
      const loader = getWrapper().find(Loader);
      expect(loader).to.have.length(1);
    });

    it('is loaded when not fetching', () => {
      const loader = getWrapper({ isFetching: false }).find(Loader);
      expect(loader.prop('loaded')).to.be.true;
    });

    it('is not loaded when fetching', () => {
      const loader = getWrapper({ isFetching: true }).find(Loader);
      expect(loader.prop('loaded')).to.be.false;
    });
  });
});
