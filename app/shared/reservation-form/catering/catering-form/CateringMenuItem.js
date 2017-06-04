import classNames from 'classnames';
import React, { Component, PropTypes } from 'react';
import FontAwesome from 'react-fontawesome';

class CateringMenuItem extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
    selected: PropTypes.bool.isRequired,
  }

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.onClick(this.props.item.id);
  }

  render() {
    const { item, selected } = this.props;
    return (
      <button
        className={classNames('catering-menu-item', { selected })}
        onClick={this.handleClick}
        type="button"
      >
        <div className="name">{item.name.fi}</div>
        <div className="description">{item.description && item.description.fi}</div>
        <FontAwesome name={selected ? 'minus' : 'plus'} />
      </button>
    );
  }
}

export default CateringMenuItem;
