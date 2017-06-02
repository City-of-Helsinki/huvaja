import { expect } from 'chai';
import simple from 'simple-mock';

import createRecurringReservationsMiddleware, { create } from './createRecurringReservations';

describe('state/middleware/createRecurringReservations', () => {
  let dispatch;
  let createRecurringReservations;
  const action = {
    type: 'RESERVATION_POST_SUCCESS',
    meta: {
      recurringReservations: [
        { begin: '2017-01-01T10:00', end: '2017-01-01T11:00' },
        { begin: '2017-01-02T10:00', end: '2017-01-02T11:00' },
      ],
      reservationData: {
        reserverName: 'Jack',
      },
    },
  };

  beforeEach(() => {
    simple.mock(window, 'setTimeout');
    dispatch = simple.mock();
    createRecurringReservations = createRecurringReservationsMiddleware()(dispatch);
  });

  afterEach(() => {
    simple.restore();
  });

  describe('when RESERVATION_POST_SUCCESS action', () => {
    it('calls setTimeout when recurringReservations in meta', () => {
      createRecurringReservations(action);
      expect(window.setTimeout.callCount).to.equal(1);
      const args = window.setTimeout.lastCall.args;
      expect(args).to.have.length(2);
      expect(args[0]).to.be.a('function');
      expect(args[1]).to.equal(0);
    });

    it('does not call setTimeout when recurringReservations not in meta', () => {
      const withoutMeta = {
        type: 'RESERVATION_POST_SUCCESS',
        meta: {},
      };
      createRecurringReservations(withoutMeta);
      expect(window.setTimeout.callCount).to.equal(0);
    });

    describe('"create" function', () => {
      let store;
      let makeReservation;

      beforeEach(() => {
        store = { dispatch: simple.mock() };
        makeReservation = simple.mock().returnWith('mockAction');
        create(action, store, makeReservation);
      });

      afterEach(() => {
        simple.restore();
      });

      it('dispatches makeReservation actions for each instance in meta', () => {
        expect(store.dispatch.callCount).to.equal(2);
        expect(store.dispatch.calls[0].arg).to.equal('mockAction');
        expect(store.dispatch.calls[1].arg).to.equal('mockAction');
      });

      it('calls makeReservation action creators with correct data', () => {
        expect(makeReservation.callCount).to.equal(2);

        const firstReservationData = {
          reserverName: 'Jack',
          begin: '2017-01-01T10:00',
          end: '2017-01-01T11:00',
        };
        expect(makeReservation.calls[0].args[0]).to.deep.equal(
          firstReservationData
        );
        expect(makeReservation.calls[0].args[1]).to.deep.equal({
          errorMeta: {
            reservation: firstReservationData,
          },
        });

        const secondReservationData = {
          reserverName: 'Jack',
          begin: '2017-01-02T10:00',
          end: '2017-01-02T11:00',
        };
        expect(makeReservation.calls[1].args[0]).to.deep.equal(
          secondReservationData
        );
        expect(makeReservation.calls[1].args[1]).to.deep.equal({
          errorMeta: {
            reservation: secondReservationData,
          },
        });
      });
    });
  });

  describe('when other action ', () => {
    it('dispatches action', () => {
      const someAction = { type: 'SOME_ACTION' };
      createRecurringReservations(someAction);
      expect(dispatch.callCount).to.equal(1);
      expect(dispatch.lastCall.args).to.deep.equal([someAction]);
    });

    it('does not call setTimeout', () => {
      const someAction = { type: 'SOME_ACTION' };
      createRecurringReservations(someAction);
      expect(window.setTimeout.callCount).to.equal(0);
    });
  });
});
