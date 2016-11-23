import keyBy from 'lodash/keyBy';
import { expect } from 'chai';
import { createAction } from 'redux-actions';

import actionTypes from 'api/actionTypes';
import searchResultsReducer from './searchResultsReducer';

describe('state/reducers/searchResultsReducer', () => {
  describe('initial state', () => {
    const initialState = searchResultsReducer(undefined, {});

    it('is an empty array', () => {
      expect(initialState).to.deep.equal([]);
    });
  });

  describe('handling actions', () => {
    describe('RESOURCES_GET_SUCCESS', () => {
      const getResourcesSuccess = createAction(
        actionTypes.RESOURCES_GET_SUCCESS,
        resources => ({
          entities: {
            resources: keyBy(resources, 'id'),
          },
        })
      );
      const resources = [
        { id: 'r-1', foo: 'bar' },
        { id: 'r-2', foo: 'bar' },
      ];

      it('sets the given resource ids to state', () => {
        const action = getResourcesSuccess(resources);
        const currentState = [];
        const expected = [resources[0].id, resources[1].id];
        const nextState = searchResultsReducer(currentState, action);

        expect(nextState).to.deep.equal(expected);
      });

      it('replaces the old ids in state', () => {
        const action = getResourcesSuccess(resources);
        const currentState = ['r-99'];
        const expected = [resources[0].id, resources[1].id];
        const nextState = searchResultsReducer(currentState, action);

        expect(nextState).to.deep.equal(expected);
      });
    });
  });
});
