import { expect } from 'chai';
import { createAction } from 'redux-actions';

import activeRequestsReducer from './activeRequestsReducer';
import actionTypes from '../actionTypes';

describe('reducers/activeRequests', () => {
  describe('initial state', () => {
    const initialState = activeRequestsReducer(undefined, {});

    it('is an empty object', () => {
      expect(initialState).to.deep.equal({});
    });
  });

  describe('handling actions', () => {
    describe('REQUEST actions', () => {
      const action = createAction(actionTypes.RESOURCE_GET_REQUEST)();

      describe('if activeRequests already contains the action', () => {
        it('increases the count of the action by one', () => {
          const initialState = { RESOURCE_GET: 2 };
          const nextState = activeRequestsReducer(initialState, action);
          const expected = { RESOURCE_GET: 3 };

          expect(nextState).to.deep.equal(expected);
        });

        it('does not affect the existing activeRequests', () => {
          const initialState = { RESOURCE_GET: 2, OTHER_GET: 1 };
          const nextState = activeRequestsReducer(initialState, action);
          const expected = { RESOURCE_GET: 3, OTHER_GET: 1 };
          expect(nextState).to.deep.equal(expected);
        });
      });

      describe('if activeRequests does not already contain the action', () => {
        it('adds the action to activeRequests with count 1', () => {
          const initialState = {};
          const nextState = activeRequestsReducer(initialState, action);
          const expected = { RESOURCE_GET: 1 };

          expect(nextState).to.deep.equal(expected);
        });

        it('does not affect the existing activeRequests', () => {
          const initialState = { OTHER_GET: 1 };
          const nextState = activeRequestsReducer(initialState, action);
          const expected = { RESOURCE_GET: 1, OTHER_GET: 1 };

          expect(nextState).to.deep.equal(expected);
        });
      });
    });

    describe('SUCCESS actions', () => {
      const action = createAction(actionTypes.RESOURCE_GET_SUCCESS)();

      describe('if activeRequests already contains the action', () => {
        it('decreases the count of the action by one', () => {
          const initialState = { RESOURCE_GET: 2 };
          const nextState = activeRequestsReducer(initialState, action);
          const expected = { RESOURCE_GET: 1 };

          expect(nextState).to.deep.equal(expected);
        });

        it('does not affect the existing activeRequests', () => {
          const initialState = { RESOURCE_GET: 2, OTHER_GET: 1 };
          const nextState = activeRequestsReducer(initialState, action);
          const expected = { RESOURCE_GET: 1, OTHER_GET: 1 };

          expect(nextState).to.deep.equal(expected);
        });
      });

      describe('if activeRequests does not already contain the action', () => {
        it('adds the action to activeRequests with count 0', () => {
          const initialState = {};
          const nextState = activeRequestsReducer(initialState, action);
          const expected = { RESOURCE_GET: 0 };

          expect(nextState).to.deep.equal(expected);
        });

        it('does not affect the existing activeRequests', () => {
          const initialState = { OTHER_GET: 1 };
          const nextState = activeRequestsReducer(initialState, action);
          const expected = { RESOURCE_GET: 0, OTHER_GET: 1 };

          expect(nextState).to.deep.equal(expected);
        });
      });
    });

    describe('ERROR actions', () => {
      const action = createAction(actionTypes.RESOURCE_GET_ERROR)();

      describe('if activeRequests already contains the action', () => {
        it('decreases the count of the action by one', () => {
          const initialState = { RESOURCE_GET: 2 };
          const nextState = activeRequestsReducer(initialState, action);
          const expected = { RESOURCE_GET: 1 };

          expect(nextState).to.deep.equal(expected);
        });

        it('does not affect the existing activeRequests', () => {
          const initialState = { RESOURCE_GET: 2, OTHER_GET: 1 };
          const nextState = activeRequestsReducer(initialState, action);
          const expected = { RESOURCE_GET: 1, OTHER_GET: 1 };

          expect(nextState).to.deep.equal(expected);
        });
      });

      describe('if activeRequests does not already contain the action', () => {
        it('adds the action to activeRequests with count 0', () => {
          const initialState = {};
          const nextState = activeRequestsReducer(initialState, action);
          const expected = { RESOURCE_GET: 0 };

          expect(nextState).to.deep.equal(expected);
        });

        it('does not affect the existing activeRequests', () => {
          const initialState = { OTHER_GET: 1 };
          const nextState = activeRequestsReducer(initialState, action);
          const expected = { RESOURCE_GET: 0, OTHER_GET: 1 };

          expect(nextState).to.deep.equal(expected);
        });
      });
    });

    describe('non API actions', () => {
      const action = createAction('SOME_ACTION_TYPE')();

      it('does not affect the state', () => {
        const initialState = { RESOURCE_GET: 2, OTHER_GET: 1 };
        const nextState = activeRequestsReducer(initialState, action);

        expect(nextState).to.deep.equal(initialState);
      });
    });
  });
});
