import { expect } from 'chai';

import actionTypes from './actionTypes';
import { getApiActionName, isApiAction } from './utils';

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
});
