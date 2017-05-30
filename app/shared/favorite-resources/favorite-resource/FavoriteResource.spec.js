import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';

import FavoriteResource from './FavoriteResource';

describe('shared/favorite-resources/favorite-resource/FavoriteResource', () => {
  const defaultProps = {
    id: 'r1',
    name: 'Unit 1 / Room 1',
    unfavoriteResource: () => null,
  };

  function getWrapper(props) {
    return shallow(<FavoriteResource {...defaultProps} {...props} />);
  }

  it('is a li.favorite-resource', () => {
    expect(getWrapper().is('li.favorite-resource')).to.be.true;
  });

  it('renders resource link', () => {
    const link = getWrapper().find('.favorite-resource-link');
    expect(link.prop('to')).to.equal('/resources/r1');
    expect(link.children().text()).to.equal('Unit 1 / Room 1');
  });

  it('allows unfavorite resource', () => {
    const unfavorite = getWrapper().find('.favorite-resource-unfavorite');
    expect(unfavorite.prop('onClick')).to.equal(
      defaultProps.unfavoriteResource
    );
  });
});
