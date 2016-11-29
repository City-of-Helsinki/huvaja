import React, { Component, PropTypes } from 'react';
import Grid from 'react-bootstrap/lib/Grid';
import DocumentTitle from 'react-document-title';
import { connect } from 'react-redux';

import { fetchUnits } from 'api/actions';
import { fetchAuthState } from 'auth/actions';
import Navbar from 'shared/navbar';

export class UnconnectedAppContainer extends Component {
  componentDidMount() {
    this.props.fetchAuthState();
    this.props.fetchUnits();
  }

  render() {
    return (
      <div className="app">
        <Navbar />
        <DocumentTitle title="Huonevarausjärjestelmä" />
        <Grid>
          {this.props.children}
        </Grid>
      </div>
    );
  }
}

UnconnectedAppContainer.propTypes = {
  children: PropTypes.element,
  fetchAuthState: PropTypes.func.isRequired,
  fetchUnits: PropTypes.func.isRequired,
};

const actions = { fetchAuthState, fetchUnits };

export default connect(null, actions)(UnconnectedAppContainer);
