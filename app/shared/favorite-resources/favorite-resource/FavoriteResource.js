import React, { PropTypes } from 'react';
import FontAwesome from 'react-fontawesome';
import { Link } from 'react-router';

FavoriteResource.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  unfavoriteResource: PropTypes.func.isRequired,
};
export default function FavoriteResource({ id, name, unfavoriteResource }) {
  return (
    <li className="favorite-resource">
      <div>
        <FontAwesome className="favorite-resource-heart" name="heart" />
        <Link className="favorite-resource-link" to={`/resources/${id}`}>{name}</Link>
      </div>
      <FontAwesome
        className="favorite-resource-unfavorite"
        name="times"
        onClick={unfavoriteResource}
      />
    </li>
  );
}
