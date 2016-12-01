import React, { PropTypes } from 'react';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';

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
          <Glyphicon className="favorite-icon" glyph="heart" />
        </span> :
        <span className="unfavorited">
          <span className="favorite-text">Lisää suosikkeihin</span>
          <Glyphicon className="favorite-icon" glyph="heart-empty" />
        </span>
      }
    </button>
  );
}

export default FavoriteButton;
