import React, { PropTypes } from 'react';

import ReservationForm from 'shared/reservation-form/';
import ResourceDailyReportButton from 'shared/resource-daily-report-button';
import ResourceInfo from './info';

ResourcePage.propTypes = {
  date: PropTypes.string.isRequired,
  hideResourceImages: PropTypes.func.isRequired,
  onDateChange: PropTypes.func.isRequired,
  queryBegin: PropTypes.string,
  resource: PropTypes.object.isRequired,
  resourceSearchUrl: PropTypes.string.isRequired,
  showResourceImages: PropTypes.func.isRequired,
  unit: PropTypes.object.isRequired,
};
export default function ResourcePage(props) {
  return (
    <div className="resource-page">
      <ResourceInfo
        hideResourceImages={props.hideResourceImages}
        resource={props.resource}
        resourceSearchUrl={props.resourceSearchUrl}
        showResourceImages={props.showResourceImages}
        unit={props.unit}
      />
      <h3>Varaustilanne</h3>
      <p className="help-text">Klikkaa vapaata aikaa varauksen aloittamiseksi</p>
      <ReservationForm.create
        date={props.date}
        onDateChange={props.onDateChange}
        queryBegin={props.queryBegin}
        resource={props.resource}
      />
      <ResourceDailyReportButton
        resourceIds={[props.resource.id]}
        date={props.date}
      />
    </div>
  );
}
