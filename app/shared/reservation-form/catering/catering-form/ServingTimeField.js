import React, { Component, PropTypes } from 'react';

class ServingTimeField extends Component {
  static propTypes = {
    input: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      startAtReservationTime: !props.input.value,
    };
  }

  disableCustomTime = () => {
    this.props.input.onChange(null);
    this.setState({
      startAtReservationTime: true,
    });
  }

  enableCustomTime = () => {
    this.setState({
      startAtReservationTime: false,
    });
  }

  render() {
    return (
      <div>
        <div className="form-group">
          <div>
            <input
              defaultChecked={this.state.startAtReservationTime}
              id="serve-reservation-time"
              type="radio"
              name="customTime"
              onClick={this.disableCustomTime}
            />
            <label htmlFor="serve-reservation-time">Varauksen alkamisaika</label>
          </div>
          <div>
            <input
              defaultChecked={!this.state.startAtReservationTime}
              type="radio"
              id="serve-custom-time"
              name="customTime"
              onClick={this.enableCustomTime}
            />
            <label htmlFor="serve-custom-time">Klo:</label>
            <input {...this.props.input} disabled={this.state.startAtReservationTime} type="time" />
          </div>
        </div>
      </div>
    );
  }
}


export default ServingTimeField;
