import React from 'react';
import { KeyboardAvoidingView, YellowBox } from 'react-native';
import * as ROUTER from './src/common/routers'
import * as FIREBASE from './src/common/config';
import firebase from 'firebase';

YellowBox.ignoreWarnings([
  'Warning: componentWillMount is deprecated',
  'Warning: componentWillReceiveProps is deprecated',
  'Module RCTImageLoader requires',
]);

export default class App extends React.Component {

  componentWillMount() {
    var firebaseConfig = {
      apiKey: FIREBASE.apiKey,
      authDomain: FIREBASE.authDomain,
      databaseURL: FIREBASE.databaseURL,
      projectId: FIREBASE.projectId,
      storageBucket: FIREBASE.storageBucket,
      messagingSenderId: FIREBASE.messagingSenderId,
      appId: FIREBASE.appId
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
      </KeyboardAvoidingView>
    );
  }
}