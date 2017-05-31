import React, { PropTypes } from 'react';
import Panel from 'react-bootstrap/lib/Panel';
import PanelGroup from 'react-bootstrap/lib/PanelGroup';

import CateringMenuItem from './CateringMenuItem';

CateringMenu.propTypes = {
  categories: PropTypes.array.isRequired,
  onItemClick: PropTypes.func.isRequired,  // eslint-disable-line react/no-unused-prop-types
  order: PropTypes.object.isRequired, // eslint-disable-line react/no-unused-prop-types
};

export default function CateringMenu(props) {
  return (
    <PanelGroup className="catering-menu">
      {props.categories.map(category =>
        <Panel
          className="catering-menu-category"
          collapsible
          eventKey={category.id}
          header={category.name.fi}
          key={category.id}
        >
          {category.products.map(item =>
            <CateringMenuItem
              item={item}
              key={item.id}
              onClick={props.onItemClick}
              selected={Boolean(props.order[item.id] || props.order[item.id] === '')}
            />
          )}
        </Panel>
      )}
    </PanelGroup>
  );
}
