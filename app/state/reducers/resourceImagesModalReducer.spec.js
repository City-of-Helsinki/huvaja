import { expect } from 'chai';

import reducer from './resourceImagesModalReducer';

describe('state/reducers/resourceImagesModalReducer', () => {
  const initialState = {
    resourceId: null,
    show: false,
  };

  it('returns correct initial state', () => {
    const actual = reducer(undefined, { type: 'NOOP' });
    expect(actual).to.deep.equal(initialState);
  });

  describe('SHOW_RESOURCE_IMAGES_MODAL', () => {
    it('sets show to true', () => {
      const actual = reducer({ show: false }, {
        type: 'SHOW_RESOURCE_IMAGES_MODAL',
        payload: 23,
      });
      expect(actual.show).to.be.true;
    });
    it('sets payload as resourceId', () => {
      const actual = reducer({ resourceId: null }, {
        type: 'SHOW_RESOURCE_IMAGES_MODAL',
        payload: 23,
      });
      expect(actual.resourceId).to.equal(23);
    });
  });

  describe('HIDE_RESOURCE_IMAGES_MODAL', () => {
    it('resets state', () => {
      const actual = reducer({ show: true, resourceId: 23 }, {
        type: 'HIDE_RESOURCE_IMAGES_MODAL',
      });
      expect(actual).to.deep.equal(initialState);
    });
  });
});
