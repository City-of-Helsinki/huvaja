import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import DocumentTitle from 'react-document-title';
import simple from 'simple-mock';

import { UnconnectedAppContainer as AppContainer } from './AppContainer';

describe('pages/AppContainer', () => {
  const content = <p className="children">Some content</p>;
  function getWrapper(props) {
    const defaults = {
      fetchUnits: simple.mock,
    };
    return shallow(<AppContainer {...defaults} {...props}>{content}</AppContainer>);
  }

  describe('render', () => {
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

    it('renders children', () => {
      const children = getWrapper().find('.children');
      expect(children.equals(content)).to.be.true;
    });
  });

  describe('componentDidMount', () => {
    it('fetches resources', () => {
      const fetchUnits = simple.mock();
      const instance = getWrapper({ fetchUnits }).instance();
      instance.componentDidMount();
      expect(fetchUnits.callCount).to.equal(1);
    });
  });
});
