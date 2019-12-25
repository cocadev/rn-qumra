import * as types from './actionTypes';
import firebase from 'firebase';
import { Notifications } from "expo";
import _ from 'underscore'

export function groupMessages(currentUser) {
  return dispatch => {
    dispatch({ type: types.CLEAR_MESSAGES });

    firebase.database().ref(`/chat`).on("value", (snapshot) => {
      dispatch({ type: types.CLEAR_MESSAGES });

      snapshot.forEach((childSnapshot) => {
        console.log('Hey man')
        dispatch({ type: types.CLEAR_MESSAGES });

        var childKey = childSnapshot.key;
        var childData = childSnapshot.val();

        var mapping = _.filter(childData, u => {
          return (u && u.receiver == currentUser.qumraId) || (u && u.sender == currentUser.qumraId)
        })

        var who = (currentUser.qumraId == childData[1].receiver) ? childData[1].sender : childData[1].receiver
        array = [];

        mapping.length > 0 && firebase.database().ref(`/members`).orderByChild("qumraId").equalTo(who).once("child_added", function (ddd) {

          mapping['avatar'] = ddd.val().avatar
          mapping['fullName'] = ddd.val().fullName
          mapping['qumraId'] = ddd.val().qumraId
          array.push(mapping)
          dispatch({ type: types.GROUP_MESSAGES, data: array });

        })

      });
    })
  }
}

export function clear() {
  return dispatch => {
    dispatch({ type: types.CLEAR_MESSAGES });
  }
}
//////////////////////////////////////////////////////////////////////////////////////
sendNotificationImmediately = async (title, description, avatar) => {
  let notificationId = await Notifications.presentLocalNotificationAsync({
    android: { sound: true }, // Make a sound on Android
    ios: { sound: true }, // Make a sound on iOS
    name: 'Qumrapp',
    icon: avatar,
    color: 'green',
    title: title,
    body: description
  });
};