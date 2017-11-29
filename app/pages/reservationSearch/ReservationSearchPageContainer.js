import { decamelizeKeys } from 'humps';
import debounce from 'lodash/debounce';
import isEqual from 'lodash/isEqual';
import omitBy from 'lodash/omitBy';
import queryString from 'query-string';
import React, { Component, PropTypes } from 'react';
import Loader from 'react-loader';
import { connect } from 'react-redux';
import { browserHistory, Link } from 'react-router';

import uiActions from 'actions/uiActions';
import { fetchReservations } from 'api/actions';
import ReservationsReportButton from 'shared/reservations-report-button';
import DayReservations from './day-reservations';
import selector from './reservationSearchPageSelector';
import ReservationSearchControls from './reservation-search-controls';

const PATH = '/reservations';

function getUrl(filters) {
  const cleaned = omitBy(filters, value => value === '');
  const decamelized = decamelizeKeys(cleaned);
  const urlParams = queryString.stringify(decamelized);
  return `${PATH}?${urlParams}`;
}

export class UnconnectedReservationSearchPageContainer extends Component {
  static propTypes = {
    changeFilters: PropTypes.func.isRequired,
    fetchReservations: PropTypes.func.isRequired,
    isFetching: PropTypes.bool.isRequired,
    reservationGroups: PropTypes.array.isRequired,
    resultsCount: PropTypes.number.isRequired,
    searchFilters: PropTypes.object.isRequired,
    units: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.throttledFetchAndChangeUrl = debounce(
      this.fetchAndChangeUrl,
      500,
      { leading: false }
    );
  }

  componentDidMount() {
    this.fetch(this.props.searchFilters);
  }

  componentWillUpdate(nextProps) {
    if (!isEqual(this.props.searchFilters, nextProps.searchFilters)) {
      if (this.shouldThrottle(nextProps)) {
        this.throttledFetchAndChangeUrl(nextProps.searchFilters);
      } else {
        this.fetchAndChangeUrl(nextProps.searchFilters);
      }
    }
  }

  fetch(filters) {
    const decamelized = decamelizeKeys(filters);
    this.props.fetchReservations(decamelized);
  }

  fetchAndChangeUrl(filters) {
    this.fetch(filters);
    browserHistory.replace(getUrl(filters));
  }

  shouldThrottle(nextProps) {
    const throttleFilters = [
      'eventSubject',
      'hostName',
      'reserverName',
      'resourceName',
    ];
    for (const filter of throttleFilters) {
      const changed = !isEqual(
        this.props.searchFilters[filter],
        nextProps.searchFilters[filter]
      );
      if (changed) return true;
    }
    return false;
  }

  render() {
    const {
      changeFilters,
      isFetching,
      reservationGroups,
      resultsCount,
      searchFilters,
      units,
    } = this.props;
    const searchResultsText = resultsCount === 1 ?
      `Löytyi ${resultsCount} hakuehdot täyttävä varaus.` :
      `Löytyi ${resultsCount} hakuehdot täyttävää varausta.`;
    return (
      <div className="reservation-search-page">
        <h1>Varaukset</h1>
        <ReservationSearchControls
          values={searchFilters}
          onChange={changeFilters}
          units={units}
        />
        <ReservationsReportButton
          searchFilters={searchFilters}
        />
        <div className="search-results-container">
          <Loader loaded={!isFetching}>
            <div className="search-results-count">
              <span>{searchResultsText} </span>
              <Link to={PATH}>Tyhjennä haku.</Link>
            </div>
            {reservationGroups.map(group =>
              <DayReservations key={group.day} {...group} />
            )}
          </Loader>
        </div>
      </div>
    );
  }
}

const actions = {
  changeFilters: uiActions.changeReservationSearchFilters,
  fetchReservations,
};

export default connect(selector, actions)(UnconnectedReservationSearchPageContainer);
