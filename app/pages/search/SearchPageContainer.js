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
    this.props.fetchResources();
  }

  render() {
    const { isFetching, resources, searchFilters } = this.props;

    return (
      <div className="search-page">
        <h1>Hae tiloja</h1>
        <SearchControls initialValues={searchFilters} />
        <Loader loaded={!isFetching}>
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
  searchFilters: PropTypes.object.isRequired,
};

const actions = {
  fetchResources,
};

export default connect(selector, actions)(UnconnectedSearchPageContainer);
