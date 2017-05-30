import { expect } from 'chai';
import moment from 'moment';

import { getState } from 'utils/testUtils';
import reservationSearchPageSelector from './reservationSearchPageSelector';

describe('pages/search/reservationSearchPageSelector', () => {
  const reservations = {
    'rsv-1': { id: 'rsv-1', begin: '2016-11-12' },
    'rsv-2': { id: 'rsv-2', begin: '2016-11-14' },
    'rsv-3': { id: 'rsv-3', begin: '2016-11-14' },
    'rsv-4': { id: 'rsv-4', begin: '2016-11-12' },
  };
  const units = {
    'u-1': { id: 'u-1', name: { fi: 'Unit 1' } },
    'u-2': { id: 'u-2', name: { fi: 'Unit 2' } },
  };
  const searchFilters = {
    end: '2016-12-12',
    eventSubject: '',
    hasCateringOrder: '',
    hostName: '',
    isFavoriteResource: '',
    isOwn: '',
    reserverName: '',
    resourceName: '',
    start: '2016-11-12',
    unit: '',
  };
  const searchResults = ['rsv-1', 'rsv-2', 'rsv-3'];

  function getSelected() {
    const state = getState({
      'data.reservations': reservations,
      'data.units': units,
      'reservationSearchPage.searchFilters': searchFilters,
      'reservationSearchPage.searchResults': searchResults,
    });
    return reservationSearchPageSelector(state);
  }

  it('returns isFetching', () => {
    expect(getSelected().isFetching).to.exist;
  });

  it('returns reservationGroups corresponding to search results', () => {
    const expected = [
      { day: moment('2016-11-12'), reservations: ['rsv-1'] },
      { day: moment('2016-11-14'), reservations: ['rsv-2', 'rsv-3'] },
    ];
    expect(getSelected().reservationGroups).to.deep.equal(expected);
  });

  it('returns resultsCount from the state', () => {
    expect(getSelected().resultsCount).to.deep.equal(searchResults.length);
  });

  it('returns searchFilters from the state', () => {
    expect(getSelected().searchFilters).to.deep.equal(searchFilters);
  });

  it('returns units from the state', () => {
    expect(getSelected().units).to.deep.equal(units);
  });
});
