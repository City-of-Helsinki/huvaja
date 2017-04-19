import queryString from 'query-string';
import React, { Component, PropTypes } from 'react';
import Loader from 'react-loader';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import uiActions from 'actions/uiActions';
import { fetchResource } from 'api/actions';
import ResourcePage from './ResourcePage';
import selector from './resourcePageSelector';

export class UnconnectedResourcePageContainer extends Component {
  static propTypes = {
    date: PropTypes.string.isRequired,
    fetchResource: PropTypes.func.isRequired,
    hideResourceImages: PropTypes.func.isRequired,
    isLoaded: PropTypes.bool.isRequired,
    location: PropTypes.shape({
      query: PropTypes.object.isRequired,
    }).isRequired,
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
    resource: PropTypes.object,
    resourceSearchUrl: PropTypes.string.isRequired,
    showResourceImages: PropTypes.func.isRequired,
    unit: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.handleDateChange = this.handleDateChange.bind(this);
  }

  componentDidMount() {
    this.fetchResource();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.date !== this.props.date) {
      this.fetchResource();
    }
  }

  fetchResource() {
    this.props.fetchResource(this.props.params.id, { date: this.props.date });
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
        hideResourceImages={this.props.hideResourceImages}
        onDateChange={this.handleDateChange}
        queryBegin={this.props.location.query.begin}
        resource={this.props.resource}
        resourceSearchUrl={this.props.resourceSearchUrl}
        showResourceImages={this.props.showResourceImages}
        unit={this.props.unit}
      />
    );
  }
}

const actions = {
  fetchResource,
  hideResourceImages: uiActions.hideResourceImagesModal,
  showResourceImages: uiActions.showResourceImagesModal,
};

export default connect(selector, actions)(UnconnectedResourcePageContainer);
