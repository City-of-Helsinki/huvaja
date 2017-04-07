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
  const defaultInitialValues = {
    date: '2016-12-12',
    equipment: '',
    isFavorite: '',
    people: '',
    search: '',
    type: '',
    unit: '',
  };
  const units = {
    abc: {
      name: { fi: 'Bockin talo' },
      streetAddress: { fi: 'Aleksanterinkatu 20' },
    },
  };
  const equipment = {
    qwerty: {
      name: { fi: 'Videoprojektori' },
    },
  };
  const types = {
    asdf: {
      name: { fi: 'Neuvotteluhuone' },
    },
  };
  function getWrapper(props, showAdvanced = true) {
    const defaults = {
      equipment,
      initialValues: defaultInitialValues,
      types,
      units,
    };
    const wrapper = shallow(<SearchControls {...defaults} {...props} />);
    if (showAdvanced) wrapper.setState({ showAdvanced: true });
    return wrapper;
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
        expect(controlLabel.prop('children')).to.equal('Tilan nimi');
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
        expect(label).to.equal('Näytä vain omat suosikit');
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

    describe('unit control', () => {
      function getUnitControlWrapper(values) {
        const wrapper = getWrapper({
          initialValues: Object.assign({}, defaultInitialValues, values),
        });
        return wrapper.find('[controlId="unit-control-group"]');
      }

      it('has correct label', () => {
        const controlLabel = getUnitControlWrapper().find(ControlLabel);
        expect(controlLabel.prop('children')).to.equal('Kiinteistö');
      });

      it('renders select field with correct value', () => {
        const unit = 'abc';
        const field = getUnitControlWrapper({ unit }).find(FormControl);
        expect(field).to.have.length(1);
        expect(field.prop('value')).to.equal(unit);
      });

      it('renders correct options', () => {
        const field = getUnitControlWrapper().find(FormControl);
        const option = field.find('option');
        expect(option).to.have.length(2);

        expect(option.at(0).prop('value')).to.equal('');
        expect(option.at(0).text()).to.equal('Kaikki kiinteistöt');

        expect(option.at(1).prop('value')).to.equal('abc');
        expect(option.at(1).text()).to.equal('Bockin talo - Aleksanterinkatu 20');
      });
    });

    describe('people control', () => {
      function getPeopleControlWrapper(values) {
        const wrapper = getWrapper({
          initialValues: Object.assign({}, defaultInitialValues, values),
        });
        return wrapper.find('[controlId="people-control-group"]');
      }

      it('has correct label', () => {
        const controlLabel = getPeopleControlWrapper().find(ControlLabel);
        expect(controlLabel.prop('children')).to.equal('Paikkoja vähintään');
      });

      it('has correct initial value', () => {
        const people = '15';
        const peopleControl = getPeopleControlWrapper({ people }).find(FormControl);
        expect(peopleControl.prop('value')).to.equal(people);
      });
    });

    describe('equipment control', () => {
      function getEquipmentWrapper(values) {
        const wrapper = getWrapper({
          initialValues: Object.assign({}, defaultInitialValues, values),
        });
        return wrapper.find('[id="equipment-control-group"]');
      }

      it('has correct label', () => {
        const equipmentWrapper = getEquipmentWrapper();
        expect(equipmentWrapper.prop('label')).to.equal('Saatavilla olevat varusteet');
      });

      it('has correct initial value', () => {
        const eq = 'qwerty';
        const equipmentWrapper = getEquipmentWrapper({ equipment: eq });
        expect(equipmentWrapper.prop('value')).to.equal(eq);
      });

      it('has correct options', () => {
        const equipmentWrapper = getEquipmentWrapper();
        const expected = [{
          id: 'qwerty',
          name: 'Videoprojektori',
        }];
        expect(equipmentWrapper.prop('options')).to.deep.equal(expected);
      });
    });

    describe('type control', () => {
      function getTypeWrapper(values) {
        const wrapper = getWrapper({
          initialValues: Object.assign({}, defaultInitialValues, values),
        });
        return wrapper.find('[id="type-control-group"]');
      }

      it('has correct label', () => {
        const typeWrapper = getTypeWrapper();
        expect(typeWrapper.prop('label')).to.equal('Tilan tyyppi');
      });

      it('has correct initial value', () => {
        const type = 'asdf';
        const typeWrapper = getTypeWrapper({ type });
        expect(typeWrapper.prop('value')).to.equal(type);
      });

      it('has correct options', () => {
        const typeWrapper = getTypeWrapper();
        const expected = [{
          id: 'asdf',
          name: 'Neuvotteluhuone',
        }];
        expect(typeWrapper.prop('options')).to.deep.equal(expected);
      });
    });

    describe('advanced search link', () => {
      it('is rendered', () => {
        const link = getWrapper().find('.toggle-advanced');
        expect(link).to.have.length(1);
      });

      it('has onClick prop', () => {
        const link = getWrapper().find('.toggle-advanced');
        expect(link.prop('onClick')).to.be.a('function');
      });
    });

    it('renders a submit button', () => {
      const button = getWrapper().find(Button);
      expect(button).to.have.length(1);
      expect(button.prop('type')).to.equal('submit');
    });
  });

  describe('constructor function', () => {
    it('hides advanced search', () => {
      const instance = getWrapper(null, false).instance();
      expect(instance.state.showAdvanced).to.be.false;
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

  describe('toggleAdvanced', () => {
    it('changes showAdvanced in state', () => {
      const initialState = {
        ...defaultInitialValues,
        showAdvanced: false,
      };
      const instance = getWrapper().instance();
      instance.state = initialState;
      simple.mock(instance, 'setState');

      instance.toggleAdvanced();
      expect(instance.setState.callCount).to.equal(1);
      expect(instance.setState.lastCall.arg).to.deep.equal({ showAdvanced: true });
      instance.toggleAdvanced();
      expect(instance.setState.callCount).to.equal(2);
      expect(instance.setState.lastCall.arg).to.deep.equal({ showAdvanced: false });
      simple.restore();
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
      instance.state = {
        ...(filters || searchFilters),
        showAdvanced: true,
      };
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
