import { expect } from 'chai';

import createRequestIsActiveSelector from './createRequestIsActiveSelector';

function getState(activeRequests) {
  return { activeRequests };
}

describe('api/selectors/createRequestIsActiveSelector', () => {
  it('returns a function', () => {
    expect(typeof createRequestIsActiveSelector()).to.equal('function');
  });

  describe('the returned function', () => {
    const requestActionType = 'SOME_GET_REQUEST';

    it('returns true if given request is in activeRequests with count > 0', () => {
      const selector = createRequestIsActiveSelector(requestActionType);
      const state = getState({ SOME_GET: 1 });
      expect(selector(state)).to.equal(true);
    });

    it('returns false if given request is in activeRequests with count 0', () => {
      const selector = createRequestIsActiveSelector(requestActionType);
      const state = getState({ SOME_GET: 0 });
      expect(selector(state)).to.equal(false);
    });

    it('returns false if given request is not in activeRequests', () => {
      const selector = createRequestIsActiveSelector(requestActionType);
      const state = getState({});
      expect(selector(state)).to.equal(false);
    });
  });
});
