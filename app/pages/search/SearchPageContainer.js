import isEqual from 'lodash/isEqual';
import React, { Component, PropTypes } from 'react';
import Loader from 'react-loader';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { fetchResources } from 'api/actions';
import SearchControls from './search-controls';
import selector from './searchPageSelector';

function renderResource(resource) {
  return (
    <li key={resource.id}>
      <Link to={`/resources/${resource.id}`}>
        {resource.name.fi}
      </Link>
    </li>
  );
}

export class UnconnectedSearchPageContainer extends Component {
  componentDidMount() {
    this.props.fetchResources(this.props.searchFilters);
  }

  componentWillUpdate(nextProps) {
    if (!isEqual(this.props.searchFilters, nextProps.searchFilters)) {
      this.props.fetchResources(nextProps.searchFilters);
    }
  }

  render() {
    const { isFetching, resultsCount, resources, searchFilters } = this.props;

    const searchResultsText = resultsCount === 1 ?
      `Löytyi ${resultsCount} hakuehdot täyttävä tila.` :
      `Löytyi ${resultsCount} hakuehdot täyttävää tilaa.`;
    return (
      <div className="search-page">
        <h1>Hae tiloja</h1>
        <SearchControls initialValues={searchFilters} />
        <Loader loaded={!isFetching}>
          <div className="search-results-count">
            <span>{searchResultsText} </span>
            <Link to="/">Tyhjennä haku.</Link>
          </div>
          <ul>
            {resources.map(renderResource)}
          </ul>
        </Loader>
      </div>
    );
  }
}

const resourceShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.shape({
    fi: PropTypes.string.isRequired,
  }).isRequired,
});

UnconnectedSearchPageContainer.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  fetchResources: PropTypes.func.isRequired,
  resources: PropTypes.arrayOf(resourceShape).isRequired,
  resultsCount: PropTypes.number.isRequired,
  searchFilters: PropTypes.object.isRequired,
};

const actions = {
  fetchResources,
};

export default connect(selector, actions)(UnconnectedSearchPageContainer);
