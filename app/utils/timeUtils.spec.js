import { expect } from 'chai';
import moment from 'moment';

import timeUtils from 'utils/timeUtils';

describe('utils/timeUtils', () => {
  describe('parseDateTime', () => {
    it('returns correct moment object when value is valid ISO date', () => {
      const value = '2016-02-13 18:30';
      const actual = timeUtils.parseDateTime(value);
      expect(moment.isMoment(actual)).to.be.true;
      expect(moment(value).isSame(actual)).to.be.true;
    });

    it('returns null when value is not valid ISO date', () => {
      const value = '2016-02-13 18:3-';
      const actual = timeUtils.parseDateTime(value);
      expect(actual).to.be.null;
    });
  });

  describe('getDateTimeRangeFieldMoments', () => {
    const defaultValue = {
      begin: {
        date: '2017-02-02',
        time: '10:00',
      },
      end: {
        date: '2017-02-02',
        time: '12:00',
      },
    };

    it('returns moments for begin and end', () => {
      const actual = timeUtils.getDateTimeRangeFieldMoments(defaultValue);
      const expected = {
        begin: moment('2017-02-02 10:00'),
        end: moment('2017-02-02 12:00'),
      };
      expect(expected.begin.isSame(actual.begin)).to.be.true;
      expect(expected.end.isSame(actual.end)).to.be.true;
    });

    it('returns null for begin when not valid date time', () => {
      const value = {
        ...defaultValue,
        begin: {
          date: '2017-02-02',
          time: '10:0-',
        },
      };
      const actual = timeUtils.getDateTimeRangeFieldMoments(value);
      expect(actual.begin).to.be.null;
      expect(actual.end).to.not.be.null;
    });

    it('returns null for end when not valid date time', () => {
      const value = {
        ...defaultValue,
        end: {
          date: '2017-02-02',
          time: '',
        },
      };
      const actual = timeUtils.getDateTimeRangeFieldMoments(value);
      expect(actual.end).to.be.null;
      expect(actual.begin).to.not.be.null;
    });
  });
});
