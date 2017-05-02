import { decamelizeKeys } from 'humps';
import flatten from 'lodash/flatten';
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
import resourceSearchUtils from 'utils/resourceSearchUtils';
import SearchControls from './search-controls';
import selector from './searchPageSelector';

function didAvailableBetweenChange(updatedFilters) {
  if (!updatedFilters.availableStartDate) return false;
  const effective = resourceSearchUtils.getEffectiveFilters(updatedFilters);
  return effective.availableBetween && effective.availableBetween.length > 0;
}

export class UnconnectedSearchPageContainer extends Component {
  constructor(props) {
    super(props);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
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
    if (this.haveEffectiveFiltersChanged(nextProps)) {
      if (this.shouldThrottle(nextProps)) {
        this.throttledFetchAndChangeUrl(nextProps.searchFilters);
      } else {
        this.fetchAndChangeUrl(nextProps.searchFilters);
      }
    }
  }

  fetch(filters) {
    const effectiveFilters = resourceSearchUtils.getEffectiveFilters(filters);
    const decamelized = decamelizeKeys(effectiveFilters);
    this.props.fetchResources(decamelized);
  }

  fetchAndChangeUrl(filters) {
    this.fetch(filters);
    const url = resourceSearchUtils.getUrl(filters);
    browserHistory.replace(url);
  }

  handleDateChange(date) {
    const filters = { ...this.props.searchFilters, date };
    this.props.changeFilters(filters);
  }

  handleFilterChange(updatedFilters) {
    const filters = { ...updatedFilters };
    const shouldChangeDate = (
      didAvailableBetweenChange(updatedFilters) &&
      this.isDateOutsideAvailableRange(updatedFilters)
    );
    if (shouldChangeDate) {
      filters.date = updatedFilters.availableStartDate;
    }
    this.props.changeFilters(filters);
  }

  haveEffectiveFiltersChanged(nextProps) {
    const oldFilters = resourceSearchUtils.getEffectiveFilters(this.props.searchFilters);
    const newFilters = resourceSearchUtils.getEffectiveFilters(nextProps.searchFilters);
    return !isEqual(oldFilters, newFilters);
  }

  isDateOutsideAvailableRange({ availableStartDate, availableEndDate }) {
    const date = this.props.searchFilters.date;
    return date > availableEndDate || date < availableStartDate;
  }

  shouldThrottle(nextProps) {
    const throttleFilters = [
      'people',
      'search',
      'availableStartTime',
      'availableEndTime',
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
      availabilityGroups,
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
        <h1>Tilat</h1>
        <SearchControls
          equipment={equipment}
          values={searchFilters}
          onChange={this.handleFilterChange}
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
