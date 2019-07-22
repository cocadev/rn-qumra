import React from 'react';
import { View, Text, TouchableOpacity, YellowBox  } from 'react-native';
import { Actions } from 'react-native-router-flux';


export default class Intro extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'brown', alignItems: 'center' }}>
        <TouchableOpacity onClick={() => Actions.drawerOpen()}>
          <Text style={{ fontSize: 50, color: '#fff'}}>Drawer</Text>
        </TouchableOpacity>
      </View>
    );
  }
}