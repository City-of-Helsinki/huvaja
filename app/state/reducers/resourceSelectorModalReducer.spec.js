import { expect } from 'chai';

import reducer from './resourceSelectorModalReducer';

describe('state/reducers/resourceSelectorModalReducer', () => {
  const initialState = {
    show: false,
  };

  it('returns correct initial state', () => {
    const actual = reducer(undefined, { type: 'NOOP' });
    expect(actual).to.deep.equal(initialState);
  });

  describe('SHOW_RESOURCE_SELECTOR_MODAL', () => {
    it('sets show to true', () => {
      const actual = reducer({ show: false }, {
        type: 'SHOW_RESOURCE_SELECTOR_MODAL',
      });
      expect(actual.show).to.be.true;
    });
  });

  describe('HIDE_RESOURCE_SELECTOR_MODAL', () => {
    it('sets show to false', () => {
      const actual = reducer({ show: true }, {
        type: 'HIDE_RESOURCE_SELECTOR_MODAL',
      });
      expect(actual).to.deep.equal(initialState);
    });
  });
});
