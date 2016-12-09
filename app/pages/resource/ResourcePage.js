import React, { PropTypes } from 'react';

import ResourceInfo from './info';
import ReservationForm from './reservation-form/';

ResourcePage.propTypes = {
  currentUser: PropTypes.object,
  date: PropTypes.string.isRequired,
  onDateChange: PropTypes.func.isRequired,
  resource: PropTypes.object.isRequired,
  unit: PropTypes.object.isRequired,
};
export default function ResourcePage(props) {
  return (
    <div className="resource-page">
      <ResourceInfo
        isLoggedIn={Boolean(props.currentUser)}
        resource={props.resource}
        unit={props.unit}
      />
      <h3>Varaustilanne</h3>
      <p className="help-text">Klikkaa vapaata aikaa varauksen aloittamiseksi</p>
      <ReservationForm
        date={props.date}
        resource={props.resource}
        onDateChange={props.onDateChange}
      />
    </div>
  );
}
