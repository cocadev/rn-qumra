import * as types from "./actionTypes";
import _ from 'underscore';

const initialState = {
  auth: 0,
  profile: null,
  reduxUser: null
};


export default function auth(state = initialState, action = {}) {
  switch (action.type) {

    case types.SET_USER:
      return {
        ...state,
        type: types.SET_USER,
        reduxUser: action.data,
        status: action.status
    }

    case types.GET_USER:
      return {
        ...state,
        type: types.GET_USER,
        reduxUser: action.data,
        status: action.status
    }

    case types.UPDATE_USER:

      let newUser = state.reduxUser
      newUser.email = action.data.email
      newUser.fullName = action.data.fullname
      newUser.avatar = action.data.uploadResult

      return {
        ...state,
        type: types.UPDATE_USER,
        reduxUser: newUser,
        status: action.status
      }

    case types.UPDATE_PHOTOGRAPHER:

      let newPhotographer = state.reduxUser
      newPhotographer.summary = action.data.summary
      newPhotographer.fullName = action.data.fullname
      newPhotographer.rate = action.data.rate
      newPhotographer.male = action.data.male
      newPhotographer.turnOn = action.data.turnOn
      newPhotographer.avatar = action.data.uploadResult
      newPhotographer.availbility = action.data.availbility
      newPhotographer.myProfilePics = action.data.myProfilePics

      return {
        ...state,
        type: types.UPDATE_PHOTOGRAPHER,
        reduxUser: newPhotographer,
        status: action.status
      }

    case types.TOOGLE_LOCATION:

      let newPhotographerToogle = state.reduxUser
      newPhotographerToogle.user.turnOn = action.data
      newPhotographerToogle.user.location.latitude = action.latitude
      newPhotographerToogle.user.location.longitude = action.longitude

      return {
        ...state,
        type: types.TOOGLE_LOCATION,
        reduxUser: newPhotographerToogle,
        status: action.status
      }

    case types.CLEAR:
      return {
        ...state,
        type: types.CLEAR,
        reduxUser: null,
        status: action.status
      }

    case types.GIVE_REVIEW:
      return {
        ...state,
        type: types.GIVE_REVIEW,
        status: action.status
      }

    default:
      return state;
  }
}

