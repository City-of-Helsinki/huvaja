import moment from 'moment';
import React, { PropTypes } from 'react';

export default class DateSelector extends React.Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.handleNextClick = this.handleNextClick.bind(this);
    this.handlePreviousClick = this.handlePreviousClick.bind(this);
  }

  handleChange(newValue) {
    this.props.onChange(newValue);
  }

  handleNextClick() {
    this.handleChange(moment(this.props.value).add(1, 'day').format('YYYY-MM-DD'));
  }

  handlePreviousClick() {
    this.handleChange(moment(this.props.value).subtract(1, 'day').format('YYYY-MM-DD'));
  }

  render() {
    return (
      <div className="date-selector">
        <a className="previous" onClick={this.handlePreviousClick} tabIndex="0">
          Edellinen päivä
        </a>
        <div className="current-value">
          {moment(this.props.value).format('dd D.M.YYYY')}
        </div>
        <a className="next" onClick={this.handleNextClick} tabIndex="0">
          Seuraava päivä
        </a>
      </div>
    );
  }
}
