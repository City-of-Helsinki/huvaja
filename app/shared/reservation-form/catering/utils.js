import sortBy from 'lodash/sortBy';

function getOrderItems(cateringMenuItems, order) {
  const orderItems = Object.keys(order).map(itemId => ({
    ...cateringMenuItems[itemId],
    quantity: order[itemId],
  }));
  return sortBy(
    orderItems.filter(item => item.quantity !== 0),
    'name'
  );
}

function hasOrders(cateringData) {
  if (!(cateringData && cateringData.order)) return false;
  const quantities = Object.values(cateringData.order);
  const total = quantities.reduce(
    (sum, value) => sum + parseInt(value, 10) || 0,
    0,
  );
  return total > 0;
}

export default {
  getOrderItems,
  hasOrders,
};
