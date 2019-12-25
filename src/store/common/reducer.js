import * as types from "./actionTypes";
import _ from 'underscore';

const initialState = {
  pgs: [],
  users: [],
};


export default function common(state = initialState, action = {}) {
  switch (action.type) {

    case types.PUSH_PHOTOGRAPHER:

      return {
        ...state,
        type: types.PUSH_PHOTOGRAPHER,
        pgs: action.data,
        status: action.status
      }

    case types.GET_PHOTOGRAPHERS:
      return {
        ...state,
        type: types.GET_PHOTOGRAPHERS,
        photographers: action.data,
        status: action.status
      }

      //////////////////////////////////////
    case types.PUSH_USER:
      return {
        ...state,
        type: types.PUSH_USER,
        users: action.data,
        status: action.status
      }

    case types.GET_USERS:
      return {
        ...state,
        type: types.GET_USERS,
        users: action.data,
        status: action.status
      }

    //=============================================================

    // case types.ADD_MESSAGE:

    //   state.messages.unshift(action.data)
    //   var mapping = _.uniq(state.messages, 'fullName');

    //   return {
    //     ...state,
    //     type: types.ADD_MESSAGE,
    //     messages: mapping,
    //     status: action.status
    //   }


    // case types.GET_MESSAGES:
    //   return {
    //     ...state,
    //     type: types.GET_MESSAGES,
    //     messages: state.messages,
    //     status: action.status
    //   }

 


    //============================================================= VIEW USER

    case types.SET_USER:

      return {
        ...state,
        type: types.SET_USER,
        reduxUser: action.data,
        status: action.status
      }

    default:
      return state;
  }
}
