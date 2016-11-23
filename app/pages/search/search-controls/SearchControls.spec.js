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
      initialValues: { query: '' },
    };
    return shallow(<SearchControls {...defaults} {...props} />);
  }

  it('renders form with correct onSubmit', () => {
    const wrapper = getWrapper();
    const form = wrapper.find('form');
    expect(form).to.have.length(1);
    expect(form.prop('onSubmit')).to.equal(wrapper.instance().handleSearch);
  });

  describe('search query control', () => {
    const query = 'some query';
    let wrapper;
    let queryContorlWrapper;

    before(() => {
      wrapper = getWrapper({ initialValues: { query } });
      queryContorlWrapper = wrapper.find('[controlId="search-query"]');
    });

    it('has correct label', () => {
      const controlLabel = queryContorlWrapper.find(ControlLabel);
      expect(controlLabel.prop('children')).to.equal('Tekstihaku');
    });

    it('has correct initial value', () => {
      const queryControl = queryContorlWrapper.find(FormControl);
      expect(queryControl.prop('value')).to.equal(query);
    });
  });

  it('renders a submit button', () => {
    const button = getWrapper().find(Button);
    expect(button).to.have.length(1);
    expect(button.prop('type')).to.equal('submit');
  });

  describe('handleSearch', () => {
    const searchFilters = {
      query: 'some query',
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
