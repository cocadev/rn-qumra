import * as types from "./actionTypes";
import _ from 'underscore';

const initialState = {
  orders: [],
};

export default function orders(state = initialState, action = {}) {
  switch (action.type) {

    case types.CLEAR_ORDERS:
      state.orders = []
      return {
        ...state,
        type: types.GET_ORDERS,
        orders: []
      }

    case types.ADD_ORDER:

      var newO = state.orders
      newO.push(action.data)
      var mappingO = _.sortBy(newO, 'updatedAt').reverse()
      var mappingC = _.uniq(mappingO, 'order')

      return {
        ...state,
        type: types.ADD_ORDER,
        orders: mappingC
      }

    case types.CLEAR:
      return {
        ...state,
        type: types.CLEAR,
        orders: [],
        status: action.status
      }
    default:
      return state;
  }
}
