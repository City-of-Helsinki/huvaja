import { expect } from 'chai';
import simple from 'simple-mock';

import { mergeProps } from './ReservationFormContainer';

describe('pages/resource/reservation-form/ReservationFormContainer', () => {
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
            begin: '2016-01-01T10:00:00',
            end: '2016-01-01T12:00:00',
          },
          eventName: 'Tapaaminen',
          numberOfParticipants: 8,
        };
        const makeReservation = simple.mock();
        const props = {
          makeReservation,
          resource: { id: 'r1' },
        };
        callOnSubmit(props, values);
        expect(makeReservation.callCount).to.equal(1);
        expect(makeReservation.lastCall.args).to.deep.equal([{
          begin: values.time.begin,
          end: values.time.end,
          resource: props.resource.id,
          event_subject: values.eventName,
          number_of_participants: values.numberOfParticipants,
        }]);
      });
    });
  });
});
