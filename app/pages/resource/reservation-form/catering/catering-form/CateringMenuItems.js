import React, { PropTypes } from 'react';

import CateringMenuItem from './CateringMenuItem';

CateringMenuItems.propTypes = {
  items: PropTypes.array.isRequired,
  onItemClick: PropTypes.func.isRequired,  // eslint-disable-line react/no-unused-prop-types
  order: PropTypes.object.isRequired,
};

function CateringMenuItems(props) {
  return (
    <div className="catering-menu-items">
      {props.items.map(item =>
        <CateringMenuItem
          item={item}
          key={item.id}
          onClick={props.onItemClick}
          selected={Boolean(props.order[item.id] || props.order[item.id] === '')}
        />
      )}
    </div>
  );
}

export default CateringMenuItems;
