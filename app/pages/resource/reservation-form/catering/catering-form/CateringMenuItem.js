import classNames from 'classnames';
import React, { Component, PropTypes } from 'react';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';

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
      >
        <div className="name">{item.name}</div>
        <div className="price">{item.price.toFixed(2)} €</div>
        <Glyphicon glyph={selected ? 'minus' : 'plus'} />
      </button>
    );
  }
}

export default CateringMenuItem;
