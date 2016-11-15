import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

export class UnconnectedResourcePage extends Component {
  componentDidMount() {
    console.log('fetch resource', this.props.params.id);  // eslint-disable-line
  }

  render() {
    const resourceId = this.props.params.id;
    return (
      <h1>Resource {resourceId}</h1>
    );
  }
}

UnconnectedResourcePage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
};

export default connect(null)(UnconnectedResourcePage);
