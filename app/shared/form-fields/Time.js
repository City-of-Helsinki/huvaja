import React, { PropTypes } from 'react';
import FormControl from 'react-bootstrap/lib/FormControl';
import MaskedInput from 'react-maskedinput';

export default class Time extends React.Component {
  static propTypes = {
    onBlur: PropTypes.func,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string,
  };

  handleChange = (event) => {
    this.props.onChange(event.target.value);
  }

  render() {
    return (
      <FormControl
        className="time-field"
        componentClass={MaskedInput}
        mask="11:11"
        placeholderChar="-"
        onBlur={this.props.onBlur}
        onChange={this.handleChange}
        value={this.props.value}
      />
    );
  }
}
