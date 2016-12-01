import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
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
    it('has a heart glyphicon', () => {
      expect(getWrapper().find(Glyphicon)).to.have.length(1);
      expect(getWrapper().find(Glyphicon).prop('glyph')).to.equal('heart');
    });
  });

  describe('not favorited', () => {
    it('has correct text', () => {
      const customWrapper = getWrapper({ favorited: false });
      expect(customWrapper.find('.favorite-text').text()).to.equal('Lisää suosikkeihin');
    });
    it('has a heart-empty glyphicon', () => {
      const customWrapper = getWrapper({ favorited: false });
      expect(customWrapper.find(Glyphicon)).to.have.length(1);
      expect(customWrapper.find(Glyphicon).prop('glyph')).to.equal('heart-empty');
    });
  });
});
