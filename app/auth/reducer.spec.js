import { expect } from 'chai';
import { createAction } from 'redux-actions';

import actionTypes from './actionTypes';
import authReducer from './reducer';

describe('auth/reducer', () => {
  describe('initial state', () => {
    function getInitialState() {
      return authReducer(undefined, { type: 'NOOP' });
    }

    it('token is null', () => {
      expect(getInitialState().token).to.equal(null);
    });

    it('userId is null', () => {
      expect(getInitialState().userId).to.equal(null);
    });
  });

  describe('handling actions', () => {
    describe('AUTH_GET_SUCCESS', () => {
      const authGetSuccess = createAction(actionTypes.AUTH_GET_SUCCESS);

      it('sets state to payload.auth', () => {
        const payload = { auth: { token: 'some-token', userId: 'u-123' } };
        const action = authGetSuccess(payload);
        const initialState = { token: null, userId: null };
        const nextState = authReducer(initialState, action);
        expect(nextState).to.deep.equal(payload.auth);
      });
    });
  });
});
