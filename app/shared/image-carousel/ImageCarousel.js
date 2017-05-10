import React, { PropTypes } from 'react';
import Carousel from 'react-bootstrap/lib/Carousel';

import BackgroundImage from 'shared/background-image';

const carouselInterval = 7000;

function renderCarouselItem(image) {
  return (
    <Carousel.Item key={image.url}>
      <BackgroundImage image={image} />
    </Carousel.Item>
  );
}

function preloadImage(image) {
  // Renders an empty div with the background image. This div won't be shown as it doesn't have
  // content but it will load the background-image. Otherwise Carousel background images won't
  // be loaded until "Carousel.Item" display css attribute is changed to something different than
  // "none". Some browsers are smart enough to avoid loading not diplayed content.
  return (
    <div
      key={image.url}
      style={{ backgroundImage: `url(${image.url}` }}
    />
  );
}

function ImageCarousel({ images }) {
  return (
    <div>
      {images.map(preloadImage)}
      <Carousel
        className="image-carousel"
        controls={images.length > 1}
        indicators={images.length > 1}
        interval={carouselInterval}
      >
        {images.map(renderCarouselItem)}
      </Carousel>
    </div>
  );
}

ImageCarousel.propTypes = {
  images: PropTypes.array.isRequired,
};

export default ImageCarousel;
