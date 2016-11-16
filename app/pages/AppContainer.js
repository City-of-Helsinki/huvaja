import React, { Component, PropTypes } from 'react';
import DocumentTitle from 'react-document-title';
import { connect } from 'react-redux';

import { fetchUnits } from 'api/actions';

export class UnconnectedAppContainer extends Component {
  componentDidMount() {
    this.props.fetchUnits();
  }

  render() {
    return (
      <div className="app">
        <DocumentTitle title="Huonevarausjärjestelmä" />
        {this.props.children}
      </div>
    );
  }
}

UnconnectedAppContainer.propTypes = {
  children: PropTypes.element,
  fetchUnits: PropTypes.func.isRequired,
};

const actions = { fetchUnits };

export default connect(null, actions)(UnconnectedAppContainer);
