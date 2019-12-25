
import React, { Component } from 'react';
import { Text } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

export default class Contact extends Component {
  render() {
    return (

      <ScrollView>

        <Text>
          {'Terms of Service \
Please read these Terms of Service (“Terms”){"\n"} carefully as they contain important information about your legal rights, remedies and obligations. \
{"\n"}By accessing or using the Airbnb Platform, you agree to comply with and be bound by these Terms.'}
          
</Text>
      </ScrollView>


    );
  }
}