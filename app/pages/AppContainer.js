import React, { Component, PropTypes } from 'react';
import Grid from 'react-bootstrap/lib/Grid';
import DocumentTitle from 'react-document-title';
import Loader from 'react-loader';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import {
  fetchCateringProviders,
  fetchEquipment,
  fetchResources,
  fetchTypes,
  fetchUnits,
} from 'api/actions';
import { fetchAuthState } from 'auth/actions';
import ReservationCancelModal from 'shared/modals/reservation-cancel';
import ReservationInfoModal from 'shared/modals/reservation-info';
import ReservationsRateReportModal from 'shared/modals/reservation-rate-report';
import ReservationSuccessModal from 'shared/modals/reservation-success';
import ResourceImagesModal from 'shared/modals/resource-images';
import ResourceInfoModal from 'shared/modals/resource-info';
import Navbar from 'shared/navbar';
import locationUtils from 'utils/locationUtils';
import FeedbackButton from 'shared/feedback-button';

export class UnconnectedAppContainer extends Component {
  componentDidMount() {
    this.props.fetchAuthState();
    this.props.fetchCateringProviders();
    this.props.fetchEquipment();
    this.props.fetchTypes();
    this.props.fetchUnits();
  }

  componentWillReceiveProps(props) {
    if (props.isAuthFetched && !props.isLoggedIn) {
      locationUtils.redirect('/login');
    }

    // Wait for authentication before fetching resources, so that resources
    // will include correct user specific data. Otherwise for example
    // isFavorite could be wrongly false.
    if (!this.props.isLoggedIn && props.isLoggedIn) {
      this.props.fetchResources({}, false);
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
        <ReservationsRateReportModal />
        <ReservationCancelModal />
        <ResourceImagesModal />
        <ResourceInfoModal />
        <ReservationSuccessModal />
        <FeedbackButton />
      </div>
    );
  }
}

UnconnectedAppContainer.propTypes = {
  children: PropTypes.element,
  fetchAuthState: PropTypes.func.isRequired,
  isAuthFetched: PropTypes.bool.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  fetchCateringProviders: PropTypes.func.isRequired,
  fetchEquipment: PropTypes.func.isRequired,
  fetchResources: PropTypes.func.isRequired,
  fetchTypes: PropTypes.func.isRequired,
  fetchUnits: PropTypes.func.isRequired,
};

const actions = {
  fetchAuthState,
  fetchCateringProviders,
  fetchEquipment,
  fetchResources,
  fetchTypes,
  fetchUnits,
};

export const selector = createStructuredSelector({
  isAuthFetched: state => state.auth.isFetched,
  isLoggedIn: state => Boolean(state.auth.token),
});

export default connect(selector, actions)(UnconnectedAppContainer);
