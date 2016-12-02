import { expect } from 'chai';
import { shallow } from 'enzyme';
import queryString from 'query-string';
import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import Checkbox from 'react-bootstrap/lib/Checkbox';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';
import { browserHistory } from 'react-router';
import simple from 'simple-mock';

import DatePicker from 'shared/date-picker';
import SearchControls from './SearchControls';

describe('pages/search/search-controls/SearchControls', () => {
  const defaultInitialValues = { date: '2016-12-12', search: '', isFavorite: 'false' };
  function getWrapper(props) {
    const defaults = {
      initialValues: defaultInitialValues,
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
      function getSearchControlWrapper(values) {
        const wrapper = getWrapper({
          initialValues: Object.assign({}, defaultInitialValues, values),
        });
        return wrapper.find('[controlId="search-control-group"]');
      }

      it('has correct label', () => {
        const controlLabel = getSearchControlWrapper().find(ControlLabel);
        expect(controlLabel.prop('children')).to.equal('Tekstihaku');
      });

      it('has correct initial value', () => {
        const search = 'search text';
        const searchControl = getSearchControlWrapper({ search }).find(FormControl);
        expect(searchControl.prop('value')).to.equal(search);
      });
    });

    describe('isFavorite control', () => {
      function getIsFavoriteCheckboxWrapper(values) {
        const wrapper = getWrapper({
          initialValues: Object.assign({}, defaultInitialValues, values),
        });
        return wrapper.find('.is-favorite-checkbox');
      }

      it('has correct label', () => {
        const label = getIsFavoriteCheckboxWrapper().prop('children');
        expect(label).to.equal('Näytä vain suosikit');
      });

      it('renders CheckBox with correct value', () => {
        const isFavoriteCheckbox = getIsFavoriteCheckboxWrapper(
          { isFavorite: 'true' }
        ).find(Checkbox);
        expect(isFavoriteCheckbox).to.have.length(1);
        expect(isFavoriteCheckbox.prop('checked')).to.equal(true);
      });
    });

    describe('date control', () => {
      function getDateControlWrapper(values) {
        const wrapper = getWrapper({
          initialValues: Object.assign({}, defaultInitialValues, values),
        });
        return wrapper.find('[controlId="date-control-group"]');
      }

      it('has correct label', () => {
        const controlLabel = getDateControlWrapper().find(ControlLabel);
        expect(controlLabel.prop('children')).to.equal('Päivä');
      });

      it('renders DatePicker with correct value', () => {
        const date = '2016-12-12';
        const datePicker = getDateControlWrapper({ date }).find(DatePicker);
        expect(datePicker).to.have.length(1);
        expect(datePicker.prop('value')).to.equal(date);
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
      const initialValues = defaultInitialValues;
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

    describe('when initialValues prop is the same than current state', () => {
      const state = Object({}, defaultInitialValues, { search: 'test' });
      const nextProps = { initialValues: state };
      let setStateMock;

      before(() => {
        const instance = getWrapper().instance();
        instance.state = state;
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

    function callSearch(filters, props) {
      const instance = getWrapper(props).instance();
      instance.state = filters || searchFilters;
      instance.handleSearch(mockSubmitEvent);
    }

    beforeEach(() => {
      browserHistoryMock = simple.mock(browserHistory, 'push');
    });

    afterEach(() => {
      simple.restore();
    });

    it('changes the url with current search filters', () => {
      callSearch();
      const actualPath = browserHistoryMock.lastCall.args[0];
      const expectedPath = `/?${queryString.stringify(searchFilters)}`;

      expect(browserHistoryMock.callCount).to.equal(1);
      expect(actualPath).to.equal(expectedPath);
    });

    it('decamelize camelized keys', () => {
      callSearch({ ...searchFilters, isFavorite: 'true' });
      const actualPath = browserHistoryMock.lastCall.args[0];
      const expectedFilters = { ...searchFilters, is_favorite: 'true' };
      const expectedPath = `/?${queryString.stringify(expectedFilters)}`;

      expect(browserHistoryMock.callCount).to.equal(1);
      expect(actualPath).to.equal(expectedPath);
    });
  });
});
