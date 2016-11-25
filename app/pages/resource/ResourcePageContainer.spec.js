import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import Loader from 'react-loader';
import simple from 'simple-mock';

import ResourcePage from './ResourcePage';
import { UnconnectedResourcePageContainer as ResourcePageContainer } from './ResourcePageContainer';

describe('pages/resource/ResourcePageContainer', () => {
  function getWrapper(props) {
    const defaults = {
      fetchResource: () => null,
      isLoaded: true,
      params: { id: 'some-di' },
      resource: { id: 'r-1' },
      unit: { name: { fi: 'unit name' } },
    };
    return shallow(<ResourcePageContainer {...defaults} {...props} />);
  }

  describe('render', () => {
    describe('if isLoaded', () => {
      it('does not render a Loader', () => {
        const loader = getWrapper({ isLoaded: true }).find(Loader);
        expect(loader).to.have.length(0);
      });

      it('renders a ResourcePage', () => {
        const resource = { id: 'id' };
        const unit = { name: { fi: 'wow' } };
        const page = getWrapper({ isLoaded: true, resource, unit }).find(ResourcePage);
        expect(page).to.have.length(1);
        expect(page.prop('resource')).to.equal(resource);
        expect(page.prop('unit')).to.equal(unit);
      });
    });

    describe('if not isLoaded', () => {
      it('renders a Loader', () => {
        const loader = getWrapper({ isLoaded: false }).find(Loader);
        expect(loader).to.have.length(1);
        expect(loader.prop('loaded')).to.be.false;
      });

      it('does not render a ResourcePage', () => {
        const wrapper = getWrapper({ isLoaded: false, resource: undefined, unit: undefined });
        expect(wrapper.find(ResourcePage)).to.have.length(0);
      });
    });
  });

  describe('componentDidMount', () => {
    it('fetches resource with correct id', () => {
      const params = { id: 'resource-id' };
      const fetchResource = simple.mock();
      const instance = getWrapper({ fetchResource, params }).instance();
      instance.componentDidMount();
      expect(fetchResource.callCount).to.equal(1);
      expect(fetchResource.lastCall.arg).to.equal(params.id);
    });
  });
});
