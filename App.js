import './src/common/fixtimerbug'; // <<<<<<<<<<<<<<<<<<

import React from 'react';
import { KeyboardAvoidingView, YellowBox, Platform, StatusBar, StyleSheet, View } from 'react-native';
import { Provider } from 'react-redux';
import { configureStore } from './src/store';
import FlashMessage from "react-native-flash-message";
import firebase from 'firebase';
import Splash from './src/screens/Other/slash';
import * as ROUTER from './src/common/routers';
import * as Font from 'expo-font';
import Test from './src/screens/test';

const store = configureStore();

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

YellowBox.ignoreWarnings([
  'Setting a timer for a long period',
  'Warning: componentWillMount is deprecated',
  'Warning: componentWillReceiveProps is deprecated',
  'Module RCTImageLoader requires',
]);

const MyStatusBar = ({ backgroundColor, ...props }) => (
  <View style={[styles.statusBar, { backgroundColor }]}>
    <StatusBar translucent backgroundColor={backgroundColor} {...props} />
  </View>
);

export default class App extends React.Component {

  constructor() {
    super();
    this.state = {
      loggedIn: -1,
      fontLoaded: false,
    }
  }

  async componentDidMount(){
    await Font.loadAsync({
      'CarinoSans': require('./assets/fonts/OpenSans-Regular.ttf'),
      'CarinoSans-Bold': require('./assets/fonts/OpenSans-Bold.ttf'),
      'CarinoSans-SemiBold': require('./assets/fonts/OpenSans-SemiBold.ttf'),
    });

    this.setState({ fontLoaded: true });

    // firebase.auth().signOut();
  }

  render() {
    const { loggedIn, fontLoaded } = this.state;
    return (
      <Provider store={store}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : null}
          style={{ flex: 1 }}
        >
          <MyStatusBar backgroundColor="#2699FB" barStyle="light-content" />

          { loggedIn == -1 && <Splash onClick={(x)=>this.setState({ loggedIn: x })}/>}
          { loggedIn == 0 && fontLoaded && <ROUTER.AuthPage />}
          { loggedIn == 1 && fontLoaded && <ROUTER.UserPage />}
          { loggedIn == 2 && fontLoaded && <ROUTER.PhotographerPage />}

          <FlashMessage position="bottom" />
          {/* <Test /> */}

        </KeyboardAvoidingView>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  container: {
    flex: 1,
  },
  statusBar: {
    height: 24,
  },
  content: {
    flex: 1,
    backgroundColor: '#2699FB',
  },
});
