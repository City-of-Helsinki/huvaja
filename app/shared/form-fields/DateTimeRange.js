import classNames from 'classnames';
import React, { PropTypes } from 'react';
import HelpBlock from 'react-bootstrap/lib/HelpBlock';

import DatePicker from 'shared/date-picker';
import Field from './Field';
import Time from './Time';

export default class DateTimeRange extends React.Component {
  static propTypes = {
    controlProps: PropTypes.shape({
      onBlur: PropTypes.func.isRequired,
      onChange: PropTypes.func.isRequired,
      required: PropTypes.bool,
      value: PropTypes.shape({
        begin: PropTypes.object.isRequired,
        end: PropTypes.object.isRequired,
      }).isRequired,
    }).isRequired,
    help: PropTypes.string,
    id: PropTypes.string.isRequired,
    noLabels: PropTypes.bool,
    validationState: PropTypes.string,
  };

  handleBlur = () => {
    this.props.controlProps.onBlur(this.props.controlProps.value);
  }

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
      <div
        className={classNames(
          'date-time-range-field-container',
          { 'has-error': this.props.validationState },
        )}
      >
        <div className="date-time-range-field">
          <Field
            componentClass={DatePicker}
            controlProps={{
              onBlur: this.handleBlur,
              onChange: this.handleDateChange,
              value: value.begin.date,
            }}
            id={`${this.props.id}-date`}
            label={this.props.noLabels ? '' : `Päivä${requiredPostfix}`}
          />
          <Field
            componentClass={Time}
            controlProps={{
              onBlur: this.handleBlur,
              onChange: this.handleStartTimeChange,
              value: value.begin.time,
            }}
            id={`${this.props.id}-begin-time`}
            label={this.props.noLabels ? '' : `Alkaa${requiredPostfix}`}
          />
          <Field
            componentClass={Time}
            controlProps={{
              onBlur: this.handleBlur,
              onChange: this.handleEndTimeChange,
              value: value.end.time,
            }}
            id={`${this.props.id}-end-time`}
            label={this.props.noLabels ? '' : `Päättyy${requiredPostfix}`}
          />
        </div>
        {this.props.help && <HelpBlock>{this.props.help}</HelpBlock>}
      </div>
    );
  }
}
