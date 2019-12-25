import * as types from "./actionTypes";
import _ from 'underscore';

const initialState = {
  messages: [],
};


export default function messages(state = initialState, action = {}) {
  switch (action.type) {

    case types.CLEAR_MESSAGES:
      return {
        ...state,
        type: types.CLEAR_MESSAGES,
        messages: [],
        status: action.status
      }

    case types.GROUP_MESSAGES:

      var sortedArray = _(action.data).chain().sortBy(function(patient) {
          return patient[patient.length-1].createdAt;
      }).reverse().sortBy(function(patient) {
          return patient[patient.length-1].createdAt;
      }).reverse().value();
      
      return {
        ...state,
        type: types.GROUP_MESSAGES,
        messages: sortedArray,
        status: action.status
      }

    case types.SEND_MESSAGE:
      return {
        ...state,
        type: types.SEND_MESSAGE,
        status: action.status
      }

    default:
      return state;
  }
}
