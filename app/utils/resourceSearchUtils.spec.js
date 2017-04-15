import { expect } from 'chai';
import moment from 'moment';

import resourceSearchUtils from 'utils/resourceSearchUtils';

describe('utils/resourceSearchUtils', () => {
  const defaultFilters = {
    availableStartDate: '2016-01-03',
    availableStartTime: '12:00',
    availableEndDate: '2016-01-04',
    availableEndTime: '13:30',
    date: '2016-01-01',
    equipment: '123',
    isFavorite: 'true',
  };

  describe('getEffectiveFilters', () => {
    it('returns correct filters', () => {
      const actual = resourceSearchUtils.getEffectiveFilters(defaultFilters);
      const availableStart = moment('2016-01-03 12:00').toISOString();
      const availableEnd = moment('2016-01-04 13:30').toISOString();
      const availableBetween = `${availableStart},${availableEnd}`;
      const expected = {
        availableBetween,
        date: '2016-01-01',
        equipment: '123',
        isFavorite: 'true',
      };
      expect(actual).to.deep.equal(expected);
    });

    it('returns availableBetween as empty string if no availableBetween attributes', () => {
      const actual = resourceSearchUtils.getEffectiveFilters({
        equipment: '123',
      });
      const expected = {
        availableBetween: '',
        equipment: '123',
      };
      expect(actual).to.deep.equal(expected);
    });

    it('returns availableBetween as empty string if not valid time range', () => {
      const actual = resourceSearchUtils.getEffectiveFilters({
        availableStartTime: '12:0-',
        equipment: '123',
      });
      const expected = {
        availableBetween: '',
        equipment: '123',
      };
      expect(actual).to.deep.equal(expected);
    });
  });

  describe('getUrl', () => {
    it('returns correct url', () => {
      const actual = resourceSearchUtils.getUrl(defaultFilters);
      const availableStart = moment('2016-01-03 12:00').toISOString();
      const availableEnd = moment('2016-01-04 13:30').toISOString();
      const availableBetween = encodeURIComponent(`${availableStart},${availableEnd}`);
      const expected = (
        `/?available_between=${availableBetween}&date=2016-01-01&equipment=123&is_favorite=true`
      );
      expect(actual).to.equal(expected);
    });

    it('works without availableBetween attributes', () => {
      const actual = resourceSearchUtils.getUrl({ equipment: '123' });
      const expected = '/?equipment=123';
      expect(actual).to.deep.equal(expected);
    });

    it('excludes empty strings', () => {
      const actual = resourceSearchUtils.getUrl({
        equipment: 123,
        emptyString: '',
      });
      const expected = '/?equipment=123';
      expect(actual).to.equal(expected);
    });
  });
});
