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

    it('user is null', () => {
      expect(getInitialState().user).to.equal(null);
    });

    it('isFetched is false', () => {
      expect(getInitialState().isFetched).to.equal(false);
    });
  });

  describe('handling actions', () => {
    describe('AUTH_GET_SUCCESS', () => {
      const authGetSuccess = createAction(actionTypes.AUTH_GET_SUCCESS);

      it('sets state to payload.auth', () => {
        const payload = {
          auth: {
            token: 'some-token',
            user: { id: 'u-1' },
          },
        };
        const action = authGetSuccess(payload);
        const initialState = { token: null, user: null };
        const nextState = authReducer(initialState, action);
        expect(nextState.token).to.equal(payload.auth.token);
        expect(nextState.user).to.equal(payload.auth.user);
      });

      it('sets isFetched to true', () => {
        const payload = {
          auth: {
            token: 'some-token',
            user: { id: 'u-1' },
          },
        };
        const action = authGetSuccess(payload);
        const initialState = { token: null, user: null, isFetched: false };
        const nextState = authReducer(initialState, action);
        expect(nextState.isFetched).to.equal(true);
      });
    });
  });
});
