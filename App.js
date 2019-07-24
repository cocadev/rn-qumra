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

  async componentWillMount() {
    var firebaseConfig = {
      apiKey: "AIzaSyAfu9DbRD5_PA-9hAhaQhAko0zZQSBcdp0",
      authDomain: "qumra-bd932.firebaseapp.com",
      databaseURL: "https://qumra-bd932.firebaseio.com",
      projectId: "qumra-bd932",
      storageBucket: "qumra-bd932.appspot.com",
      messagingSenderId: "240259766392",
      appId: "1:240259766392:web:2b82fe46610c413a"
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