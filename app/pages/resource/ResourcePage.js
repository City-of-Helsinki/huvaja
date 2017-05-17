import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import queryString from 'query-string';

import SelectableSingleAvailabilityView from 'shared/form-fields/reservation-time/SelectableSingleAvailabilityView';
import ResourceDailyReportButton from 'shared/resource-daily-report-button';
import ResourceInfo from './info';

export default class ResourcePage extends Component {
  static propTypes = {
    date: PropTypes.string.isRequired,
    hideResourceImages: PropTypes.func.isRequired,
    onDateChange: PropTypes.func.isRequired,
    resource: PropTypes.object.isRequired,
    resourceSearchUrl: PropTypes.string.isRequired,
    showResourceImages: PropTypes.func.isRequired,
    unit: PropTypes.object.isRequired,
  };

  state = {
    timelineSelectionValue: {
      begin: {
        date: this.props.date,
        time: '',
      },
      end: {
        date: this.props.date,
        time: '',
      },
    },
  }

  onValueChange = (value) => {
    this.setState({ timelineSelectionValue: value });
  }

  goToCreateReservation = () => {
    const value = this.state.timelineSelectionValue;
    const begin = `${value.begin.date}T${value.begin.time}:00.000`;
    const end = `${value.end.date}T${value.end.time}:00.000`;

    const query = queryString.stringify({
      begin,
      end,
      resource: this.props.resource.id,
    });

    const url = `/reservations/create?${query}`;
    browserHistory.push(url);
  }

  render() {
    return (
      <div className="resource-page">
        <ResourceInfo
          hideResourceImages={this.props.hideResourceImages}
          resource={this.props.resource}
          resourceSearchUrl={this.props.resourceSearchUrl}
          showResourceImages={this.props.showResourceImages}
          unit={this.props.unit}
        />
        <h3>Varaustilanne</h3>
        <p className="help-text">Klikkaa vapaata aikaa varauksen aloittamiseksi</p>
        <SelectableSingleAvailabilityView
          date={this.props.date}
          onChange={this.onValueChange}
          onDateChange={this.props.onDateChange}
          onDateSelection={this.goToCreateReservation}
          resource={this.props.resource}
          value={this.state.timelineSelectionValue}
        />
        <ResourceDailyReportButton
          resourceIds={[this.props.resource.id]}
          date={this.props.date}
        />
      </div>
    );
  }
}
