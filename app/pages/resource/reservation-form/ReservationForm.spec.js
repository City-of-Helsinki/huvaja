import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import { Field } from 'redux-form';

import ReduxFormField from 'shared/form-fields/ReduxFormField';
import { UnconnectedReservationForm as ReservationForm, validate } from './ReservationForm';

describe('pages/resource/reservation-form/ReservationForm', () => {
  describe('validation', () => {
    describe('if field value is missing', () => {
      const values = {};

      it('returns an error if field is in requiredFields', () => {
        const errors = validate(values);
        expect(errors.resource).to.equal('Pakollinen tieto');
        expect(errors.eventName).to.equal('Pakollinen tieto');
        expect(errors.numberOfParticipants).to.equal('Pakollinen tieto');
      });
    });

    describe('if field has a value', () => {
      it('does not return an error even if field is required', () => {
        const values = {
          resource: '123',
          eventName: 'name',
          numberOfParticipants: 21,
        };
        const errors = validate(values);
        expect(errors.resource).to.not.exist;
        expect(errors.eventName).to.not.exist;
        expect(errors.numberOfParticipants).to.not.exist;
      });
    });
  });

  describe('rendering', () => {
    function getWrapper() {
      const handleSubmit = () => {};
      return shallow(<ReservationForm handleSubmit={handleSubmit} />);
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

      it('lenght is 3', () => {
        expect(fields).to.have.length(3);
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
      it('has a numberOfParticipants field', () => {
        const field = fields.filter({
          component: ReduxFormField,
          controlProps: {},
          label: 'Osallistujia*',
          name: 'numberOfParticipants',
          type: 'number',
        });
        expect(field).to.have.length(1);
      });
    });

    describe('form buttons', () => {
      const buttons = getWrapper().find(Button);

      it('renders two buttons', () => {
        expect(buttons.length).to.equal(2);
      });

      describe('the first button', () => {
        const button = buttons.at(0);

        it('has text "Takaisin"', () => {
          expect(button.props().children).to.equal('Tallena varaus');
        });
      });

      describe('the second button', () => {
        const button = buttons.at(1);

        it('has text "Tallenna"', () => {
          expect(button.props().children).to.equal('Peruuta');
        });
      });
    });
  });
});
