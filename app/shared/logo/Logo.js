import React from 'react';

import helsinkiLogoSrc from './helsinki-coat-of-arms-white.png';

function Logo() {
  return (
    <img
      alt="Helsingin vaakuna"
      src={helsinkiLogoSrc}
    />
  );
}

Logo.propTypes = {};

export default Logo;
