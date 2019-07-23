import React from 'react';
import { KeyboardAvoidingView, YellowBox } from 'react-native';
import * as ROUTER from './src/common/routers'
import FlashMessage from "react-native-flash-message";
import firebase from 'firebase';

YellowBox.ignoreWarnings([
  'Warning: componentWillMount is deprecated',
  'Warning: componentWillReceiveProps is deprecated',
  'Module RCTImageLoader requires',
]);

export default class App extends React.Component {

  componentWillMount() {
    var firebaseConfig = {
      apiKey: "AIzaSyC7M_lLl-oicpvSsCPQ7sDNa3yO3H57TZk",
      authDomain: "qumradev.firebaseapp.com",
      databaseURL: "https://qumradev.firebaseio.com",
      projectId: "qumradev",
      storageBucket: "qumradev.appspot.com",
      messagingSenderId: "148167353022",
      appId: "1:148167353022:web:bc45b8add6765cc5"
    };
    firebase.initializeApp(firebaseConfig);
  }

  render() {
    return (
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        style={{ flex: 1 }}
      >
        <ROUTER.MainPage />
        <FlashMessage position="bottom" />

      </KeyboardAvoidingView>
    );
  }
}