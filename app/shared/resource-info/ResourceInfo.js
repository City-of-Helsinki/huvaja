import capitalize from 'lodash/capitalize';
import React, { PropTypes } from 'react';
import Col from 'react-bootstrap/lib/Col';
import Label from 'react-bootstrap/lib/Label';
import Row from 'react-bootstrap/lib/Row';
import FontAwesome from 'react-fontawesome';
import Button from 'react-bootstrap/lib/Button';
import { Link } from 'react-router';

import FavoriteButton from 'shared/favorite-button';
import WrappedText from 'shared/wrapped-text';

ResourceInfo.propTypes = {
  resource: PropTypes.object.isRequired,
  resourceSearchUrl: PropTypes.string,
  showResourceImages: PropTypes.func.isRequired,
  unit: PropTypes.object.isRequired,
};

function renderHeader(unit, resource, resourceSearchUrl) {
  const streetAddress = unit.streetAddress ? unit.streetAddress.fi : '';
  const zip = unit.addressZip;
  const city = capitalize(unit.municipality);
  const address = `${streetAddress}, ${zip} ${city}`;
  return (
    <header>
      {resourceSearchUrl &&
        <Link className="btn btn-sm back-link" to={resourceSearchUrl}>{'<< Tilahaku'}</Link>
      }
      <h2 className="unit-name">{unit.name.fi}</h2>
      <h1 className="resource-name">{resource.name.fi}</h1>
      <h4 className="unit-address">
        <FontAwesome name="map-marker" className="map-marker" /> {address}
      </h4>
    </header>
  );
}


function ResourceInfo({ resource, resourceSearchUrl, showResourceImages, unit }) {
  const showImages = () => showResourceImages(resource.id);
  return (
    <div className="resource-info">
      <Row>
        <Col xs={12} sm={8} md={9}>
          {renderHeader(unit, resource, resourceSearchUrl)}
          <section className="resource-details">
            <aside>
              <div className="details-row">
                <span className="details-label">Tyyppi: </span>
                <Label className="resource-type" bsStyle="primary">
                  {resource.type.name.fi}
                </Label>
              </div>
              <div className="details-row resource-people-capacity">
                <span className="details-label">Paikkoja: </span>
                <span className="details-value">{resource.peopleCapacity}</span>
              </div>
              {resource.equipment &&
                <div className="details-row resource-equipment">
                  <span className="details-label">Varustelu: </span>
                  {
                    resource.equipment.map(item =>
                      <Label bsStyle="success" key={`label-${item.id}`}>{item.name.fi}</Label>
                    )
                  }
                </div>
              }
            </aside>
          </section>
        </Col>
        <Col className="sidebar" xs={12} sm={4} md={3}>
          <FavoriteButton className="favorite-button" resource={resource} />
          {resource.images.length ?
            <Button bsSize="small" className="show-images-mobile visible-xs" onClick={showImages}>
              Katso kuvat
            </Button> :
            null
          }
          {resource.images.length ?
            <a className="resource-image-container hidden-xs" onClick={showImages} tabIndex="0">
              <img alt="Tila" className="resource-image" src={resource.images[0].url} />
              <div className="caption">Katso kuvat</div>
            </a> :
            null
          }
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <div className="resource-description">
            {resource.description &&
              <WrappedText text={resource.description.fi} />
            }
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default ResourceInfo;
