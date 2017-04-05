import { decamelizeKeys } from 'humps';
import flatten from 'lodash/flatten';
import isEqual from 'lodash/isEqual';
import queryString from 'query-string';
import React, { Component, PropTypes } from 'react';
import Loader from 'react-loader';
import { connect } from 'react-redux';
import { browserHistory, Link } from 'react-router';

import { fetchResources } from 'api/actions';
import ResourceDailyReportButton from 'shared/resource-daily-report-button';
import AvailabilityView from 'shared/availability-view';
import SearchControls from './search-controls';
import selector from './searchPageSelector';

export class UnconnectedSearchPageContainer extends Component {
  constructor(props) {
    super(props);
    this.handleDateChange = this.handleDateChange.bind(this);
  }

  componentDidMount() {
    this.props.fetchResources(this.props.searchFilters);
  }

  componentWillUpdate(nextProps) {
    if (!isEqual(this.props.searchFilters, nextProps.searchFilters)) {
      this.props.fetchResources(nextProps.searchFilters);
    }
  }

  handleDateChange(date) {
    const filters = decamelizeKeys({ ...this.props.searchFilters, date });
    browserHistory.push(`/?${queryString.stringify(filters)}`);
  }

  render() {
    const {
      availabilityGroups,
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
          initialValues={searchFilters}
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
  isFetching: PropTypes.bool.isRequired,
  fetchResources: PropTypes.func.isRequired,
  resultsCount: PropTypes.number.isRequired,
  searchFilters: PropTypes.object.isRequired,
  types: PropTypes.object.isRequired,
  units: PropTypes.object.isRequired,
};

const actions = {
  fetchResources,
};

export default connect(selector, actions)(UnconnectedSearchPageContainer);
