import React, { PropTypes } from 'react';
import FontAwesome from 'react-fontawesome';

FavoriteButton.propTypes = {
  favorited: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

function FavoriteButton({ favorited, onClick }) {
  return (
    <button
      className="favorite-button"
      onClick={onClick}
    >
      { favorited ?
        <span className="favorited">
          <span className="favorite-text">Poista suosikeista</span>
          <FontAwesome className="favorite-icon" name="heart" />
        </span> :
        <span className="unfavorited">
          <span className="favorite-text">Lisää suosikkeihin</span>
          <FontAwesome className="favorite-icon" name="heart-o" />
        </span>
      }
    </button>
  );
}

export default FavoriteButton;
