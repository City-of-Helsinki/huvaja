import classNames from 'classnames';
import queryString from 'query-string';
import React, { PropTypes } from 'react';

import utils from '../utils';
import Link from './Link';

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
    isSelectable: PropTypes.bool.isRequired,
    onClick: PropTypes.func,
    onMouseDown: PropTypes.func,
    onMouseEnter: PropTypes.func,
    onMouseUp: PropTypes.func,
    resourceId: PropTypes.string.isRequired,
    selection: PropTypes.shape({
      begin: PropTypes.string.isRequired,
      end: PropTypes.string.isRequired,
    }),
  };

  getData() {
    return {
      begin: this.props.begin.format(),
      end: this.props.end.format(),
    };
  }

  handleClick = (event) => {
    if (this.props.onClick) {
      event.preventDefault();
      this.props.onClick(this.getData());
    }
  }

  handleMouseDown = () => {
    if (this.props.onMouseDown) {
      this.props.onMouseDown(this.getData());
    }
  }

  handleMouseEnter = () => {
    if (this.props.onMouseEnter) {
      this.props.onMouseEnter(this.getData());
    }
  }

  handleMouseUp = () => {
    if (this.props.onMouseUp) {
      this.props.onMouseUp(this.getData());
    }
  }

  render() {
    const query = queryString.stringify({
      begin: this.props.begin.format(),
      resource: this.props.resourceId,
    });
    const isSelected = this.props.selection && (
      this.props.begin.isSameOrAfter(this.props.selection.begin) &&
      this.props.end.isSameOrBefore(this.props.selection.end)
    );
    return (
      <Link
        className={classNames(
          'reservation-slot',
          {
            'reservation-slot-selected': isSelected,
            'reservation-slot-selectable': this.props.isSelectable,
          }
        )}
        onClick={this.handleClick}
        onMouseDown={this.handleMouseDown}
        onMouseEnter={this.handleMouseEnter}
        onMouseUp={this.handleMouseUp}
        style={{ width: utils.getTimeSlotWidth() }}
        to={`/reservations/create?${query}`}
      >
        <span className="a11y-text">Make reservation</span>
      </Link>
    );
  }
}
