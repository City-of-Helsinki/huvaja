import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import { Field } from 'redux-form';

import ReduxFormField from 'shared/form-fields/ReduxFormField';
import CateringSection from './catering';
import { UnconnectedReservationForm as ReservationForm, validate } from './ReservationForm';

describe('pages/resource/reservation-form/ReservationForm', () => {
  describe('validation', () => {
    describe('if field value is missing', () => {
      const values = {};

      it('returns an error if field is in requiredFields', () => {
        const errors = validate(values);
        expect(errors.time).to.equal('Pakollinen tieto');
        expect(errors.resource).to.equal('Pakollinen tieto');
        expect(errors.eventName).to.equal('Pakollinen tieto');
        expect(errors.numberOfParticipants).to.equal('Pakollinen tieto');
      });
    });

    describe('if field has a value', () => {
      it('does not return an error even if field is required', () => {
        const values = {
          time: { begin: '2016-01-01T10:00:00', end: '2016-01-01T11:00:00' },
          resource: '123',
          eventName: 'name',
          numberOfParticipants: 21,
        };
        const errors = validate(values);
        expect(errors.time).to.not.exist;
        expect(errors.resource).to.not.exist;
        expect(errors.eventName).to.not.exist;
        expect(errors.numberOfParticipants).to.not.exist;
      });
    });
  });

  describe('rendering', () => {
    function getWrapper(props) {
      const defaults = {
        date: '2016-01-01',
        handleSubmit: () => null,
        resource: {},
        onDateChange: () => null,
        hasTime: true,
      };
      return shallow(<ReservationForm {...defaults} {...props} />);
    }

    it('renders a Form component', () => {
      const form = getWrapper().find('form');
      expect(form.length).to.equal(1);
    });

    describe('form fields', () => {
      let fields;

      before(() => {
        fields = getWrapper().find(Field);
      });

      it('length is 6', () => {
        expect(fields).to.have.length(6);
      });

      it('length is 1 if does not have time', () => {
        const wrapper = getWrapper({ hasTime: false });
        expect(wrapper.find(Field)).to.have.length(1);
      });

      it('has a reservation time field', () => {
        const field = fields.filter({
          component: ReduxFormField,
          label: 'Aika*',
          name: 'time',
          type: 'reservation-time',
        });
        expect(field).to.have.length(1);
      });

      it('has a time field if not hasTime', () => {
        const wrapper = getWrapper({ hasTime: false });
        const field = wrapper.find(Field);
        expect(field.prop('label')).to.equal('Aika*');
        expect(field.prop('component')).to.equal(ReduxFormField);
        expect(field.prop('name')).to.equal('time');
        expect(field.prop('type')).to.equal('reservation-time');
      });

      it('has a resource field', () => {
        const field = fields.filter({
          component: ReduxFormField,
          controlProps: { disabled: true },
          label: 'Tila*',
          name: 'resource',
          type: 'text',
        });
        expect(field).to.have.length(1);
      });

      it('has a eventName field', () => {
        const field = fields.filter({
          component: ReduxFormField,
          controlProps: {},
          label: 'Tapahtuma*',
          name: 'eventName',
          type: 'text',
        });
        expect(field).to.have.length(1);
      });

      it('has a reserverName field', () => {
        const field = fields.filter({
          component: ReduxFormField,
          controlProps: {},
          label: 'Varaaja*',
          name: 'reserverName',
          type: 'text',
        });
        expect(field).to.have.length(1);
      });

      it('has a numberOfParticipants field', () => {
        const field = fields.filter({
          component: ReduxFormField,
          controlProps: {},
          label: 'Osallistujamäärä*',
          name: 'numberOfParticipants',
          type: 'number',
        });
        expect(field).to.have.length(1);
      });

      it('has a participantList field', () => {
        const field = fields.filter({
          component: ReduxFormField,
          controlProps: { rows: 6 },
          label: 'Lista osallistujista',
          name: 'participantList',
          type: 'textarea',
        });
        expect(field).to.have.length(1);
      });
    });

    it('renders CateringSection', () => {
      const cateringSection = getWrapper().find(CateringSection);
      expect(cateringSection).to.have.length(1);
    });

    describe('form buttons', () => {
      let buttons;

      before(() => {
        buttons = getWrapper().find(Button);
      });

      it('renders two buttons', () => {
        expect(buttons.length).to.equal(2);
      });

      describe('the first button', () => {
        it('has text "Tallenna varaus"', () => {
          expect(buttons.at(0).props().children).to.equal('Tallenna varaus');
        });
      });

      describe('the second button', () => {
        it('has text "Peruuta"', () => {
          expect(buttons.at(1).props().children).to.equal('Peruuta');
        });
      });
    });
  });
});
