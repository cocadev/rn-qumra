import React from 'react';
import { KeyboardAvoidingView, YellowBox } from 'react-native';
import * as ROUTER from './src/common/routers'

YellowBox.ignoreWarnings([
  'Warning: componentWillMount is deprecated',
  'Warning: componentWillReceiveProps is deprecated',
  'Module RCTImageLoader requires',
]);

export default class App extends React.Component {
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