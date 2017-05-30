import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';

import FavoriteResources from 'shared/favorite-resources';
import MyInfoPage from './MyInfoPage';

describe('pages/myInfo/MyInfoPage', () => {
  function getWrapper() {
    return shallow(<MyInfoPage />);
  }

  it('div.my-info-page', () => {
    expect(getWrapper().is('div.my-info-page')).to.be.true;
  });

  it('renders FavoriteResources', () => {
    const favoriteResources = getWrapper().find(FavoriteResources);
    expect(favoriteResources).to.have.length(1);
  });
});
