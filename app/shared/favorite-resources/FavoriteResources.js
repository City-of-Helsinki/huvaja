import React, { PropTypes } from 'react';

import FavoriteResource from './favorite-resource';

FavoriteResources.propTypes = {
  resources: PropTypes.array.isRequired,
  unfavoriteResource: PropTypes.func.isRequired,
};
export default function FavoriteResources({ resources, unfavoriteResource }) {
  return (
    <ul className="favorite-resources">
      {resources.length === 0 ?
        'Ei tiloja' :
        resources.map(resource =>
          <FavoriteResource
            id={resource.id}
            key={resource.id}
            name={resource.longName}
            unfavoriteResource={() => unfavoriteResource(resource.id)}
          />
        )
      }
    </ul>
  );
}
