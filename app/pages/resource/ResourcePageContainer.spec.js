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
      date: '2016-01-01',
      fetchResource: () => null,
      location: { query: {} },
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
        const date = '2016-10-10';
        const resource = { id: 'id' };
        const unit = { name: { fi: 'wow' } };
        const wrapper = getWrapper({ date, isLoaded: true, resource, unit });
        const page = wrapper.find(ResourcePage);
        expect(page).to.have.length(1);
        expect(page.prop('resource')).to.equal(resource);
        expect(page.prop('unit')).to.equal(unit);
        expect(page.prop('date')).to.equal(date);
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
    it('fetches resource with correct id and date', () => {
      const date = '2016-11-01';
      const params = { id: 'resource-id' };
      const fetchResource = simple.mock();
      const instance = getWrapper({ fetchResource, params, date }).instance();
      instance.componentDidMount();
      expect(fetchResource.callCount).to.equal(1);
      expect(fetchResource.lastCall.args).to.deep.equal([params.id, { date }]);
    });
  });

  describe('componentDidUpdate', () => {
    describe('if date changes', () => {
      it('fetches resource with correct id and date', () => {
        const date = '2016-11-01';
        const params = { id: 'resource-id' };
        const fetchResource = simple.mock();
        const wrapper = getWrapper({ fetchResource, params, date });
        const instance = wrapper.instance();
        const oldProps = wrapper.props();
        wrapper.setProps({ ...oldProps, date: '2016-12-12' });
        instance.componentDidUpdate(oldProps);
        expect(fetchResource.callCount).to.equal(1);
        expect(fetchResource.lastCall.args).to.deep.equal([
          params.id, { date: '2016-12-12' },
        ]);
      });
    });

    describe('if date does not change', () => {
      it('does not fetch resource', () => {
        const fetchResource = simple.mock();
        const wrapper = getWrapper({ fetchResource });
        const instance = wrapper.instance();
        instance.componentDidUpdate(wrapper.props());
        expect(fetchResource.called).to.be.false;
      });
    });
  });
});
