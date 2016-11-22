import React, { Component, PropTypes } from 'react';
import Grid from 'react-bootstrap/lib/Grid';
import DocumentTitle from 'react-document-title';
import { connect } from 'react-redux';

import { fetchUnits } from 'api/actions';
import Navbar from 'shared/navbar';

export class UnconnectedAppContainer extends Component {
  componentDidMount() {
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
  fetchUnits: PropTypes.func.isRequired,
};

const actions = { fetchUnits };

export default connect(null, actions)(UnconnectedAppContainer);
