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
});
