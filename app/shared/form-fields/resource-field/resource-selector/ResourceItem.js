import classNames from 'classnames';
import React, { PropTypes } from 'react';

ResourceItem.propTypes = {
  available: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
  peopleCapacity: PropTypes.number.isRequired,
};
export default function ResourceItem({
  available,
  id,
  label,
  onSelect,
  peopleCapacity,
}) {
  return (
    <div className={classNames('resource-item', { unavailable: !available })}>
      <a onClick={() => onSelect(id)} tabIndex="0">
        <div className="resource-item-label">{label}</div>
        <div>
          <div className="capacity">
            <span className="chair-icon" /> {peopleCapacity}
          </div>
        </div>
      </a>
    </div>
  );
}
