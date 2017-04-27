import { expect } from 'chai';
import moment from 'moment';
import simple from 'simple-mock';

import { getState } from 'utils/testUtils';
import { mergeProps, selector } from './ReservationFormContainer';

describe('shared/reservation-form/ReservationFormContainer', () => {
  describe('selector', () => {
    const props = { resource: { name: { fi: 'Resource name' } } };
    function getSelected(extraState, extraProps) {
      const state = getState(extraState);
      return selector(state, { ...props, ...extraProps });
    }

    describe('hasTime', () => {
      it('return true if reservationForm time is specified', () => {
        const extraState = {
          'form.resourceReservation.values': {
            time: { begin: { date: '2016-01-01', time: '10:00' } },
          },
        };
        expect(getSelected(extraState).hasTime).to.be.true;
      });

      it('return false if reservationForm time is specified without time', () => {
        const extraState = {
          'form.resourceReservation.values': {
            time: { begin: { date: '2016-01-01', time: '' } },
          },
        };
        expect(getSelected(extraState).hasTime).to.be.false;
      });

      it('return false if reservationForm time is not specified', () => {
        expect(getSelected().hasTime).to.be.false;
      });
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

      it('resource equals resource name from props', () => {
        const expected = props.resource.name.fi;
        expect(getSelected().initialValues.resource).to.equal(expected);
      });

      describe('time', () => {
        describe('when no queryBegin', () => {
          it('uses date from props', () => {
            const date = '2017-01-01';
            const selected = getSelected({}, { date, queryBegin: null });
            expect(selected.initialValues.time).to.deep.equal({
              begin: { date, time: null },
              end: { date, time: null },
            });
          });
        });

        describe('when queryBegin has date and time', () => {
          it('uses date from props', () => {
            const queryBegin = '2017-01-02T10:30:00';
            const selected = getSelected({}, { date: '2017-01-01', queryBegin });
            expect(selected.initialValues.time).to.deep.equal({
              begin: { date: '2017-01-02', time: '10:30' },
              end: { date: '2017-01-02', time: '11:00' },
            });
          });
        });
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

      it('calls props.makeReservation', () => {
        const values = {
          time: {
            begin: { date: '2016-01-01', time: '10:00' },
            end: { date: '2016-01-01', time: '12:00' },
          },
          hostName: 'Han Solo',
          eventDescription: 'Description',
          eventName: 'Tapaaminen',
          numberOfParticipants: 8,
          reserverName: 'Luke Skywalker',
        };
        const makeReservation = simple.mock();
        const props = {
          makeReservation,
          resource: { id: 'r1' },
        };
        callOnSubmit(props, values);
        expect(makeReservation.callCount).to.equal(1);
        const args = makeReservation.lastCall.args;
        expect(args).to.have.length(2);
        expect(args[0]).to.deep.equal({
          begin: moment('2016-01-01T10:00:00').format(),
          end: moment('2016-01-01T12:00:00').format(),
          event_description: values.eventDescription,
          event_subject: values.eventName,
          host_name: values.hostName,
          number_of_participants: values.numberOfParticipants,
          reserver_name: values.reserverName,
          resource: props.resource.id,
        });
      });
    });
  });
});
