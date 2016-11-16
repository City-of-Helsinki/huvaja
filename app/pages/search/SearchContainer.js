import React, { Component, PropTypes } from 'react';
import Loader from 'react-loader';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { fetchResources } from 'api/actions';
import selector from './searchSelector';

function renderResource(resource) {
  return (
    <li key={resource.id}>
      <Link to={`/resources/${resource.id}`}>
        {resource.name.fi}
      </Link>
    </li>
  );
}

export class UnconnectedSearchContainer extends Component {
  componentDidMount() {
    this.props.fetchResources();
  }

  render() {
    const { message, resources } = this.props;
    const isLoaded = Boolean(resources.length);

    return (
      <div className="search">
        <Loader loaded={isLoaded}>
          <h1>Project {message}</h1>
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

UnconnectedSearchContainer.propTypes = {
  fetchResources: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
  resources: PropTypes.arrayOf(resourceShape).isRequired,
};

const actions = {
  fetchResources,
};

export default connect(selector, actions)(UnconnectedSearchContainer);
