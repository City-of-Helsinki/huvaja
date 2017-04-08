import React, { Component, PropTypes } from 'react';
import Grid from 'react-bootstrap/lib/Grid';
import DocumentTitle from 'react-document-title';
import Loader from 'react-loader';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { fetchEquipment, fetchTypes, fetchUnits } from 'api/actions';
import { fetchAuthState } from 'auth/actions';
import ReservationCancelModal from 'shared/modals/reservation-cancel';
import ReservationInfoModal from 'shared/modals/reservation-info';
import ResourceImagesModal from 'shared/modals/resource-images';
import Navbar from 'shared/navbar';
import locationUtils from 'utils/locationUtils';

export class UnconnectedAppContainer extends Component {
  componentDidMount() {
    this.props.fetchAuthState();
    this.props.fetchUnits();
    this.props.fetchTypes();
    this.props.fetchEquipment();
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
        <ReservationCancelModal />
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
  fetchEquipment: PropTypes.func.isRequired,
  fetchTypes: PropTypes.func.isRequired,
  fetchUnits: PropTypes.func.isRequired,
};

const actions = { fetchAuthState, fetchEquipment, fetchTypes, fetchUnits };

export const selector = createStructuredSelector({
  isAuthFetched: state => state.auth.isFetched,
  isLoggedIn: state => Boolean(state.auth.token),
});

export default connect(selector, actions)(UnconnectedAppContainer);
