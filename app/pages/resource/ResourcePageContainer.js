import queryString from 'query-string';
import React, { Component, PropTypes } from 'react';
import Loader from 'react-loader';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import { fetchResource } from 'api/actions';
import ResourcePage from './ResourcePage';
import selector from './resourcePageSelector';

export class UnconnectedResourcePageContainer extends Component {
  static propTypes = {
    date: PropTypes.string.isRequired,
    fetchResource: PropTypes.func.isRequired,
    isLoaded: PropTypes.bool.isRequired,
    location: PropTypes.shape({
      query: PropTypes.object.isRequired,
    }).isRequired,
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
    resource: PropTypes.object,
    unit: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.handleDateChange = this.handleDateChange.bind(this);
  }

  componentDidMount() {
    this.props.fetchResource(this.props.params.id);
  }

  handleDateChange(date) {
    const query = queryString.stringify({
      ...this.props.location.query,
      begin: date,
    });
    browserHistory.replace(`/resources/${this.props.params.id}?${query}`);
  }

  render() {
    if (!this.props.isLoaded) return <Loader loaded={false} />;
    return (
      <ResourcePage
        date={this.props.date}
        onDateChange={this.handleDateChange}
        resource={this.props.resource}
        unit={this.props.unit}
      />
    );
  }
}

const actions = {
  fetchResource,
};

export default connect(selector, actions)(UnconnectedResourcePageContainer);
