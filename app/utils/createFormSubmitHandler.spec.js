import { expect } from 'chai';
import simple from 'simple-mock';

import createFormSubmitHandler from './createFormSubmitHandler';

describe('utils/createFormSubmitHandler', () => {
  it('returns a handler function', () => {
    const actual = createFormSubmitHandler(null);
    expect(actual).to.be.a('function');
  });

  describe('handler', () => {
    function callHandler(callback, ...args) {
      const handler = createFormSubmitHandler(callback || (() => null));
      return handler(...args);
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

      it('modifies the data correctly', (done) => {
        const callback = simple.mock();
        const promise = callHandler(callback);
        promise.catch((error) => {
          expect(error.errors).to.deep.equal({
            _error: 'non-field error.',
            someField: 'error 1. error 2.',
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
    });
  });
});
