import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import Checkbox from 'react-bootstrap/lib/Checkbox';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';
import simple from 'simple-mock';

import DatePicker from 'shared/date-picker';
import ReservationSearchControls from './ReservationSearchControls';

describe('pages/reservationSearch/reservation-search-controls/ReservationSearchControls', () => {
  const defaultValues = {
    end: '2016-12-12',
    eventSubject: '',
    hasCatering: '',
    hasEquipment: '',
    hostName: '',
    isFavoriteResource: '',
    isOwn: '',
    reserverName: '',
    resourceName: '',
    start: '2016-11-12',
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

  function getWrapper(props) {
    const defaults = {
      onChange: () => null,
      values: defaultValues,
      units,
    };
    return shallow(<ReservationSearchControls {...defaults} {...props} />);
  }

  describe('render', () => {
    it('renders form', () => {
      const wrapper = getWrapper();
      const form = wrapper.find('form');
      expect(form).to.have.length(1);
    });

    describe('eventSubject control', () => {
      function getEventSubjectControlWrapper(values) {
        const wrapper = getWrapper({
          values: Object.assign({}, defaultValues, values),
        });
        return wrapper.find('[controlId="event-subject-control-group"]');
      }

      it('has correct label', () => {
        const controlLabel = getEventSubjectControlWrapper().find(ControlLabel);
        expect(controlLabel.prop('children')).to.equal('Hae varauksen nimellä');
      });

      it('has correct initial value', () => {
        const eventSubject = 'Meeting';
        const control = getEventSubjectControlWrapper({ eventSubject }).find(FormControl);
        expect(control.prop('value')).to.equal(eventSubject);
      });
    });

    describe('hostName control', () => {
      function getHostNameControlWrapper(values) {
        const wrapper = getWrapper({
          values: Object.assign({}, defaultValues, values),
        });
        return wrapper.find('[controlId="host-name-control-group"]');
      }

      it('has correct label', () => {
        const controlLabel = getHostNameControlWrapper().find(ControlLabel);
        expect(controlLabel.prop('children')).to.equal('Varauksen isäntä');
      });

      it('has correct initial value', () => {
        const hostName = 'Pena';
        const control = getHostNameControlWrapper({ hostName }).find(FormControl);
        expect(control.prop('value')).to.equal(hostName);
      });
    });

    describe('isOwn control', () => {
      function getCheckboxWrapper(values) {
        const wrapper = getWrapper({
          values: Object.assign({}, defaultValues, values),
        });
        return wrapper.find('.is-own-checkbox');
      }

      it('has correct label', () => {
        const label = getCheckboxWrapper().prop('children');
        expect(label).to.equal('Näytä vain omat varaukset');
      });

      it('renders Checkbox with correct value', () => {
        const checkbox = getCheckboxWrapper(
          { isOwn: 'true' }
        ).find(Checkbox);
        expect(checkbox).to.have.length(1);
        expect(checkbox.prop('checked')).to.equal(true);
      });
    });

    describe('hasCatering control', () => {
      function getCheckboxWrapper(values) {
        const wrapper = getWrapper({
          values: Object.assign({}, defaultValues, values),
        });
        return wrapper.find('.has-catering-checkbox');
      }

      it('has correct label', () => {
        const label = getCheckboxWrapper().prop('children');
        expect(label).to.equal('Sisältää tarjoilutilauksen');
      });

      it('renders Checkbox with correct value', () => {
        const checkbox = getCheckboxWrapper(
          { hasCatering: 'true' }
        ).find(Checkbox);
        expect(checkbox).to.have.length(1);
        expect(checkbox.prop('checked')).to.equal(true);
      });
    });

    describe('hasEquipment control', () => {
      function getCheckboxWrapper(values) {
        const wrapper = getWrapper({
          values: Object.assign({}, defaultValues, values),
        });
        return wrapper.find('.has-equipment-checkbox');
      }

      it('has correct label', () => {
        const label = getCheckboxWrapper().prop('children');
        expect(label).to.equal('Sisältää lisävarusteita');
      });

      it('renders Checkbox with correct value', () => {
        const checkbox = getCheckboxWrapper(
          { hasEquipment: 'true' }
        ).find(Checkbox);
        expect(checkbox).to.have.length(1);
        expect(checkbox.prop('checked')).to.equal(true);
      });
    });

    describe('reserverName control', () => {
      function getReserverNameControlWrapper(values) {
        const wrapper = getWrapper({
          values: Object.assign({}, defaultValues, values),
        });
        return wrapper.find('[controlId="reserver-name-control-group"]');
      }

      it('has correct label', () => {
        const controlLabel = getReserverNameControlWrapper().find(ControlLabel);
        expect(controlLabel.prop('children')).to.equal('Varaaja');
      });

      it('has correct initial value', () => {
        const reserverName = 'Pena';
        const control = getReserverNameControlWrapper({ reserverName }).find(FormControl);
        expect(control.prop('value')).to.equal(reserverName);
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

    describe('resourceName control', () => {
      function getResourceNameControlWrapper(values) {
        const wrapper = getWrapper({
          values: Object.assign({}, defaultValues, values),
        });
        return wrapper.find('[controlId="resource-name-control-group"]');
      }

      it('has correct label', () => {
        const controlLabel = getResourceNameControlWrapper().find(ControlLabel);
        expect(controlLabel.prop('children')).to.equal('Tilan nimi');
      });

      it('has correct initial value', () => {
        const resourceName = 'Pena';
        const control = getResourceNameControlWrapper({ resourceName }).find(FormControl);
        expect(control.prop('value')).to.equal(resourceName);
      });
    });

    describe('isFavoriteResource control', () => {
      function getCheckboxWrapper(values) {
        const wrapper = getWrapper({
          values: Object.assign({}, defaultValues, values),
        });
        return wrapper.find('.is-favorite-resource-checkbox');
      }

      it('has correct label', () => {
        const label = getCheckboxWrapper().prop('children');
        expect(label).to.equal('Näytä vain omat suosikkitilat');
      });

      it('renders Checkbox with correct value', () => {
        const checkbox = getCheckboxWrapper(
          { isFavoriteResource: 'true' }
        ).find(Checkbox);
        expect(checkbox).to.have.length(1);
        expect(checkbox.prop('checked')).to.equal(true);
      });
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
});
