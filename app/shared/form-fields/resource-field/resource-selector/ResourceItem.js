import classNames from 'classnames';
import React, { PropTypes } from 'react';

ResourceItem.propTypes = {
  available: PropTypes.bool.isRequired,
  hasBadCateringProvider: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
  peopleCapacity: PropTypes.number.isRequired,
};
export default function ResourceItem({
  available,
  hasBadCateringProvider,
  id,
  label,
  onSelect,
  peopleCapacity,
}) {
  const disabled = hasBadCateringProvider;
  const className = classNames(
    'resource-item',
    {
      disabled,
      unavailable: !available,
    },
  );
  function onClick() {
    if (!disabled) onSelect(id);
  }
  return (
    <div className={className}>
      <a onClick={onClick} tabIndex="0">
        <div className="resource-item-label">
          {label}
          {hasBadCateringProvider ?
            <p className="resource-item-disabled-text">
              Valittu tarjoilutilaus ei ole mahdollinen tähän tilaan.
            </p> :
            null
          }
        </div>
        <div>
          <div className="capacity">
            <span className="chair-icon" /> {peopleCapacity}
          </div>
        </div>
      </a>
    </div>
  );
}
