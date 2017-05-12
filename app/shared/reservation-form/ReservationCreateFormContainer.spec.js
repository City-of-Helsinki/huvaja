import { expect } from 'chai';
import moment from 'moment';
import simple from 'simple-mock';

import { getState } from 'utils/testUtils';
import { mergeProps, selector } from './ReservationCreateFormContainer';

describe('shared/reservation-form/ReservationCreateFormContainer', () => {
  describe('selector', () => {
    const props = { resource: { name: { fi: 'Resource name' } } };
    function getSelected(extraState, extraProps) {
      const state = getState(extraState);
      return selector(state, { ...props, ...extraProps });
    }

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
        it('is correct when date has only day info', () => {
          const date = '2017-01-01';
          const selected = getSelected({}, { date });
          expect(selected.initialValues.time).to.deep.equal({
            begin: { date, time: null },
            end: { date, time: null },
          });
        });

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

        it('ignores date if begin is passed', () => {
          const begin = '2017-01-02T10:30:00';
          const date = '2017-01-15T10:30:00';
          const selected = getSelected({}, { begin, date });
          expect(selected.initialValues.time).to.deep.equal({
            begin: { date: '2017-01-02', time: '10:30' },
            end: { date: '2017-01-02', time: '11:00' },
          });
        });
      });
    });

    describe('timelineDate', () => {
      it('returns form date if exists', () => {
        const extraState = {
          'form.resourceReservation.values': {
            time: { begin: { date: '2016-01-01', time: '10:00' } },
          },
        };
        expect(getSelected(extraState).timelineDate).to.equal('2016-01-01');
      });

      it('returns initial date if no form date', () => {
        const date = '2017-01-01';
        const selected = getSelected({}, { date });
        expect(selected.timelineDate).to.equal(date);
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
