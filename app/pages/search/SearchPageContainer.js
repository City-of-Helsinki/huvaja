import { camelizeKeys, decamelizeKeys } from 'humps';
import flatten from 'lodash/flatten';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import debounce from 'lodash/debounce';
import React, { Component, PropTypes } from 'react';
import Loader from 'react-loader';
import { connect } from 'react-redux';
import { browserHistory, Link } from 'react-router';

import uiActions from 'actions/uiActions';
import { fetchResources } from 'api/actions';
import ResourceDailyReportButton from 'shared/resource-daily-report-button';
import AvailabilityView from 'shared/availability-view';
import locationUtils from 'utils/locationUtils';
import SearchControls from './search-controls';
import selector from './searchPageSelector';

export class UnconnectedSearchPageContainer extends Component {
  constructor(props) {
    super(props);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.throttledFetch = debounce(this.fetch, 500, { leading: false });
  }

  componentDidMount() {
    const urlFilters = { ...this.props.location.query };
    if (isEmpty(urlFilters)) {
      this.props.fetchResources(
        decamelizeKeys(this.props.searchFilters)
      );
    } else {
      this.props.changeFilters(
        camelizeKeys(urlFilters)
      );
    }
  }

  componentWillUpdate(nextProps) {
    if (!isEqual(this.props.searchFilters, nextProps.searchFilters)) {
      if (this.shouldThrottle(nextProps)) {
        this.throttledFetch(nextProps.searchFilters);
      } else {
        this.fetch(nextProps.searchFilters);
      }
    }
  }

  fetch(filters) {
    this.props.fetchResources(decamelizeKeys(filters));
    const url = locationUtils.getResourceSearchUrl(filters);
    browserHistory.replace(url);
  }

  handleDateChange(date) {
    const filters = { ...this.props.searchFilters, date };
    this.props.changeFilters(filters);
  }

  shouldThrottle(nextProps) {
    const throttleFilters = ['people', 'search'];
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
      availabilityGroups,
      changeFilters,
      equipment,
      isFetching,
      resultsCount,
      searchFilters,
      types,
      units,
    } = this.props;
    const searchResultsText = resultsCount === 1 ?
      `Löytyi ${resultsCount} hakuehdot täyttävä tila.` :
      `Löytyi ${resultsCount} hakuehdot täyttävää tilaa.`;
    const resourceIds = flatten(availabilityGroups.map(group => group.resources));
    return (
      <div className="search-page">
        <h1>Hae tiloja</h1>
        <SearchControls
          equipment={equipment}
          values={searchFilters}
          onChange={changeFilters}
          units={units}
          types={types}
        />
        <Loader loaded={!isFetching}>
          <div className="search-results-count">
            <span>{searchResultsText} </span>
            <Link to="/">Tyhjennä haku.</Link>
          </div>
          <AvailabilityView
            date={searchFilters.date}
            groups={availabilityGroups}
            onDateChange={this.handleDateChange}
          />
          {resourceIds.length !== 0 &&
            <ResourceDailyReportButton
              resourceIds={resourceIds}
              date={searchFilters.date}
            />
          }
        </Loader>
      </div>
    );
  }
}

const availabilityGroupShape = PropTypes.shape({
  name: PropTypes.string.isRequired,
  resources: PropTypes.array.isRequired,
});

UnconnectedSearchPageContainer.propTypes = {
  availabilityGroups: PropTypes.arrayOf(availabilityGroupShape).isRequired,
  changeFilters: PropTypes.func.isRequired,
  equipment: PropTypes.object.isRequired,
  isFetching: PropTypes.bool.isRequired,
  fetchResources: PropTypes.func.isRequired,
  location: PropTypes.shape({ query: PropTypes.object }).isRequired,
  resultsCount: PropTypes.number.isRequired,
  searchFilters: PropTypes.object.isRequired,
  types: PropTypes.object.isRequired,
  units: PropTypes.object.isRequired,
};

const actions = {
  changeFilters: uiActions.changeResourceSearchFilters,
  fetchResources,
};

export default connect(selector, actions)(UnconnectedSearchPageContainer);
