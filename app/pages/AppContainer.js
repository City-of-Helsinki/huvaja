import React, { Component, PropTypes } from 'react';
import Grid from 'react-bootstrap/lib/Grid';
import DocumentTitle from 'react-document-title';
import Loader from 'react-loader';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { fetchUnits } from 'api/actions';
import { fetchAuthState } from 'auth/actions';
import ReservationInfoModal from 'shared/modals/reservation-info';
import ResourceImagesModal from 'shared/modals/resource-images';
import Navbar from 'shared/navbar';
import locationUtils from 'utils/locationUtils';

export class UnconnectedAppContainer extends Component {
  componentDidMount() {
    this.props.fetchAuthState();
    this.props.fetchUnits();
  }

  componentWillReceiveProps(props) {
    if (props.isAuthFetched && !props.isLoggedIn) {
      locationUtils.redirect('/login');
    }
  }

  render() {
    return (
      <div className="app">
        <DocumentTitle title="Huonevarausjärjestelmä" />
        <Loader loaded={this.props.isAuthFetched && this.props.isLoggedIn}>
          <Navbar />
          <Grid>
            {this.props.children}
          </Grid>
        </Loader>
        <ReservationInfoModal />
        <ResourceImagesModal />
      </div>
    );
  }
}

UnconnectedAppContainer.propTypes = {
  children: PropTypes.element,
  fetchAuthState: PropTypes.func.isRequired,
  isAuthFetched: PropTypes.bool.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  fetchUnits: PropTypes.func.isRequired,
};

const actions = { fetchAuthState, fetchUnits };

export const selector = createStructuredSelector({
  isAuthFetched: state => state.auth.isFetched,
  isLoggedIn: state => Boolean(state.auth.token),
});

export default connect(selector, actions)(UnconnectedAppContainer);
