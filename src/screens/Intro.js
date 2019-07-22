import React from 'react';
import { View, Text, TouchableOpacity  } from 'react-native';
import { Actions } from 'react-native-router-flux';


export default class Intro extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'brown', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => Actions.drawerOpen()}>
          <Text style={{ fontSize: 50, color: '#fff'}}>Drawers</Text>
        </TouchableOpacity>
      </View>
    );
  }
}