import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import FontAwesome from 'react-fontawesome';
import simple from 'simple-mock';

import FavoriteButton from './FavoriteButton';

describe('shared/favorite-button/FavoriteButton', () => {
  const defaultProps = {
    favorited: true,
    onClick: simple.mock(),
  };

  function getWrapper(props) {
    return shallow(<FavoriteButton {...defaultProps} {...props} />);
  }

  it('is a button', () => {
    expect(getWrapper().is('button')).to.be.true;
  });

  it('has favorite-button class name', () => {
    expect(getWrapper().prop('className')).to.equal('favorite-button');
  });

  it('passes onClick prop', () => {
    expect(getWrapper().prop('onClick')).to.deep.equal(defaultProps.onClick);
  });

  describe('favorited', () => {
    it('has correct text', () => {
      expect(getWrapper().find('.favorite-text').text()).to.equal('Poista suosikeista');
    });

    it('has a heart icon', () => {
      expect(getWrapper().find(FontAwesome)).to.have.length(1);
      expect(getWrapper().find(FontAwesome).prop('name')).to.equal('heart');
    });
  });

  describe('not favorited', () => {
    it('has correct text', () => {
      const customWrapper = getWrapper({ favorited: false });
      expect(customWrapper.find('.favorite-text').text()).to.equal('Lisää suosikkeihin');
    });

    it('has an empty heart icon', () => {
      const customWrapper = getWrapper({ favorited: false });
      expect(customWrapper.find(FontAwesome)).to.have.length(1);
      expect(customWrapper.find(FontAwesome).prop('name')).to.equal('heart-o');
    });
  });
});
