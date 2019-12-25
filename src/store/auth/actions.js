import * as types from './actionTypes';
import firebase from 'firebase'
import _ from 'underscore';

export const setUser = (user) =>
  dispatch => {
    dispatch({
      type: types.SET_USER,
      data: user,
    });
  }


export const getUser = (user) =>
  dispatch =>
    new Promise(function (resolve, reject) {
      firebase.database().ref(`/members`).orderByChild("id").equalTo(user.uid)
        .once("child_added", function (snapshot) {
          dispatch({
            type: types.GET_USER,
            data: snapshot.val(),
          });
          resolve(snapshot.val())
        }
        )
    })

export const updateProfile = (email, fullname, phone, uploadResult) =>
  dispatch =>
    new Promise(function (resolve, reject) {

      let data = {
        email: email,
        fullname: fullname,
        phone: phone,
        uploadResult: uploadResult,
      }

      dispatch({
        type: types.UPDATE_USER,
        data: data
      });

      resolve('success')
    }
    )

export const updatePhotographer = (summary, fullname, rate, male, turnOn, uploadResult, availbility, myProfilePics) =>
  dispatch =>
    new Promise(function (resolve, reject) {

      let data = {
        summary: summary,
        fullname: fullname,
        rate: rate,
        male: male,
        turnOn: turnOn,
        uploadResult: uploadResult,
        availbility: availbility,
        myProfilePics: myProfilePics
      }

      dispatch({
        type: types.UPDATE_PHOTOGRAPHER,
        data: data
      });

      resolve('success')
    }
    )





export const clear = () =>
  dispatch =>
    new Promise(function (resolve, reject) {

      dispatch({
        type: types.CLEAR,
      });

      resolve('success')
    }
    )

export const givePhotographerReview = (userId, photographerId, rating, review) =>
  dispatch =>
    new Promise(function (resolve, reject) {

      var now = new Date().getTime();
      firebase.database().ref(`/photographers/${photographerId}/user/reviews`)
        .push({
          employer: userId,
          rating: rating,
          review: review,
          date: now
        })
        .then((res) => {
          showMessage({ message: "Success Request", description: "Great", type: "success", icon: "success" });
          dispatch({
            type: types.GIVE_REVIEW,
          });

          resolve('success')
        })
        .catch(error => {
          showMessage({ message: "Fail Request", description: error.message, type: "danger", icon: "danger" });
        })
    }
    )

    export const toggleLocation = (uid, turnOn, latitude, longitude) =>
  dispatch =>
    new Promise(function (resolve, reject) {

      firebase.database().ref(`/photographers/${uid}/user`)
        .update({
          turnOn: turnOn,
          location: {
            latitude: latitude,
            longitude: longitude,
          }
        })
        .then((res) => {
          showMessage({ message: "Success Request", description: "Location setting changed", type: "success", icon: "success" });

          dispatch({
            type: types.TOOGLE_LOCATION,
            data: turnOn,
            latitude: latitude,
            longitude: longitude,
          });
          resolve(turnOn)
        })
        .catch(error => {
          showMessage({ message: "Fail Request", description: error.message, type: "danger", icon: "danger" });
          reject(false)
        })

    }
    )