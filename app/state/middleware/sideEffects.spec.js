import { expect } from 'chai';
import simple from 'simple-mock';

import sideEffectsMiddleware from './sideEffects';

describe('state/middleware/sideEffects', () => {
  let dispatch;
  const invalid = { type: 'MOCK_ACTION' };
  let sideEffects;
  let valid;

  beforeEach(() => {
    simple.mock(window, 'setTimeout');
    valid = {
      type: 'MOCK_ACTION',
      meta: { sideEffect: simple.mock() },
    };
    dispatch = simple.mock();
    sideEffects = sideEffectsMiddleware()(dispatch);
  });

  afterEach(() => {
    simple.restore();
  });

  it('dispatches action', () => {
    sideEffects(valid);
    expect(dispatch.callCount).to.equal(1);
    expect(dispatch.lastCall.args).to.deep.equal([valid]);
  });

  it('dispatches invalid action', () => {
    sideEffects(invalid);
    expect(dispatch.callCount).to.equal(1);
    expect(dispatch.lastCall.args).to.deep.equal([invalid]);
  });

  it('calls setTimeout', () => {
    sideEffects(valid);
    expect(window.setTimeout.callCount).to.equal(1);
    const args = window.setTimeout.lastCall.args;
    expect(args).to.have.length(2);
    expect(typeof args[0]).to.equal('function');
    expect(args[1]).to.equal(0);
  });

  it('does not call setTimeout for invalid action', () => {
    sideEffects(invalid);
    expect(window.setTimeout.called).to.be.false;
  });

  it('does not call meta.sideEffect', () => {
    sideEffects(valid);
    expect(valid.meta.sideEffect.called).to.be.false;
  });

  describe('setTimeout callback', () => {
    let callback;

    beforeEach(() => {
      sideEffects(valid);
      callback = window.setTimeout.lastCall.args[0];
    });

    it('calls meta.sideEffect', () => {
      callback();
      expect(valid.meta.sideEffect.callCount).to.equal(1);
      expect(valid.meta.sideEffect.lastCall.args).to.deep.equal([valid]);
    });
  });
});
