import { expect } from 'chai';

import utils from './utils';

describe('shared/reservation-form/utils', () => {
  describe('parseBeginDate', () => {
    it('returns correct date string', () => {
      const action = {
        payload: {
          begin: '2017-05-10T16:00:00+03:00',
        },
        type: 'RESERVATION_PUT_SUCCESS',
      };
      const actual = utils.parseBeginDate(action);
      expect(actual).to.equal('2017-05-10');
    });
  });

  describe('getResourceUrl', () => {
    it('returns correct url', () => {
      const actual = utils.getResourceUrl('r-1', '2017-05-10');
      const expected = '/resources/r-1?begin=2017-05-10';
      expect(actual).to.equal(expected);
    });
  });
});
