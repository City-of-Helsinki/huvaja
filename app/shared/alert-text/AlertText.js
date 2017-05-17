import React, { PropTypes } from 'react';
import Col from 'react-bootstrap/lib/Col';
import HelpBlock from 'react-bootstrap/lib/HelpBlock';
import Row from 'react-bootstrap/lib/Row';

AlertText.propTypes = {
  text: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['error', 'warning']).isRequired,
};
export default function AlertText({ text, type }) {
  return (
    <div className={`alert-text alert-text-${type}`}>
      <HelpBlock>
        <Row>
          <Col sm={2} className="notice">Huomio</Col>
          <Col sm={10}>{text}</Col>
        </Row>
      </HelpBlock>
    </div>
  );
}
