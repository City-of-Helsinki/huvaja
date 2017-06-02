import { expect } from 'chai';
import moment from 'moment';
import { shallow } from 'enzyme';
import React from 'react';
import simple from 'simple-mock';

import { getState } from 'utils/testUtils';
import { mergeProps, selector, UnconnectedReservationCreateFormContainer } from './ReservationCreateFormContainer';
import ReservationForm from './ReservationForm';

describe('shared/reservation-form/ReservationCreateFormContainer', () => {
  describe('selector', () => {
    const props = { initialResource: { id: 'r-1', name: { fi: 'Resource name' } } };
    const time = {
      begin: { date: '2016-01-01', time: '10:00' },
      end: { date: '2016-01-01', time: '11:00' },
    };

    function getSelected(extraState, extraProps) {
      const state = getState(extraState);
      return selector(state, { ...props, ...extraProps });
    }

    it('returns numberOfParticipants', () => {
      const extraState = {
        'form.resourceReservation.values': {
          numberOfParticipants: 15,
          time,
        },
      };
      expect(getSelected(extraState).numberOfParticipants).to.equal(15);
    });

    describe('initialValues', () => {
      it('hostName is emptry string if user is not logged in', () => {
        expect(getSelected().initialValues.hostName).to.equal('');
      });

      it('hostName is display name of logged in user', () => {
        const extraState = { 'auth.user': { firstName: 'Luke', lastName: 'Skywalker' } };
        expect(getSelected(extraState).initialValues.hostName).to.equal('Luke Skywalker');
      });

      it('reserverName is emptry string if user is not logged in', () => {
        expect(getSelected().initialValues.reserverName).to.equal('');
      });

      it('reserverName is display name of logged in user', () => {
        const extraState = { 'auth.user': { firstName: 'Luke', lastName: 'Skywalker' } };
        expect(getSelected(extraState).initialValues.reserverName).to.equal('Luke Skywalker');
      });

      it('resource equals initial resource id from props', () => {
        expect(getSelected().initialValues.resource).to.equal('r-1');
      });

      describe('time', () => {
        it('is correct when begin has only day info', () => {
          const begin = '2017-01-01';
          const selected = getSelected({}, { begin });
          expect(selected.initialValues.time).to.deep.equal({
            begin: { date: begin, time: null },
            end: { date: begin, time: null },
          });
        });

        it('is correct when begin and end values are passed', () => {
          const begin = '2017-01-02T10:30:00';
          const end = '2017-01-02T13:30:00';
          const selected = getSelected({}, { begin, end });
          expect(selected.initialValues.time).to.deep.equal({
            begin: { date: '2017-01-02', time: '10:30' },
            end: { date: '2017-01-02', time: '13:30' },
          });
        });

        it('calculates end when only begin is passed', () => {
          const begin = '2017-01-02T10:30:00';
          const selected = getSelected({}, { begin });
          expect(selected.initialValues.time).to.deep.equal({
            begin: { date: '2017-01-02', time: '10:30' },
            end: { date: '2017-01-02', time: '11:00' },
          });
        });
      });
    });

    describe('timelineDate', () => {
      it('returns time if exists', () => {
        const extraState = {
          'form.resourceReservation.values': {
            time,
          },
        };
        expect(getSelected(extraState).timelineDate).to.equal('2016-01-01');
      });

      it('returns initial date if no form date', () => {
        const begin = '2017-01-01';
        const selected = getSelected({}, { begin });
        expect(selected.timelineDate).to.equal(begin);
      });
    });

    describe('timeRange', () => {
      it('returns time if exists', () => {
        const extraState = {
          'form.resourceReservation.values': {
            time,
          },
        };
        expect(getSelected(extraState).timeRange).to.deep.equal(time);
      });
    });

    describe('resource', () => {
      const resource1 = { id: 'r-1' };
      const resource2 = { id: 'r-2' };

      it('is returned by form value', () => {
        const extraState = {
          'data.resources': {
            'r-1': resource1,
            'r-2': resource2,
          },
          'form.resourceReservation.values': {
            resource: 'r-2',
            time,
          },
        };
        expect(getSelected(extraState).resource).to.deep.equal(resource2);
      });

      it('is returned by initial value if no form value', () => {
        const extraState = {
          'data.resources': {
            'r-1': resource1,
            'r-2': resource2,
          },
          'form.resourceReservation.values': {
            time,
          },
        };
        expect(getSelected(extraState).resource).to.deep.equal(resource1);
      });
    });

    describe('cateringProvider', () => {
      const unit = { id: 'unit123' };
      const resource = { id: 'r-1', unit: unit.id };
      const extraResource = { id: 'r-extra' };
      const cateringProvider = { id: 'cat123', units: [unit.id] };

      function getProviderSelected(extraState, extraProps) {
        return getSelected({
          'data.units': { [unit.id]: unit },
          'data.resources': { [resource.id]: resource, [extraResource.id]: extraResource },
          'data.cateringProviders': { [cateringProvider.id]: cateringProvider },
          ...extraState,
        }, extraProps);
      }

      it('is returned if exists for initial', () => {
        const actual = getProviderSelected().cateringProvider;
        expect(actual).to.deep.equal(cateringProvider);
      });

      it('is returned if does not exist for initial but does for current selection', () => {
        const extraState = {
          'form.resourceReservation.values': {
            resource: resource.id,
            time,
          },
        };
        const extraProps = { initialResource: extraResource.id };
        const actual = getProviderSelected(extraState, extraProps).cateringProvider;
        expect(actual).to.deep.equal(cateringProvider);
      });

      it('is not returned if exists for initial but not for current selection', () => {
        const extraState = {
          'form.resourceReservation.values': {
            resource: extraResource.id,
            time,
          },
        };
        const actual = getProviderSelected(extraState).cateringProvider;
        expect(actual).to.be.undefined;
      });

      it('is not returned if does not exist for unit', () => {
        const extraState = {
          'data.cateringProviders': {},
        };
        const actual = getProviderSelected(extraState).cateringProvider;
        expect(actual).to.be.undefined;
      });

      it('is not returned if no resource selected', () => {
        const extraProps = { initialResource: undefined };
        const actual = getProviderSelected({}, extraProps).cateringProvider;
        expect(actual).to.be.undefined;

    describe('baseReservation', () => {
      it('returns correct data when valid time range exists', () => {
        const extraState = {
          'form.resourceReservation.values': {
            time,
          },
        };
        const expected = {
          begin: '2016-01-01T10:00:00+02:00',
          end: '2016-01-01T11:00:00+02:00',
        };
        const actual = getSelected(extraState).baseReservation;
        expect(actual).to.deep.equal(expected);
      });

      it('returns null when no valid time range', () => {
        const extraState = {
          'form.resourceReservation.values': {
            time: {
              ...time,
              end: {},
            },
          },
        };
        const actual = getSelected(extraState).baseReservation;
        expect(actual).to.be.null;
      });
    });

    describe('isRecurring', () => {
      it('returns form value', () => {
        const extraState = {
          'form.resourceReservation.values': {
            isRecurring: true,
            time,
          },
        };
        expect(getSelected(extraState).isRecurring).to.be.true;
      });
    });

    describe('recurringReservations', () => {
      it('is returned from state', () => {
        const reservations = [{ id: 'r-1' }];
        const extraState = {
          recurringReservations: { reservations },
        };
        expect(getSelected(extraState).recurringReservations).to.deep.equal(
          reservations
        );
      });
    });
  });

  describe('mergeProps', () => {
    it('merges arguments and adds an onSubmit', () => {
      const actual = mergeProps(
        { a: 1 },
        { b: 2 },
        { c: 3 }
      );
      const { onSubmit, ...rest } = actual;
      expect(onSubmit).to.exist;
      expect(rest).to.deep.equal({ a: 1, b: 2, c: 3 });
    });

    describe('onSubmit', () => {
      function callOnSubmit(props, ...args) {
        const mergedProps = mergeProps({}, {}, props);
        mergedProps.onSubmit(...args);
      }

      const values = {
        time: {
          begin: { date: '2016-01-01', time: '10:00' },
          end: { date: '2016-01-01', time: '12:00' },
        },
        hostName: 'Han Solo',
        isRecurring: false,
        eventDescription: 'Description',
        eventSubject: 'Tapaaminen',
        numberOfParticipants: 8,
        reserverName: 'Luke Skywalker',
        resource: 'r-1',
      };

      const expectedReservationData = {
        begin: moment('2016-01-01T10:00:00').format(),
        end: moment('2016-01-01T12:00:00').format(),
        event_description: values.eventDescription,
        event_subject: values.eventSubject,
        host_name: values.hostName,
        number_of_participants: values.numberOfParticipants,
        reserver_name: values.reserverName,
        resource: values.resource,
      };

      it('calls props.makeReservation', () => {
        const makeReservation = simple.mock();
        const props = { makeReservation };
        callOnSubmit(props, values);
        expect(makeReservation.callCount).to.equal(1);
        const args = makeReservation.lastCall.args;
        expect(args).to.have.length(2);
        expect(args[0]).to.deep.equal(expectedReservationData);
      });

      it('calls props.makeReservation with recurring data in meta when recurring', () => {
        const makeReservation = simple.mock();
        const recurringReservations = [{ some: 'data' }];
        const props = { makeReservation, recurringReservations };
        callOnSubmit(
          props,
          { ...values, isRecurring: true },
        );
        expect(makeReservation.callCount).to.equal(1);
        const args = makeReservation.lastCall.args;
        expect(args).to.have.length(2);
        expect(args[0]).to.deep.equal(expectedReservationData);
        expect(args[1].successMeta.recurringReservations).to.deep.equal(
          recurringReservations
        );
        expect(args[1].successMeta.reservationData).to.deep.equal(
          expectedReservationData
        );
      });
    });
  });

  describe('rendering', () => {
    const defaults = {
      baseReservation: {},
      changeBaseTime: () => null,
      fetchResource: () => null,
      initialValues: {},
      isRecurring: false,
      makeReservation: () => null,
      numberOfParticipants: 10,
      recurringReservations: [],
      removeRecurringReservation: () => null,
      resource: {},
      showReservationSuccessModal: () => null,
      timelineDate: '2017-02-10',
      timeRange: {},
    };

    function getWrapper() {
      return shallow(<UnconnectedReservationCreateFormContainer {...defaults} />);
    }

    it('renders ReservationForm with correct props', () => {
      const wrapper = getWrapper();
      expect(wrapper.is(ReservationForm)).to.be.true;
      expect(wrapper.props()).to.deep.equal({
        ...defaults,
        allowRecurring: true,
      });
    });
  });
});
