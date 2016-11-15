import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import selector from './homeSelector';

export class UnconnectedHomeContainer extends Component {  // eslint-disable-line
  render() {
    return (
      <div className="home">
        <h1>Project {this.props.message}</h1>
        <Link to="/resources/999">Go to resource page</Link>
      </div>
    );
  }
}

UnconnectedHomeContainer.propTypes = {
  message: PropTypes.string.isRequired,
};

export default connect(selector)(UnconnectedHomeContainer);
