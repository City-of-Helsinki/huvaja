import classNames from 'classnames';
import queryString from 'query-string';
import React, { PropTypes } from 'react';
import { Link } from 'react-router';

import utils from '../utils';

export default class ReservationSlot extends React.Component {
  static propTypes = {
    begin: PropTypes.shape({
      format: PropTypes.func.isRequired,
      isSameOrAfter: PropTypes.func.isRequired,
    }).isRequired,
    end: PropTypes.shape({
      format: PropTypes.func.isRequired,
      isSameOrBefore: PropTypes.func.isRequired,
    }).isRequired,
    onClick: PropTypes.func,
    resourceId: PropTypes.string.isRequired,
    selection: PropTypes.shape({
      begin: PropTypes.string.isRequired,
      end: PropTypes.string.isRequired,
    }),
  };

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    if (this.props.onClick) {
      event.preventDefault();
      this.props.onClick({
        begin: this.props.begin.format(),
        end: this.props.end.format(),
      });
    }
  }

  render() {
    const query = queryString.stringify({ begin: this.props.begin.format() });
    const isSelected = this.props.selection && (
      this.props.begin.isSameOrAfter(this.props.selection.begin) &&
      this.props.end.isSameOrBefore(this.props.selection.end)
    );
    return (
      <Link
        className={classNames('reservation-slot', { 'reservation-slot-selected': isSelected })}
        onClick={this.handleClick}
        style={{ width: utils.getTimeSlotWidth() }}
        to={`/resources/${this.props.resourceId}?${query}`}
      >
        <span className="a11y-text">Make reservation</span>
      </Link>
    );
  }
}
