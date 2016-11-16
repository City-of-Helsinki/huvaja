import { expect } from 'chai';
import { createAction } from 'redux-actions';
import immutable from 'seamless-immutable';

import actionTypes from '../actionTypes';
import dataReducer, { handleData } from './dataReducer';

describe('api/reducers/dataReducer', () => {
  describe('initial state', () => {
    const initialState = dataReducer(undefined, {});

    it('resources is an empty object', () => {
      expect(initialState.resources).to.deep.equal({});
    });

    it('units is an empty object', () => {
      expect(initialState.units).to.deep.equal({});
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
  });
});
