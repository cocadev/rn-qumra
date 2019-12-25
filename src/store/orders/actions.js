import * as types from './actionTypes';
import firebase from 'firebase';
import { showMessage } from "react-native-flash-message";

export function getOrders(data) {
  return dispatch => {
    dispatch({ type: types.GET_ORDERS, data: data });
  }
}

export function getUserOrders(currentUser) {
  return async dispatch => {
    dispatch({ type: types.CLEAR_ORDERS });
    new Promise(function (resolve, reject) {
      firebase.database().ref(`/orders`).orderByChild("sender").equalTo(currentUser.qumraId).on("value", function async(snapshot) {
        snapshot.forEach((childSnapshot) => {
          var order = childSnapshot.val();
          firebase.database().ref(`/members`).orderByChild("qumraId").equalTo(childSnapshot.val().receiver).once("child_added", function (ddd) {
            order['avatar'] = ddd.val().avatar
            order['fullName'] = ddd.val().fullName
            order['rate'] = ddd.val().rate
            dispatch({ type: types.ADD_ORDER, data: order });
            resolve(true)
          })
        });
      })
    })
  }
}

export function getPhotographerOrders(currentUser) {
  return async dispatch => {
    dispatch({ type: types.CLEAR_ORDERS });
    new Promise(function (resolve, reject) {
      firebase.database().ref(`/orders`).orderByChild("receiver").equalTo(currentUser.qumraId).on("value", function async(snapshot) {
        snapshot.forEach((childSnapshot) => {
          var order = childSnapshot.val();
          firebase.database().ref(`/members`).orderByChild("qumraId").equalTo(childSnapshot.val().sender).once("child_added", function (ddd) {
            order['avatar'] = ddd.val().avatar
            order['fullName'] = ddd.val().fullName
            dispatch({ type: types.ADD_ORDER, data: order });
            resolve(true)
          })
        });
      })
    })
  }
}

export function sendRequest(currentUser, oppositeUid, myview) {
  return async dispatch => {
    var now = new Date().getTime();

    if (currentUser.qumraId > oppositeUid) {
      var OrderID = `${currentUser.qumraId}-${oppositeUid}`;
    } else {
      var OrderID = `${oppositeUid}-${currentUser.qumraId}`;
    }

    var ref = firebase.database().ref(`/orders/${OrderID}`)

    ref.update({
      updatedAt: now,
      accept: myview,
    });
    showMessage({
      message: "Success",
      description: "This Order is " + myview + "ed successfully.",
      type: "success",
      icon: "success"
    });
    // dispatch({ 
    //   type: types.SEND_REQUEST, 
    //   data: myview,
    //   updatedAt: now,
    //   oppositeUid: oppositeUid,
    //   myType: currentUser.type 
    // });

  }
}

export const clear = () =>
  dispatch =>
    new Promise(function (resolve, reject) {

      dispatch({
        type: types.CLEAR,
      });

      resolve('success')
    }
    )