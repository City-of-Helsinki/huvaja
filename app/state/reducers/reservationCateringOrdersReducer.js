import fromPairs from 'lodash/fromPairs';
import { handleActions } from 'redux-actions';

import actionTypes from 'api/actionTypes';

// State will map reservation ids to catering order ids.
const initialState = {};

export default handleActions({
  [actionTypes.CATERING_ORDER_GET_SUCCESS]: (state, action) => {
    if (!action.payload.entities.cateringOrders) return state;
    const orders = Object.values(action.payload.entities.cateringOrders);
    const pairs = orders.map(order => [order.reservation, order.id]);
    const newData = fromPairs(pairs);
    return { ...state, ...newData };
  },
  [actionTypes.CATERING_ORDER_POST_SUCCESS]: (state, action) => ({
    ...state,
    [action.payload.reservation]: action.payload.id,
  }),
}, initialState);
