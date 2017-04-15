import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import Checkbox from 'react-bootstrap/lib/Checkbox';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';
import simple from 'simple-mock';

import DateTimeRange from 'shared/form-fields/DateTimeRange';
import SearchControls from './SearchControls';

describe('pages/search/search-controls/SearchControls', () => {
  const defaultValues = {
    availableStartDate: '2016-12-12',
    availableStartTime: '',
    availableEndDate: '2016-12-12',
    availableEndTime: '',
    date: '2016-12-12',
    equipment: '',
    isFavorite: '',
    people: '',
    search: '',
    type: '',
    unit: '',
  };
  const units = {
    abd: {
      name: { fi: 'Some unit' },
      streetAddress: { fi: 'Aleksanterinkatu 22' },
    },
    abc: {
      name: { fi: 'Bockin talo' },
      streetAddress: { fi: 'Aleksanterinkatu 20' },
    },
  };
  const equipment = {
    qwerty: {
      name: { fi: 'Videoprojektori' },
    },
    qwertx: {
      name: { fi: 'Some equipment' },
    },
  };
  const types = {
    asde: {
      name: { fi: 'Some type' },
    },
    asdf: {
      name: { fi: 'Neuvotteluhuone' },
    },
  };
  function getWrapper(props, showAdvanced = true) {
    const defaults = {
      equipment,
      onChange: () => null,
      values: defaultValues,
      types,
      units,
    };
    const wrapper = shallow(<SearchControls {...defaults} {...props} />);
    if (showAdvanced) wrapper.setState({ showAdvanced: true });
    return wrapper;
  }

  describe('render', () => {
    it('renders form', () => {
      const wrapper = getWrapper();
      const form = wrapper.find('form');
      expect(form).to.have.length(1);
    });

    describe('search control', () => {
      function getSearchControlWrapper(values) {
        const wrapper = getWrapper({
          values: Object.assign({}, defaultValues, values),
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
          values: Object.assign({}, defaultValues, values),
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

    describe('available between control', () => {
      function getControlWrapper(values) {
        const wrapper = getWrapper({
          values: Object.assign({}, defaultValues, values),
        });
        return wrapper.find('[controlId="available-between-control-group"]');
      }

      it('has correct label', () => {
        const controlLabel = getControlWrapper().find(ControlLabel);
        expect(controlLabel.prop('children')).to.equal('Vapaana aikavälille');
      });

      it('renders DateTimeRange with correct value', () => {
        const values = {
          availableStartDate: '2016-12-13',
          availableStartTime: '09:00',
          availableEndDate: '2016-12-13',
          availableEndTime: '16:30',
        };
        const range = getControlWrapper(values).find(DateTimeRange);
        expect(range).to.have.length(1);
        const expected = {
          begin: {
            date: values.availableStartDate,
            time: values.availableStartTime,
          },
          end: {
            date: values.availableEndDate,
            time: values.availableEndTime,
          },
        };
        expect(range.prop('controlProps').value).to.deep.equal(expected);
      });
    });

    describe('unit control', () => {
      function getUnitControlWrapper(values) {
        const wrapper = getWrapper({
          values: Object.assign({}, defaultValues, values),
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

      it('renders correct options sorted by label', () => {
        const field = getUnitControlWrapper().find(FormControl);
        const option = field.find('option');
        expect(option).to.have.length(3);

        expect(option.at(0).prop('value')).to.equal('');
        expect(option.at(0).text()).to.equal('Kaikki kiinteistöt');

        expect(option.at(1).prop('value')).to.equal('abc');
        expect(option.at(1).text()).to.equal('Bockin talo - Aleksanterinkatu 20');

        expect(option.at(2).prop('value')).to.equal('abd');
        expect(option.at(2).text()).to.equal('Some unit - Aleksanterinkatu 22');
      });
    });

    describe('people control', () => {
      function getPeopleControlWrapper(values) {
        const wrapper = getWrapper({
          values: Object.assign({}, defaultValues, values),
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
          values: Object.assign({}, defaultValues, values),
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

      it('has correct options sorted by name', () => {
        const equipmentWrapper = getEquipmentWrapper();
        const expected = [
          {
            id: 'qwertx',
            name: 'Some equipment',
          },
          {
            id: 'qwerty',
            name: 'Videoprojektori',
          },
        ];
        expect(equipmentWrapper.prop('options')).to.deep.equal(expected);
      });
    });

    describe('type control', () => {
      function getTypeWrapper(values) {
        const wrapper = getWrapper({
          values: Object.assign({}, defaultValues, values),
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

      it('has correct options sorted by name', () => {
        const typeWrapper = getTypeWrapper();
        const expected = [
          {
            id: 'asdf',
            name: 'Neuvotteluhuone',
          },
          {
            id: 'asde',
            name: 'Some type',
          },
        ];
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
  });

  describe('constructor function', () => {
    it('hides advanced search', () => {
      const instance = getWrapper(null, false).instance();
      expect(instance.state.showAdvanced).to.be.false;
    });
  });

  describe('toggleAdvanced', () => {
    it('changes showAdvanced in state', () => {
      const initialState = {
        ...defaultValues,
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

  describe('handleChange', () => {
    it('calls onChange with updated filter', () => {
      const onChange = simple.mock();
      const instance = getWrapper({ onChange }).instance();
      const filters = { search: 'search text' };
      instance.handleChange(filters);
      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.arg).to.deep.equal(filters);
    });
  });

  describe('handleAvailableBetweenChange', () => {
    it('calls onChange with correct filters', () => {
      const onChange = simple.mock();
      const instance = getWrapper({ onChange }).instance();
      const filters = {
        begin: {
          date: '2016-12-13',
          time: '09:00',
        },
        end: {
          date: '2016-12-13',
          time: '16:30',
        },
      };
      instance.handleAvailableBetweenChange(filters);
      expect(onChange.callCount).to.equal(1);
      const expected = {
        availableStartDate: filters.begin.date,
        availableStartTime: filters.begin.time,
        availableEndDate: filters.end.date,
        availableEndTime: filters.end.time,
      };
      expect(onChange.lastCall.arg).to.deep.equal(expected);
    });
  });
});
