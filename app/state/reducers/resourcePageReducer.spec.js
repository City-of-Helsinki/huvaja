import { expect } from 'chai';
import moment from 'moment';

import reducer from './resourcePageReducer';

describe('state/reducers/resourcePageReducer', () => {
  it('returns correct initial state', () => {
    const expected = {
      begin: moment().format('YYYY-MM-DD'),
    };
    const actual = reducer(undefined, { type: 'NOOP' });
    expect(actual).to.deep.equal(expected);
  });

  describe('ENTER_OR_CHANGE_RESOURCE_PAGE', () => {
    it('saves query data', () => {
      const query = {
        begin: '2016-01-01T10:00:00+02:00',
      };
      const actual = reducer(undefined, {
        type: 'ENTER_OR_CHANGE_RESOURCE_PAGE',
        payload: { query },
      });
      expect(actual).to.deep.equal(query);
    });

    it('replaces existing data', () => {
      const query = { begin: '2016-01-01' };
      const initial = { begin: '2016-02-02' };
      const actual = reducer(initial, {
        type: 'ENTER_OR_CHANGE_RESOURCE_PAGE',
        payload: { query },
      });
      expect(actual).to.deep.equal({ begin: query.begin });
    });
  });
});
