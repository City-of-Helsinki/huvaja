import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import simple from 'simple-mock';

import FavoriteResource from './favorite-resource';
import FavoriteResources from './FavoriteResources';

describe('shared/favorite-resources/FavoriteResources', () => {
  const r1 = { id: 'r1', longName: 'Unit A / Resource 1' };
  const r2 = { id: 'r2', longName: 'Unit A / Resource 2' };

  const defaultProps = {
    resources: [r1, r2],
    unfavoriteResource: () => null,
  };

  function getWrapper(props) {
    return shallow(<FavoriteResources {...defaultProps} {...props} />);
  }

  it('is a ul.favorite-resources', () => {
    expect(getWrapper().is('ul.favorite-resources')).to.be.true;
  });

  it('renders text when no resources', () => {
    const wrapper = getWrapper({ resources: [] });
    expect(wrapper.text()).to.equal('Ei tiloja');
  });

  it('renders FavoriteResource for each resource', () => {
    const items = getWrapper().find(FavoriteResource);
    expect(items).to.have.length(2);

    expect(items.at(0).prop('id')).to.equal(r1.id);
    expect(items.at(0).prop('name')).to.equal(r1.longName);

    expect(items.at(1).prop('id')).to.equal(r2.id);
    expect(items.at(1).prop('name')).to.equal(r2.longName);
  });

  it('passes correct functions to unfavorite', () => {
    const unfavoriteResource = simple.mock();
    const items = getWrapper({ unfavoriteResource }).find(FavoriteResource);

    expect(unfavoriteResource.called).to.be.false;
    items.at(0).prop('unfavoriteResource')();
    expect(unfavoriteResource.lastCall.arg).to.equal(r1.id);
    items.at(1).prop('unfavoriteResource')();
    expect(unfavoriteResource.lastCall.arg).to.equal(r2.id);
  });
});
