import classNames from 'classnames';
import React, { Component, PropTypes } from 'react';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import HelpBlock from 'react-bootstrap/lib/HelpBlock';

import Time from 'shared/form-fields/Time';

class ServingTimeField extends Component {
  static propTypes = {
    controlProps: PropTypes.shape({
      onChange: PropTypes.func.isRequired,
      value: PropTypes.string,
    }).isRequired,
    help: PropTypes.string,
    label: PropTypes.string,
    validationState: PropTypes.string,
  }

  constructor(props) {
    super(props);
    this.state = {
      enabledCustomTime: Boolean(props.controlProps.value),
    };
  }

  disableCustomTime = () => {
    this.props.controlProps.onChange('');
    this.setState({
      enabledCustomTime: false,
    });
  }

  enableCustomTime = () => {
    this.setState({
      enabledCustomTime: true,
    });
  }

  render() {
    const className = classNames(
      'serving-time-field',
      { 'has-error': this.props.validationState },
    );
    return (
      <div className={className}>
        <div className="form-group">
          <ControlLabel>
            {this.props.label}
          </ControlLabel>
          <div>
            <input
              defaultChecked={!this.state.enabledCustomTime}
              id="serving-reservation-time"
              type="radio"
              name="customTime"
              onClick={this.disableCustomTime}
            />
            <label className="radio-label" htmlFor="serving-reservation-time">
              Varauksen alkamisaika
            </label>
          </div>
          <div>
            <input
              defaultChecked={this.state.enabledCustomTime}
              type="radio"
              id="serving-custom-time"
              name="customTime"
              onClick={this.enableCustomTime}
            />
            <label className="radio-label" htmlFor="serving-custom-time">Klo</label>
            <Time
              {...this.props.controlProps}
              disabled={!this.state.enabledCustomTime}
            />
          </div>
          {this.props.help && <HelpBlock>{this.props.help}</HelpBlock>}
        </div>
      </div>
    );
  }
}


export default ServingTimeField;
