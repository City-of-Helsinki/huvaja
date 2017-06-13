import fromPairs from 'lodash/fromPairs';
import moment from 'moment';

function formatServingTime(time) {
  return moment(time, 'HH:mm:ss').format('H:mm');
}

function getServingTimeText(servingTime) {
  return servingTime ?
    formatServingTime(servingTime) :
    'Varauksen alkamisaika';
}

// [{ product: 2, quantity: 10 }] -> { 2: 10 }
function orderLinesToOrderObject(orderLines) {
  const pairs = orderLines.map(line => [line.product, line.quantity]);
  return fromPairs(pairs);
}

// { 2: 10 } -> [{ product: 2, quantity: 10 }]
function orderObjectToOrderLines(order) {
  return Object.keys(order).map(productId => ({
    product: parseInt(productId, 10),
    quantity: order[productId],
  }));
}

function cateringOrderToFormValue(cateringOrder) {
  const { orderLines, ...rest } = cateringOrder;
  return {
    ...rest,
    order: orderLinesToOrderObject(orderLines),
  };
}

function formValueToCateringOrder(value) {
  const { order, ...rest } = value;
  return {
    ...rest,
    orderLines: orderObjectToOrderLines(order),
  };
}

export default {
  cateringOrderToFormValue,
  formatServingTime,
  formValueToCateringOrder,
  getServingTimeText,
};
