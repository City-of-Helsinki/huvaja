import React, { Component, PropTypes } from 'react';
import Grid from 'react-bootstrap/lib/Grid';
import DocumentTitle from 'react-document-title';
import Loader from 'react-loader';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { fetchUnits } from 'api/actions';
import { fetchAuthState } from 'auth/actions';
import ReservationInfoModal from 'shared/modals/reservation-info';
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
          <Loader loaded={this.props.isAuthFetched}>
            {this.props.children}
          </Loader>
        </Grid>
        <ReservationInfoModal />
      </div>
    );
  }
}

UnconnectedAppContainer.propTypes = {
  children: PropTypes.element,
  fetchAuthState: PropTypes.func.isRequired,
  isAuthFetched: PropTypes.bool.isRequired,
  fetchUnits: PropTypes.func.isRequired,
};

const actions = { fetchAuthState, fetchUnits };

export const selector = createSelector(
  state => state.auth.isFetched,
  isAuthFetched => ({ isAuthFetched })
);

export default connect(selector, actions)(UnconnectedAppContainer);
