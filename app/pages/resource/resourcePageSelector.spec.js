import { expect } from 'chai';

import { getState } from 'utils/testUtils';
import selector from './resourcePageSelector';

describe('pages/resource/resourcePageSelector', () => {
  describe('resource', () => {
    it('returns resource', () => {
      const state = getState({ 'data.resources': { abcd: { spam: 'ham' } } });
      const actual = selector(state, { params: { id: 'abcd' } }).resource;
      expect(actual).to.equal(state.data.resources.abcd);
    });

    it('returns undefined if id not found', () => {
      const state = getState();
      const actual = selector(state, { params: { id: 'abcd' } }).resource;
      expect(actual).to.be.undefined;
    });
  });

  describe('unit', () => {
    it('returns unit from resource', () => {
      const state = getState({
        'data.resources': { abcd: { unit: 'efgh' } },
        'data.units': { efgh: { spam: 'ham' } },
      });
      const actual = selector(state, { params: { id: 'abcd' } }).unit;
      expect(actual).to.equal(state.data.units.efgh);
    });

    it('returns undefined if resource is not found', () => {
      const state = getState();
      const actual = selector(state, { params: { id: 'abcd' } }).unit;
      expect(actual).to.be.undefined;
    });
  });

  describe('isLoaded', () => {
    it('returns true if resource and unit are found', () => {
      const state = getState({
        'data.resources': { abcd: { unit: 'efgh' } },
        'data.units': { efgh: { spam: 'ham' } },
      });
      const actual = selector(state, { params: { id: 'abcd' } }).isLoaded;
      expect(actual).to.be.true;
    });

    it('returns false if resource and unit are not found', () => {
      const state = getState({
        'data.resources': { abcd: { unit: 'efgh' } },
        'data.units': { efgh: { spam: 'ham' } },
      });
      const actual = selector(state, { params: { id: 'invalid' } }).isLoaded;
      expect(actual).to.be.false;
    });
  });
});
