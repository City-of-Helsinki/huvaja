import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import Loader from 'react-loader';
import simple from 'simple-mock';

import ResourceInfo from './info';
import { UnconnectedResourcePageContainer as ResourcePageContainer } from './ResourcePageContainer';

describe('pages/resource/ResourcePageContainer', () => {
  function getWrapper(props) {
    const defaults = {
      fetchResource: simple.mock(),
      params: { id: 'some-di' },
      resource: { id: 'r-1' },
      unit: { id: 'u-1' },
    };
    return shallow(<ResourcePageContainer {...defaults} {...props} />);
  }

  describe('render', () => {
    describe('if resource and unit are fetched', () => {
      let wrapper;
      const resource = { id: 'r-1' };
      const unit = { id: 'u-1' };

      before(() => {
        wrapper = getWrapper({ resource, unit });
      });

      it('renders a ResourceInfo with correct props', () => {
        const resourceInfo = wrapper.find(ResourceInfo);
        expect(resourceInfo).to.have.length(1);
        expect(resourceInfo.prop('resource')).to.deep.equal(resource);
        expect(resourceInfo.prop('unit')).to.deep.equal(unit);
      });
    });

    describe('if resource is not fetched', () => {
      let wrapper;
      const resource = {};

      before(() => {
        wrapper = getWrapper({ resource });
      });

      it('renders a Loader', () => {
        const loader = wrapper.find(Loader);
        expect(loader).to.have.length(1);
      });
    });

    describe('if unit is not fetched', () => {
      let wrapper;
      const unit = {};

      before(() => {
        wrapper = getWrapper({ unit });
      });

      it('renders a Loader', () => {
        const loader = wrapper.find(Loader);
        expect(loader).to.have.length(1);
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
