import React, { PropTypes } from 'react';

ResourceAvailability.propTypes = {
  date: PropTypes.string.isRequired,
};

export default function ResourceAvailability(props) {
  return <div>{props.date}</div>;
}

