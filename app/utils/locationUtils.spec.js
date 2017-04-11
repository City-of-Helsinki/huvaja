import { expect } from 'chai';

import locationUtils from 'utils/locationUtils';

describe('utils/locationUtils', () => {
  describe('getResourceSearchUrl', () => {
    it('returns correct url', () => {
      const filters = {
        date: '2016-01-01',
        equipment: '123',
        is_favorite: 'true',
      };
      const actual = locationUtils.getResourceSearchUrl(filters);
      const expected = '/?date=2016-01-01&equipment=123&is_favorite=true';
      expect(actual).to.equal(expected);
    });
  });
});
