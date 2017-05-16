import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import { Field } from 'redux-form';
import simple from 'simple-mock';

import ReduxFormField from 'shared/form-fields/ReduxFormField';
import CateringSection from './catering';
import { UnconnectedReservationForm as ReservationForm, validate } from './ReservationForm';

describe('shared/reservation-form/ReservationForm', () => {
  const defaults = {
    timelineDate: '2016-01-01',
    fetchResource: () => null,
    handleSubmit: () => null,
    numberOfParticipants: null,
    reservation: null,
    resource: { id: '123', peopleCapacity: 10 },
    onDateChange: () => null,
    submitting: false,
    timeRange: {
      begin: {},
      end: {},
    },
  };
  function getWrapper(props) {
    return shallow(<ReservationForm {...defaults} {...props} />);
  }

  describe('validation', () => {
    describe('if field value is missing', () => {
      const values = {};

      it('returns an error if field is in requiredFields', () => {
        const errors = validate(values);
        expect(errors.time).to.equal('Pakollinen tieto');
        expect(errors.resource).to.equal('Pakollinen tieto');
        expect(errors.eventSubject).to.equal('Pakollinen tieto');
        expect(errors.numberOfParticipants).to.equal('Pakollinen tieto');
      });
    });

    describe('if field has a value', () => {
      it('does not return an error even if field is required', () => {
        const values = {
          time: {
            begin: {
              date: '2016-01-01',
              time: '10:00',
            },
            end: {
              date: '2016-01-01',
              time: '11:00',
            },
          },
          resource: '123',
          eventSubject: 'name',
          numberOfParticipants: 21,
        };
        const errors = validate(values);
        expect(errors.time).to.not.exist;
        expect(errors.resource).to.not.exist;
        expect(errors.eventSubject).to.not.exist;
        expect(errors.numberOfParticipants).to.not.exist;
      });
    });

    describe('time', () => {
      function getError(time) {
        const values = {
          time: {
            begin: { date: '2016-01-01', time: '10:00' },
            end: { date: '2016-01-01', time: '11:00' },
            ...time,
          },
        };
        return validate(values).time;
      }

      it('has error when invalid begin time', () => {
        const error = getError({ begin: { date: '2016-01-01', time: '10:0-' } });
        expect(error).to.equal('Epäkelpo päivä tai aika');
      });

      it('has error when invalid end time', () => {
        const error = getError({ end: { date: '2016-01-01', time: '10:0-' } });
        expect(error).to.equal('Epäkelpo päivä tai aika');
      });

      it('has error when end time before begin', () => {
        const error = getError({
          begin: { date: '2016-01-01', time: '10:30' },
          end: { date: '2016-01-01', time: '10:00' },
        });
        expect(error).to.equal('Alkamisajan on oltava ennen loppumisaikaa');
      });

      it('has error when begin time has invalid minutes', () => {
        const minutes = ['01', '05', '10', '20', '29', '31', '45', '50', '55', '59'];
        minutes.forEach((minute) => {
          const error = getError({
            begin: { date: '2016-01-01', time: `10:${minute}` },
          });
          expect(error).to.equal('Ajan on päätyttävä :00 tai :30');
        });
      });

      it('has error when end time has invalid minutes', () => {
        const minutes = ['01', '05', '10', '20', '29', '31', '45', '50', '55', '59'];
        minutes.forEach((minute) => {
          const error = getError({
            end: { date: '2016-01-01', time: `10:${minute}` },
          });
          expect(error).to.equal('Ajan on päätyttävä :00 tai :30');
        });
      });
    });
  });

  describe('rendering', () => {
    it('renders a Form component', () => {
      const form = getWrapper().find('form');
      expect(form.length).to.equal(1);
    });

    describe('form fields', () => {
      let fields;

      before(() => {
        fields = getWrapper().find(Field);
      });

      it('length is 9', () => {
        expect(fields).to.have.length(9);
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

      it('has a time field', () => {
        const wrapper = getWrapper();
        const field = wrapper.find('.timeline-container').find(Field);
        expect(field.prop('label')).to.equal('Aika*');
        expect(field.prop('component')).to.equal(ReduxFormField);
        expect(field.prop('name')).to.equal('time');
        expect(field.prop('type')).to.equal('reservation-time');
        expect(field.prop('controlProps').date).to.equal(defaults.timelineDate);
        expect(field.prop('controlProps').hideDateSelector).to.be.true;
        expect(field.prop('controlProps').resource).to.equal(defaults.resource);
      });

      it('time field excludes reservation when exists', () => {
        const reservation = { id: 23 };
        const wrapper = getWrapper({ reservation });
        const field = wrapper.find('.timeline-container').find(Field);
        expect(field.prop('controlProps').excludeReservation).to.equal(23);
      });

      it('has a datetimerange field', () => {
        const field = fields.filter({
          component: ReduxFormField,
          controlProps: { required: true },
          label: 'Varauksen aika*',
          name: 'time',
          type: 'date-time-range',
        });
        expect(field).to.have.length(1);
      });

      it('has a resource field', () => {
        const field = fields.filter({
          component: ReduxFormField,
          controlProps: {
            resource: defaults.resource,
            timeRange: defaults.timeRange,
          },
          label: 'Tila*',
          name: 'resource',
          type: 'resource',
        });
        expect(field).to.have.length(1);
      });

      it('has a eventSubject field', () => {
        const field = fields.filter({
          component: ReduxFormField,
          controlProps: {},
          label: 'Varauksen otsikko*',
          name: 'eventSubject',
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

      it('has a hostName field', () => {
        const field = fields.filter({
          component: ReduxFormField,
          controlProps: {},
          label: 'Varauksen isäntä*',
          name: 'hostName',
          type: 'text',
        });
        expect(field).to.have.length(1);
      });

      it('has a numberOfParticipants field', () => {
        const field = fields.filter({
          component: ReduxFormField,
          controlProps: {},
          label: 'Osallistujien määrä*',
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

      it('has a eventDescription field', () => {
        const field = fields.filter({
          component: ReduxFormField,
          controlProps: { rows: 6 },
          label: 'Lisätietoja',
          name: 'eventDescription',
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

        it('has text "Tallennetaan..." when submitting', () => {
          const props = { submitting: true };
          const button = getWrapper(props).find(Button).at(0);
          expect(button.props().children).to.equal('Tallennetaan...');
        });
      });

      describe('the second button', () => {
        it('has text "Peruuta"', () => {
          expect(buttons.at(1).props().children).to.equal('Peruuta');
        });
      });
    });

    describe('warning', () => {
      it('warns about numberOfParticipants > peopleCapacity', () => {
        const props = {
          numberOfParticipants: 11,
        };
        const warning = getWrapper(props).find('.reservation-form-warning');
        expect(warning).to.have.length(1);
        const text = (
          'Huomaa että osallistujia on enemmän kuin tilassa on istumapaikkoja.'
        );
        expect(warning.contains(text)).to.be.true;
      });

      it('does not warn about numberOfParticipants = peopleCapacity', () => {
        const props = {
          numberOfParticipants: 10,
        };
        const warning = getWrapper(props).find('.reservation-form-warning');
        expect(warning).to.have.length(0);
      });
    });
  });

  describe('lifecycle methods', () => {
    describe('componentDidMount', () => {
      it('fetches resource for correct date and resource', () => {
        const fetchResource = simple.mock();
        const instance = getWrapper({ fetchResource }).instance();
        instance.componentDidMount();
        expect(fetchResource.callCount).to.equal(1);
        expect(fetchResource.lastCall.args[0]).to.equal(defaults.resource.id);
        expect(fetchResource.lastCall.args[1]).to.deep.equal({
          date: defaults.timelineDate,
        });
      });

      it('does not fetch if no resource', () => {
        const fetchResource = simple.mock();
        const props = { fetchResource, resource: null };
        const instance = getWrapper(props).instance();
        instance.componentDidMount();
        expect(fetchResource.callCount).to.equal(0);
      });
    });

    describe('componentWillReceiveProps', () => {
      it('fetches resource for new timelineDate when timelineDate changes', () => {
        const fetchResource = simple.mock();
        const instance = getWrapper({ fetchResource }).instance();
        const nextProps = {
          resource: defaults.resource,
          timelineDate: '2016-01-02',
        };
        instance.componentWillReceiveProps(nextProps);
        expect(fetchResource.callCount).to.equal(1);
        expect(fetchResource.lastCall.args[0]).to.equal(nextProps.resource.id);
        expect(fetchResource.lastCall.args[1]).to.deep.equal({
          date: nextProps.timelineDate,
        });
      });

      it('fetches resource for new resource when resource changes', () => {
        const fetchResource = simple.mock();
        const instance = getWrapper({ fetchResource }).instance();
        const nextProps = {
          resource: { id: '555' },
          timelineDate: defaults.timelineRange,
        };
        instance.componentWillReceiveProps(nextProps);
        expect(fetchResource.callCount).to.equal(1);
        expect(fetchResource.lastCall.args[0]).to.equal(nextProps.resource.id);
        expect(fetchResource.lastCall.args[1]).to.deep.equal({
          date: nextProps.timelineDate,
        });
      });

      it('does not fetch resource when timelineDate does not change', () => {
        const fetchResource = simple.mock();
        const instance = getWrapper({ fetchResource }).instance();
        const nextProps = {
          resource: defaults.resource,
          timelineDate: defaults.timelineDate,
        };
        instance.componentWillReceiveProps(nextProps);
        expect(fetchResource.callCount).to.equal(0);
      });

      it('does not fetch when no resource', () => {
        const fetchResource = simple.mock();
        const props = { fetchResource };
        const instance = getWrapper(props).instance();
        const nextProps = {
          resource: null,
          timelineDate: '2016-01-02',
        };
        instance.componentWillReceiveProps(nextProps);
        expect(fetchResource.callCount).to.equal(0);
      });
    });
  });
});
