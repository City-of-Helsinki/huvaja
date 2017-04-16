import React, { Component } from 'react';
import { connect } from 'react-redux';

export class UnconnectedReservationSearchPageContainer extends Component {
  componentWillUpdate(nextProps) {
    console.log(nextProps);
  }

  render() {
    return (
      <div className="reservation-search-page">
        <h1>Varaukset</h1>
      </div>
    );
  }
}

UnconnectedReservationSearchPageContainer.propTypes = {};

export default connect(null)(UnconnectedReservationSearchPageContainer);
