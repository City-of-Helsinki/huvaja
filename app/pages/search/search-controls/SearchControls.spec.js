import { expect } from 'chai';
import { shallow } from 'enzyme';
import queryString from 'query-string';
import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';
import { browserHistory } from 'react-router';
import simple from 'simple-mock';

import SearchControls from './SearchControls';

describe('pages/search/search-controls/SearchControls', () => {
  function getWrapper(props) {
    const defaults = {
      initialValues: { search: '' },
    };
    return shallow(<SearchControls {...defaults} {...props} />);
  }

  describe('render', () => {
    it('renders form with correct onSubmit', () => {
      const wrapper = getWrapper();
      const form = wrapper.find('form');
      expect(form).to.have.length(1);
      expect(form.prop('onSubmit')).to.equal(wrapper.instance().handleSearch);
    });

    describe('search control', () => {
      const search = 'search text';
      let wrapper;
      let searchContorlWrapper;

      before(() => {
        wrapper = getWrapper({ initialValues: { search } });
        searchContorlWrapper = wrapper.find('[controlId="search-control-group"]');
      });

      it('has correct label', () => {
        const controlLabel = searchContorlWrapper.find(ControlLabel);
        expect(controlLabel.prop('children')).to.equal('Tekstihaku');
      });

      it('has correct initial value', () => {
        const searchControl = searchContorlWrapper.find(FormControl);
        expect(searchControl.prop('value')).to.equal(search);
      });
    });

    it('renders a submit button', () => {
      const button = getWrapper().find(Button);
      expect(button).to.have.length(1);
      expect(button.prop('type')).to.equal('submit');
    });
  });

  describe('componentWillReceiveProps', () => {
    describe('when initialValues prop changes', () => {
      const initialValues = { search: 'search text' };
      const nextProps = { initialValues: { search: 'new search' } };
      let setStateMock;

      before(() => {
        const instance = getWrapper({ initialValues }).instance();
        instance.state = initialValues;
        setStateMock = simple.mock(instance, 'setState');
        instance.componentWillReceiveProps(nextProps);
      });

      after(() => {
        simple.restore();
      });

      it('changes state to the new initialValues', () => {
        expect(setStateMock.callCount).to.equal(1);
        expect(setStateMock.lastCall.arg).to.deep.equal(nextProps.initialValues);
      });
    });

    describe('when initialValues prop does not change', () => {
      const initialValues = { search: 'search text' };
      const nextProps = { initialValues };
      let setStateMock;

      before(() => {
        const instance = getWrapper({ initialValues }).instance();
        instance.state = initialValues;
        setStateMock = simple.mock(instance, 'setState');
        instance.componentWillReceiveProps(nextProps);
      });

      after(() => {
        simple.restore();
      });

      it('does not change state', () => {
        expect(setStateMock.callCount).to.equal(0);
      });
    });
  });

  describe('handleSearch', () => {
    const searchFilters = {
      search: 'search text',
    };
    const mockSubmitEvent = { preventDefault: () => {} };
    let browserHistoryMock;
    let instance;

    before(() => {
      browserHistoryMock = simple.mock(browserHistory, 'push');
      instance = getWrapper().instance();
      instance.state = searchFilters;
      instance.handleSearch(mockSubmitEvent);
    });

    after(() => {
      simple.restore();
    });

    it('changes the url with current search filters', () => {
      const actualPath = browserHistoryMock.lastCall.args[0];
      const expectedPath = `/?${queryString.stringify(searchFilters)}`;

      expect(browserHistoryMock.callCount).to.equal(1);
      expect(actualPath).to.equal(expectedPath);
    });
  });
});
