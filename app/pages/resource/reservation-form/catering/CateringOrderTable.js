import React, { PropTypes } from 'react';
import FormControl from 'react-bootstrap/lib/FormControl';
import Table from 'react-bootstrap/lib/Table';

CateringOrderTable.propTypes = {
  editOrder: PropTypes.func,
  items: PropTypes.array.isRequired,
};

function CateringOrderTable(props) {
  const totalPrice = props.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  return (
    <Table className="catering-order-table" striped>
      <thead>
        <tr>
          <th className="product">Tuote</th>
          <th className="number">Hinta</th>
          <th className="number">Määrä</th>
          <th className="number">Yhteensä</th>
        </tr>
      </thead>
      <tbody>
        {props.items.map(item =>
          <tr key={item.id}>
            <td className="product">{item.name}</td>
            <td className="number">{item.price.toFixed(2)} €</td>
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
            <td className="number">{(item.quantity * item.price).toFixed(2)} €</td>
          </tr>
        )}
      </tbody>
      {Boolean(totalPrice) &&
        <tfoot>
          <tr>
            <th className="product">Yhteensä</th>
            <th />
            <th />
            <th className="number">{totalPrice.toFixed(2)} €</th>
          </tr>
        </tfoot>
      }
    </Table>
  );
}


export default CateringOrderTable;
