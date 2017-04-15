import React, { PropTypes } from 'react';

import DatePicker from 'shared/date-picker';
import Field from './Field';
import Time from './Time';

export default class DateTimeRange extends React.Component {
  static propTypes = {
    controlProps: PropTypes.shape({
      onChange: PropTypes.func.isRequired,
      required: PropTypes.bool,
      value: PropTypes.shape({
        begin: PropTypes.object.isRequired,
        end: PropTypes.object.isRequired,
      }).isRequired,
    }).isRequired,
    id: PropTypes.string.isRequired,
    noLabels: PropTypes.bool,
  };

  handleDateChange = (date) => {
    const value = this.props.controlProps.value;
    this.props.controlProps.onChange({
      begin: { ...value.begin, date },
      end: { ...value.end, date },
    });
  }

  handleStartTimeChange = (time) => {
    const value = this.props.controlProps.value;
    this.props.controlProps.onChange({
      ...value,
      begin: { ...value.begin, time },
    });
  }

  handleEndTimeChange = (time) => {
    const value = this.props.controlProps.value;
    this.props.controlProps.onChange({
      ...value,
      end: { ...value.end, time },
    });
  }

  render() {
    const value = this.props.controlProps.value;
    const requiredPostfix = this.props.controlProps.required ? '*' : '';
    return (
      <div className="date-time-range-field">
        <Field
          componentClass={DatePicker}
          controlProps={{ onChange: this.handleDateChange, value: value.begin.date }}
          id={`${this.props.id}-date`}
          label={this.props.noLabels ? '' : `Päivä${requiredPostfix}`}
        />
        <Field
          componentClass={Time}
          controlProps={{ onChange: this.handleStartTimeChange, value: value.begin.time }}
          id={`${this.props.id}-begin-time`}
          label={this.props.noLabels ? '' : `Alkaa${requiredPostfix}`}
        />
        <Field
          componentClass={Time}
          controlProps={{ onChange: this.handleEndTimeChange, value: value.end.time }}
          id={`${this.props.id}-end-time`}
          label={this.props.noLabels ? '' : `Päättyy${requiredPostfix}`}
        />
      </div>
    );
  }
}
