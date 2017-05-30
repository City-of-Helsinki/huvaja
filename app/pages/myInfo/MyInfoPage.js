import React from 'react';

import FavoriteResources from 'shared/favorite-resources';

export default function MyInfoPage() {
  return (
    <div className="my-info-page">
      <h1>Omat tiedot</h1>
      <section className="my-info-page-section">
        <h2 className="my-info-page-section-heading">Suosikkitilat</h2>
        <FavoriteResources />
      </section>
    </div>
  );
}
