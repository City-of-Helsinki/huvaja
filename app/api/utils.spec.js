import { expect } from 'chai';
import simple from 'simple-mock';

import actionTypes from './actionTypes';
import { createAPIPromise, getApiActionName, isApiAction } from './utils';

describe('api/utils', () => {
  describe('getApiActionName', () => {
    it('returns the given actionType without the last part specifying call state', () => {
      const actionType = 'SOME_GET_REQUEST';
      expect(getApiActionName(actionType)).to.equal('SOME_GET');
    });

    it('works with actionTypes with multiple "words"', () => {
      const actionType = 'SOME_SLIGHTLY_LONGER_GET_REQUEST';
      expect(getApiActionName(actionType)).to.equal('SOME_SLIGHTLY_LONGER_GET');
    });
  });

  describe('isApiAction', () => {
    it('returns true if given actionType is included in api actionTypes', () => {
      const actionType = Object.keys(actionTypes)[0];
      expect(isApiAction(actionType)).to.be.true;
    });

    it('returns false if given actionType is not included in api actionTypes', () => {
      const actionType = 'SOME_OTHER_ACTION';
      expect(isApiAction(actionType)).to.be.false;
    });
  });

  describe('createAPIPromise', () => {
    it('returns a handler function', () => {
      const actual = createAPIPromise(null);
      expect(actual).to.be.a('function');
    });

    describe('handler', () => {
      function callHandler(callback, apiAction) {
        const handler = createAPIPromise(callback || (() => null));
        return handler(apiAction);
      }

      it('returns a promise', () => {
        const actual = callHandler();
        expect(actual).to.be.a('promise');
      });

      it('calls callback with args', () => {
        const callback = simple.mock();
        callHandler(callback, 'arg');
        expect(callback.callCount).to.equal(1);
        const args = callback.lastCall.args;
        expect(args).to.have.length(2);
        expect(args[0].errorMeta.sideEffect).to.exist;
        expect(args[0].successMeta.sideEffect).to.exist;
        expect(args[1]).to.equal('arg');
      });

      describe('resolving promise', () => {
        it('can be done by calling successMeta.sideEffect', (done) => {
          const callback = simple.mock();
          const promise = callHandler(callback);
          promise.then(() => done());
          callback.lastCall.args[0].successMeta.sideEffect();
        });
      });

      describe('rejecting promise', () => {
        it('can be done by calling errorMeta.sideEffect', (done) => {
          const callback = simple.mock();
          const promise = callHandler(callback);
          promise.catch(() => done());
          callback.lastCall.args[0].errorMeta.sideEffect();
        });

        it('modifies the data correctly in general case', (done) => {
          const callback = simple.mock();
          const promise = callHandler(callback);
          promise.catch((error) => {
            expect(error.errors).to.deep.equal({
              _error: 'Jokin meni pieleen.',
            });
            done();
          });
          callback.lastCall.args[0].errorMeta.sideEffect({
            payload: {
              response: {
                non_field_errors: ['non-field error.'],
                some_field: ['error 1.', 'error 2.'],
              },
            },
          });
        });

        it('modifies the data correctly on CATERING_ORDER_POST_ERROR', (done) => {
          const callback = simple.mock();
          const promise = callHandler(callback);
          promise.catch((error) => {
            expect(error.errors).to.deep.equal({
              _error: 'Tarjoilutilauksen tekeminen epäonnistui.',
            });
            done();
          });
          callback.lastCall.args[0].errorMeta.sideEffect({
            payload: {
              response: {
                non_field_errors: ['non-field error.'],
                some_field: ['error 1.', 'error 2.'],
              },
            },
            type: 'CATERING_ORDER_POST_ERROR',
          });
        });
      });
    });
  });
});
