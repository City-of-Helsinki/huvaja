import React, { PropTypes } from 'react';

import ReservationForm from 'shared/reservation-form/';

EditReservationPage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
};

export default function EditReservationPage(props) {
  return (
    <div className="edit-reservation-page">
      <h1>Varauksen muokkaus</h1>
      <ReservationForm.edit
        reservationId={props.params.id}
      />
    </div>
  );
}
