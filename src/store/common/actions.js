import * as types from './actionTypes';
import firebase from 'firebase';


export function loadPgs(){
  return async dispatch =>{
    var array = [];
    await firebase.database().ref(`/members`).orderByChild("type").equalTo('pg').on("value",  (snapshot) => {
      array = []
      snapshot.forEach((childSnapshot) => {
        var childKey = childSnapshot.key;
        var childData = childSnapshot.val();
        array.push(childData)
      });
      dispatch({type:types.PUSH_PHOTOGRAPHER, data:array});
    })
  }
}









export function setUser(data){
  return dispatch =>{
    dispatch({type:types.SET_USER, data: data});
  }
}

export function updateUserLocation(lat, lng){
  return dispatch =>{
    currentUser.user.location = {
      latitude: lat, 
      longitude: lng
    }
    firebase.database().ref(`/users/${currentUser.uid}/user/location`).set({
      latitude: lat, 
      longitude: lng
    }, (err)=>{
      dispatch({type:types.UPDATE_USER_LOCATION, data: currentUser});
    })
  }
}

//===================================================================

export function loadPhotographers(){
  return async dispatch =>{
    var array = [];

    await firebase.database().ref(`/members`).once("value",  (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        var childKey = childSnapshot.key;
        var childData = childSnapshot.val();
        array.push(childData.user)
      });
      dispatch({type:types.PUSH_PHOTOGRAPHER, data:array});
    })
  }
}

export function loadUsers(){
  return async dispatch =>{
    var array = [];
    await firebase.database().ref(`/users`).once("value",  (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        var childData = childSnapshot.val();
        array.push(childData.user)
      });
      dispatch({type:types.PUSH_USER, data:array});
    })
  }
}
