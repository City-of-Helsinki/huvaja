import { expect } from 'chai';
import { createAction } from 'redux-actions';
import immutable from 'seamless-immutable';

import actionTypes from '../actionTypes';
import dataReducer, { handleData } from './dataReducer';

describe('api/reducers/dataReducer', () => {
  describe('initial state', () => {
    function getInitialState() {
      return dataReducer(undefined, {});
    }

    it('reservations is an empty object', () => {
      expect(getInitialState().reservations).to.deep.equal({});
    });

    it('resources is an empty object', () => {
      expect(getInitialState().resources).to.deep.equal({});
    });

    it('units is an empty object', () => {
      expect(getInitialState().units).to.deep.equal({});
    });
  });

  describe('handling data', () => {
    const data = {
      resources: {
        'r-1': { value: 'some-value' },
      },
    };

    it('adds the given entities to state', () => {
      const initialState = immutable({
        resources: {},
      });
      const expectedState = {
        resources: {
          'r-1': { value: 'some-value' },
        },
      };
      const nextState = handleData(initialState, data);

      expect(nextState).to.deep.equal(expectedState);
    });

    it('does not remove other entities in the same data collection', () => {
      const initialState = immutable({
        resources: {
          'r-2': { value: 'other-value' },
        },
      });
      const expectedState = {
        resources: {
          'r-1': { value: 'some-value' },
          'r-2': { value: 'other-value' },
        },
      };
      const nextState = handleData(initialState, data);

      expect(nextState).to.deep.equal(expectedState);
    });

    it('overrides values with the same id in the same data collection', () => {
      const initialState = immutable({
        resources: {
          'r-1': { value: 'override this' },
        },
      });
      const expectedState = {
        resources: {
          'r-1': { value: 'some-value' },
        },
      };
      const nextState = handleData(initialState, data);

      expect(nextState).to.deep.equal(expectedState);
    });

    it('does not change the other data collections', () => {
      const initialState = immutable({
        resources: {},
        units: {
          'u-1': { value: 'unit-value' },
        },
      });
      const expectedState = {
        resources: {
          'r-1': { value: 'some-value' },
        },
        units: {
          'u-1': { value: 'unit-value' },
        },
      };
      const nextState = handleData(initialState, data);

      expect(nextState).to.deep.equal(expectedState);
      expect(nextState.units).to.equal(initialState.units);
    });
  });

  describe('handling actions', () => {
    describe('RESERVATION_DELETE_SUCCESS', () => {
      const deleteReservationSuccess = createAction(actionTypes.RESERVATION_DELETE_SUCCESS);

      it('changes reservation state to cancelled in reservations', () => {
        const reservation = { id: 1234, state: 'confirmed' };
        const initialState = immutable({
          reservations: { [reservation.id]: reservation },
          resources: {},
        });
        const action = deleteReservationSuccess(reservation);
        const nextState = dataReducer(initialState, action);

        const actual = nextState.reservations[reservation.id];
        const expected = { id: 1234, state: 'cancelled' };

        expect(actual).to.deep.equal(expected);
      });

      it('changes reservation state to cancelled in resource reservations', () => {
        const resource = { id: 'r-1' };
        const reservation = { id: 1234, resource: resource.id, state: 'confirmed' };
        resource.reservations = [reservation];

        const initialState = immutable({
          reservations: {},
          resources: { [resource.id]: resource },
        });
        const action = deleteReservationSuccess(reservation);
        const nextState = dataReducer(initialState, action);
        const actualReservations = nextState.resources[resource.id].reservations;

        expect(actualReservations[0].state).to.deep.equal('cancelled');
      });

      it('does not touch other resource values', () => {
        const resource = {
          id: 'r-1',
          otherValue: 'whatever',
        };
        const reservation = { id: 1234, resource: resource.id, state: 'confirmed' };
        const initialState = immutable({
          reservations: {},
          resources: { [resource.id]: resource },
        });
        const action = deleteReservationSuccess(reservation);
        const nextState = dataReducer(initialState, action);
        const expectedValue = resource.otherValue;
        const actualvalue = nextState.resources[resource.id].otherValue;

        expect(expectedValue).to.deep.equal(actualvalue);
      });
    });

    describe('RESERVATION_POST_SUCCESS', () => {
      const postReservationSuccess = createAction(actionTypes.RESERVATION_POST_SUCCESS);

      it('adds the reservation to reservations', () => {
        const reservation = { id: 1234 };
        const initialState = immutable({
          reservations: {},
          resources: {},
        });
        const action = postReservationSuccess(reservation);
        const nextState = dataReducer(initialState, action);

        const actualReservations = nextState.reservations;
        const expectedReservations = { [reservation.id]: reservation };

        expect(actualReservations).to.deep.equal(expectedReservations);
      });

      it('adds the given reservation to correct resource', () => {
        const resource = { id: 'r-1', reservations: [] };
        const reservation = { id: 1234, resource: resource.id };
        const initialState = immutable({
          reservations: {},
          resources: { [resource.id]: resource },
        });
        const action = postReservationSuccess(reservation);
        const nextState = dataReducer(initialState, action);
        const actualReservations = nextState.resources[resource.id].reservations;
        const expectedReservations = [reservation];

        expect(actualReservations).to.deep.equal(expectedReservations);
      });

      it('does not touch other resource values', () => {
        const resource = { id: 'r-1', reservations: [], otherValue: 'whatever' };
        const reservation = { id: 1234, resource: resource.id };
        const initialState = immutable({
          reservations: {},
          resources: { [resource.id]: resource },
        });
        const action = postReservationSuccess(reservation);
        const nextState = dataReducer(initialState, action);
        const expectedValue = resource.otherValue;
        const actualvalue = nextState.resources[resource.id].otherValue;

        expect(expectedValue).to.deep.equal(actualvalue);
      });
    });

    describe('RESERVATION_PUT_SUCCESS', () => {
      const putReservationSuccess = createAction(actionTypes.RESERVATION_PUT_SUCCESS);

      describe('updating reservations', () => {
        it('adds the reservation to reservations if it is not already there', () => {
          const reservation = { id: 1234 };
          const initialState = immutable({
            reservations: {},
            resources: {},
          });
          const action = putReservationSuccess(reservation);
          const nextState = dataReducer(initialState, action);

          const actualReservations = nextState.reservations;
          const expectedReservations = immutable({
            [reservation.id]: reservation,
          });

          expect(actualReservations).to.deep.equal(expectedReservations);
        });

        it('updates a reservation already in reservations', () => {
          const oldReservation = {
            id: 1234,
            begin: 'old-begin',
            end: 'old-end',
          };
          const initialState = immutable({
            reservations: { [oldReservation.id]: oldReservation },
            resources: {},
          });
          const updatedReservation = {
            id: 1234,
            begin: 'new-begin',
            end: 'new-end',
          };
          const action = putReservationSuccess(updatedReservation);
          const nextState = dataReducer(initialState, action);

          const actualReservations = nextState.reservations;
          const expectedReservations = immutable({
            [updatedReservation.id]: updatedReservation,
          });

          expect(actualReservations).to.deep.equal(expectedReservations);
        });
      });

      describe('updating resource reservations', () => {
        it('adds the given reservation to correct resource', () => {
          const resource = { id: 'r-1', reservations: [] };
          const reservation = { resource: resource.id };
          const initialState = immutable({
            reservations: {},
            resources: { [resource.id]: resource },
          });
          const action = putReservationSuccess(reservation);
          const nextState = dataReducer(initialState, action);
          const actualReservations = nextState.resources[resource.id].reservations;
          const expectedReservations = immutable([reservation]);

          expect(actualReservations).to.deep.equal(expectedReservations);
        });

        it('updates a reservation already in resource reservations', () => {
          const resource = { id: 'r-1', reservations: [] };
          const oldReservation = {
            id: 1234,
            begin: 'old-begin',
            end: 'old-end',
            resource: resource.id,
          };
          resource.reservations = [oldReservation];

          const initialState = immutable({
            reservations: {},
            resources: { [resource.id]: resource },
          });
          const updatedReservation = {
            id: 1234,
            begin: 'new-begin',
            end: 'new-end',
            resource: resource.id,
          };
          const action = putReservationSuccess(updatedReservation);
          const nextState = dataReducer(initialState, action);

          const actualReservations = nextState.resources[resource.id].reservations;
          const expectedReservations = immutable([updatedReservation]);

          expect(actualReservations).to.deep.equal(expectedReservations);
        });

        it('does not touch other resource values', () => {
          const resource = {
            id: 'r-1',
            otherValue: 'whatever',
            reservations: [],
          };
          const reservation = {
            id: 1234,
            resource: resource.id,
          };
          const initialState = immutable({
            reservations: {},
            resources: { [resource.id]: resource },
          });
          const action = putReservationSuccess(reservation);
          const nextState = dataReducer(initialState, action);
          const expectedValue = resource.otherValue;
          const actualvalue = nextState.resources[resource.id].otherValue;

          expect(expectedValue).to.deep.equal(actualvalue);
        });
      });
    });

    describe('RESOURCES_GET_SUCCESS', () => {
      const resourcesGetSuccess = createAction(
        actionTypes.RESOURCES_GET_SUCCESS,
        resource => ({ entities: { resources: { [resource.id]: resource } } })
      );

      it('adds resources to state', () => {
        const resource = { id: 'r-1' };
        const initialState = immutable({
          resources: {},
        });
        const action = resourcesGetSuccess(resource);
        const nextState = dataReducer(initialState, action);

        const expected = {
          [resource.id]: resource,
        };

        expect(nextState.resources).to.deep.equal(expected);
      });

      it('removes resource.reservations if it is null', () => {
        const resource = { id: 'resource-1', reservations: null };
        const initialState = immutable({
          resources: {},
        });
        const action = resourcesGetSuccess(resource);
        const nextState = dataReducer(initialState, action);

        const expected = {
          [resource.id]: { id: 'resource-1' },
        };

        expect(nextState.resources).to.deep.equal(expected);
      });

      it('does not replace old reservations value with null', () => {
        const originalResource = {
          id: 'r-1',
          reservations: [{ foo: 'bar' }],
          state: 'requested',
        };
        const updatedResource = {
          id: originalResource.id,
          reservations: null,
          state: 'confirmed',
        };
        const initialState = immutable({
          resources: { [originalResource.id]: originalResource },
        });
        const action = resourcesGetSuccess(updatedResource);
        const nextState = dataReducer(initialState, action);
        const actualResource = nextState.resources[originalResource.id];

        expect(actualResource.reservations).to.deep.equal(originalResource.reservations);
        expect(actualResource.state).to.equal(updatedResource.state);
      });
    });

    describe('RESOURCE_FAVORITE_POST_SUCCESS', () => {
      const resource = {
        id: '123',
        isFavorite: false,
      };

      const unfavoriteResource = createAction(
        actionTypes.RESOURCE_FAVORITE_POST_SUCCESS,
        payload => payload,
        () => ({ id: resource.id })
      );

      it('changes isFavorite attribute from resource', () => {
        const initialState = immutable({
          resources: {
            [resource.id]: resource,
          },
        });
        const action = unfavoriteResource(resource.id);
        const nextState = dataReducer(initialState, action);

        expect(nextState.resources[resource.id].isFavorite).to.be.true;
      });
    });

    describe('RESOURCE_UNFAVORITE_POST_SUCCESS', () => {
      const resource = {
        id: '123',
        isFavorite: true,
      };

      const unfavoriteResource = createAction(
        actionTypes.RESOURCE_UNFAVORITE_POST_SUCCESS,
        payload => payload,
        () => ({ id: resource.id })
      );

      it('changes isFavorite attribute from resource', () => {
        const initialState = immutable({
          resources: {
            [resource.id]: resource,
          },
        });
        const action = unfavoriteResource(resource.id);
        const nextState = dataReducer(initialState, action);

        expect(nextState.resources[resource.id].isFavorite).to.be.false;
      });
    });

    describe('CATERING_ORDER_POST_SUCCESS', () => {
      const postOrderSuccess = createAction(actionTypes.CATERING_ORDER_POST_SUCCESS);

      it('adds catering order to catering orders', () => {
        const cateringOrder = { id: 1234 };
        const initialState = immutable({
          cateringOrders: {},
        });
        const action = postOrderSuccess(cateringOrder);
        const nextState = dataReducer(initialState, action);

        const actualOrders = nextState.cateringOrders;
        const expectedOrders = { [cateringOrder.id]: cateringOrder };

        expect(actualOrders).to.deep.equal(expectedOrders);
      });
    });

    describe('CATERING_ORDER_PUT_SUCCESS', () => {
      const putOrderSuccess = createAction(actionTypes.CATERING_ORDER_PUT_SUCCESS);

      it('adds catering order to catering orders', () => {
        const cateringOrder = { id: 1234 };
        const initialState = immutable({
          cateringOrders: {},
        });
        const action = putOrderSuccess(cateringOrder);
        const nextState = dataReducer(initialState, action);

        const actualOrders = nextState.cateringOrders;
        const expectedOrders = { [cateringOrder.id]: cateringOrder };

        expect(actualOrders).to.deep.equal(expectedOrders);
      });
    });

    describe('CATERING_ORDER_DELETE_SUCCESS', () => {
      it('adds catering order to catering orders', () => {
        const initialState = immutable({
          cateringOrders: {
            1234: {},
            4321: {},
          },
        });
        const action = {
          meta: { id: 1234 },
          type: actionTypes.CATERING_ORDER_DELETE_SUCCESS,
        };
        const nextState = dataReducer(initialState, action);

        const actualOrders = nextState.cateringOrders;
        const expectedOrders = {
          4321: {},
        };

        expect(actualOrders).to.deep.equal(expectedOrders);
      });
    });
  });
});
