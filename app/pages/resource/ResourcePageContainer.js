import React, { Component, PropTypes } from 'react';
import Loader from 'react-loader';
import { connect } from 'react-redux';

import { fetchResource } from 'api/actions';
import ResourcePage from './ResourcePage';
import selector from './resourcePageSelector';

export class UnconnectedResourcePageContainer extends Component {
  static propTypes = {
    fetchResource: PropTypes.func.isRequired,
    isLoaded: PropTypes.bool.isRequired,
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
    resource: PropTypes.object,
    unit: PropTypes.object,
  };

  componentDidMount() {
    this.props.fetchResource(this.props.params.id);
  }

  render() {
    if (!this.props.isLoaded) return <Loader loaded={false} />;
    return (
      <ResourcePage
        resource={this.props.resource}
        unit={this.props.unit}
      />
    );
  }
}

const actions = { fetchResource };

export default connect(selector, actions)(UnconnectedResourcePageContainer);
