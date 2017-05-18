import React, { PropTypes } from 'react';
import FormControl from 'react-bootstrap/lib/FormControl';
import Table from 'react-bootstrap/lib/Table';
import FontAwesome from 'react-fontawesome';

CateringOrderTable.propTypes = {
  editOrder: PropTypes.func,
  items: PropTypes.array.isRequired,
};

function CateringOrderTable(props) {
  return (
    <Table className="catering-order-table" striped>
      <thead>
        <tr>
          <th className="product">Tuote</th>
          <th className="description">Kuvaus</th>
          <th className="number">Määrä</th>
          {props.editOrder && <th />}
        </tr>
      </thead>
      <tbody>
        {props.items.map(item =>
          <tr key={item.id}>
            <td className="product">{item.name}</td>
            <td className="description">{item.description}</td>
            <td className="number">
              {props.editOrder &&
                <FormControl
                  min="1"
                  onChange={event => props.editOrder(item.id, event.target.value)}
                  type="number"
                  value={item.quantity}
                />
              }
              {!props.editOrder && item.quantity}
            </td>
            {props.editOrder &&
              <td className="controls">
                <FontAwesome
                  className="control"
                  name="remove"
                  onClick={() => props.editOrder(item.id, 0)}
                />
              </td>
            }
          </tr>
        )}
      </tbody>
    </Table>
  );
}


export default CateringOrderTable;
