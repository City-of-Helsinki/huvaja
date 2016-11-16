import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { fetchResources } from 'api/actions';
import selector from './searchSelector';

export class UnconnectedSearchContainer extends Component {
  componentDidMount() {
    this.props.fetchResources();
  }

  render() {
    return (
      <div className="search">
        <h1>Project {this.props.message}</h1>
        <Link to="/resources/999">Go to resource page</Link>
      </div>
    );
  }
}

UnconnectedSearchContainer.propTypes = {
  fetchResources: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
};

const actions = {
  fetchResources,
};

export default connect(selector, actions)(UnconnectedSearchContainer);
