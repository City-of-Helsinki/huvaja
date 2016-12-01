import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import simple from 'simple-mock';

import { UnconnectedFavoriteButtonContainer } from './FavoriteButtonContainer';
import FavoriteButton from './FavoriteButton';

describe('shared/favorite-button/FavoriteButtonContainer', () => {
  const resource = {
    id: '123',
    isFavorite: true,
  };

  const defaultProps = {
    favoriteResource: simple.mock(),
    unfavoriteResource: simple.mock(),
    resource,
  };

  function getWrapper(props) {
    return shallow(<UnconnectedFavoriteButtonContainer {...defaultProps} {...props} />);
  }

  it('renders a FavoriteButton', () => {
    expect(getWrapper().is(FavoriteButton)).to.be.true;
  });

  it('has favorited prop', () => {
    expect(getWrapper().prop('favorited')).to.be.true;
  });

  it('has handleClick function as onClick prop', () => {
    const wrapper = getWrapper();
    const instance = wrapper.instance();
    expect(wrapper.prop('onClick')).to.equal(instance.handleClick);
  });

  describe('handleClick', () => {
    it('calls unfavoriteResource if resource was favorite', () => {
      const unfavoriteResource = simple.mock();
      getWrapper({ unfavoriteResource }).instance().handleClick();
      expect(unfavoriteResource.callCount).to.equal(1);
      expect(unfavoriteResource.lastCall.args).to.deep.equal(['123']);
    });

    it('calls favoriteResource if resource was not favorite', () => {
      const favoriteResource = simple.mock();
      const unfavoritedResource = Object.assign({}, resource, { isFavorite: false });
      getWrapper({ favoriteResource, resource: unfavoritedResource }).instance().handleClick();
      expect(favoriteResource.callCount).to.equal(1);
      expect(favoriteResource.lastCall.args).to.deep.equal(['123']);
    });
  });
});
