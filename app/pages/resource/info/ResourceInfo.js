import React, { PropTypes } from 'react';
import Col from 'react-bootstrap/lib/Col';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';

import ImageCarousel from 'shared/image-carousel';
import WrappedText from 'shared/wrapped-text';

function ResourceInfo({ resource, unit }) {
  return (
    <div className="resource-info">
      <header>
        <h2 className="unit-name">{unit.name.fi}</h2>
        <h1 className="resource-name">{resource.name.fi}</h1>
        <h4 className="unit-address">
          <Glyphicon glyph="map-marker" className="map-marker" /> {unit.streetAddress.fi}
        </h4>
      </header>
      <section className="resource-details">
        <Grid>
          <Row>
            <Col xs={12} sm={7}>
              <ImageCarousel images={resource.images} />
            </Col>
            <Col xs={12} sm={5}>
              <aside>
                <h3 className="resource-type">{resource.type.name.fi}</h3>
                <div className="details-row resource-people-capacity">
                  <span className="details-label">Henkilömäärä: </span>
                  <span className="details-value">{resource.peopleCapacity}</span>
                </div>
                <div className="resource-description">
                  <WrappedText text={resource.description.fi} />
                </div>
              </aside>
            </Col>
          </Row>
        </Grid>
      </section>
    </div>
  );
}

ResourceInfo.propTypes = {
  resource: PropTypes.object.isRequired,
  unit: PropTypes.object.isRequired,
};

export default ResourceInfo;
