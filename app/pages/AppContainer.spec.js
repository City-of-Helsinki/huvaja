import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import Grid from 'react-bootstrap/lib/Grid';
import DocumentTitle from 'react-document-title';
import Loader from 'react-loader';
import simple from 'simple-mock';

import Navbar from 'shared/navbar';
import locationUtils from 'utils/locationUtils';
import { getState } from 'utils/testUtils';
import { UnconnectedAppContainer as AppContainer, selector } from './AppContainer';

describe('pages/AppContainer', () => {
  const content = <p className="children">Some content</p>;
  function getWrapper(props) {
    const defaults = {
      fetchAuthState: () => null,
      fetchEquipment: () => null,
      fetchResources: () => null,
      fetchTypes: () => null,
      fetchUnits: () => null,
      isAuthFetched: true,
      isLoggedIn: true,
    };
    return shallow(<AppContainer {...defaults} {...props}>{content}</AppContainer>);
  }

  describe('render', () => {
    describe('Navbar', () => {
      it('is rendered', () => {
        const title = getWrapper().find(Navbar);
        expect(title.length).to.equal(1);
      });
    });

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
      const div = getWrapper().find('.app');
      expect(div.length).to.equal(1);
    });

    it('renders children inside a grid wrapper', () => {
      const grid = getWrapper().find(Grid);
      expect(grid).to.have.length(1);
      const children = grid.find('.children');
      expect(children.equals(content)).to.be.true;
    });

    describe('loader', () => {
      it('gets loaded if isAuthFetched and isLoggedIn', () => {
        const loader = getWrapper({ isAuthFetched: true, isLoggedIn: true }).find(Loader);
        expect(loader.prop('loaded')).to.be.true;
      });

      it('does not get loaded if isAuthFetched is false', () => {
        const loader = getWrapper({ isAuthFetched: false, isLoggedIn: true }).find(Loader);
        expect(loader.prop('loaded')).to.be.false;
      });

      it('does not get loaded if isLoggedIn is false', () => {
        const loader = getWrapper({ isAuthFetched: true, isLoggedIn: false }).find(Loader);
        expect(loader.prop('loaded')).to.be.false;
      });
    });
  });

  describe('componentDidMount', () => {
    it('fetches auth state', () => {
      const fetchAuthState = simple.mock();
      const instance = getWrapper({ fetchAuthState }).instance();
      instance.componentDidMount();
      expect(fetchAuthState.callCount).to.equal(1);
    });

    it('fetches units', () => {
      const fetchUnits = simple.mock();
      const instance = getWrapper({ fetchUnits }).instance();
      instance.componentDidMount();
      expect(fetchUnits.callCount).to.equal(1);
    });

    it('fetches types', () => {
      const fetchTypes = simple.mock();
      const instance = getWrapper({ fetchTypes }).instance();
      instance.componentDidMount();
      expect(fetchTypes.callCount).to.equal(1);
    });

    it('fetches equipment', () => {
      const fetchEquipment = simple.mock();
      const instance = getWrapper({ fetchEquipment }).instance();
      instance.componentDidMount();
      expect(fetchEquipment.callCount).to.equal(1);
    });

    it('fetches resources with param times = false', () => {
      const fetchResources = simple.mock();
      const instance = getWrapper({ fetchResources }).instance();
      instance.componentDidMount();
      expect(fetchResources.callCount).to.equal(1);
      expect(fetchResources.lastCall.args).to.deep.equal([{}, false]);
    });
  });

  describe('componentWillReceiveProps', () => {
    beforeEach(() => {
      simple.mock(locationUtils, 'redirect').returnWith(null);
    });

    afterEach(() => {
      simple.restore();
    });

    function callsRedirect(props) {
      const wrapper = getWrapper({ isAuthFetched: false, isLoggedIn: false });
      wrapper.instance().componentWillReceiveProps(props);
      return locationUtils.redirect.called;
    }

    describe('when isAuthFetched is false', () => {
      it('does not redirect if isLoggedIn is false', () => {
        const redirected = callsRedirect({ isAuthFetched: false, isLoggedIn: false });
        expect(redirected).to.be.false;
      });

      it('does not redirect if isLoggedIn is true', () => {
        const redirected = callsRedirect({ isAuthFetched: false, isLoggedIn: true });
        expect(redirected).to.be.false;
      });
    });

    describe('when isAuthFetched is true', () => {
      it('does redirect if isLoggedIn is false', () => {
        const redirected = callsRedirect({ isAuthFetched: true, isLoggedIn: false });
        expect(redirected).to.be.true;
        expect(locationUtils.redirect.lastCall.args).to.deep.equal(['/login']);
      });

      it('does not redirect if isLoggedIn is true', () => {
        const redirected = callsRedirect({ isAuthFetched: true, isLoggedIn: true });
        expect(redirected).to.be.false;
      });
    });
  });

  describe('selector', () => {
    it('returns isFetched from auth state', () => {
      const state = getState({
        auth: { isFetched: true },
      });
      expect(selector(state).isAuthFetched).to.be.true;
    });

    describe('isLoggedIn', () => {
      it('is true if token', () => {
        const state = getState({
          auth: { isFetched: true, token: 'token' },
        });
        expect(selector(state).isLoggedIn).to.be.true;
      });

      it('is false if no token', () => {
        const state = getState({
          auth: { isFetched: true },
        });
        expect(selector(state).isLoggedIn).to.be.false;
      });
    });
  });
});
