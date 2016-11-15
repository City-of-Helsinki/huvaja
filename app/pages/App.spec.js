import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import DocumentTitle from 'react-document-title';

import App from './App';

describe('pages/App', () => {
  const defaultProps = {
    className: 'test-page',
    title: 'Test title',
  };

  function getWrapper(extraProps) {
    return shallow(<App {...defaultProps} {...extraProps} />);
  }

  describe('DocumentTitle', () => {
    it('is rendered', () => {
      const title = getWrapper().find(DocumentTitle);
      expect(title.length).to.equal(1);
    });

    it('gets correct title prop', () => {
      const title = getWrapper().find(DocumentTitle);
      expect(title.prop('title')).to.equal('Huonevarausjärjestelmä');
    });
  });

  it('renders a div with className "app"', () => {
    const div = getWrapper().find('div');
    expect(div.length).to.equal(1);
    expect(div.prop('className')).to.equal('app');
  });
});
