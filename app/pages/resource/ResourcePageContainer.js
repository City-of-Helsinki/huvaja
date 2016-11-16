import isEmpty from 'lodash/isEmpty';
import React, { Component, PropTypes } from 'react';
import Loader from 'react-loader';
import { connect } from 'react-redux';

import { fetchResource } from 'api/actions';
import ResourceInfo from './info';
import selector from './resourcePageSelector';

export class UnconnectedResourcePageContainer extends Component {
  componentDidMount() {
    this.props.fetchResource(this.props.params.id);
  }

  render() {
    const { resource, unit } = this.props;
    const isLoaded = !isEmpty(resource) && !isEmpty(unit);
    return (
      <Loader loaded={isLoaded}>
        <ResourceInfo resource={resource} unit={unit} />
      </Loader>
    );
  }
}

UnconnectedResourcePageContainer.propTypes = {
  fetchResource: PropTypes.func.isRequired,
  params: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
  resource: PropTypes.object.isRequired,  // eslint-disable-line
  unit: PropTypes.object.isRequired,  // eslint-disable-line
};

const actions = { fetchResource };

export default connect(selector, actions)(UnconnectedResourcePageContainer);
