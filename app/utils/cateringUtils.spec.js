import { expect } from 'chai';

import cateringUtils from 'utils/cateringUtils';

describe('utils/cateringUtils', () => {
  describe('formatServingTime', () => {
    it('returns time in correct format', () => {
      const actual = cateringUtils.formatServingTime('09:30:00');
      expect(actual).to.equal('9:30');
    });
  });

  describe('getServingTimeText', () => {
    it('returns formatted serving time when serving time exists', () => {
      const actual = cateringUtils.getServingTimeText('09:30:00');
      expect(actual).to.equal('9:30');
    });

    it('returns text when serving time is null', () => {
      const actual = cateringUtils.getServingTimeText(null);
      expect(actual).to.equal('Varauksen alkamisaika');
    });
  });
});
