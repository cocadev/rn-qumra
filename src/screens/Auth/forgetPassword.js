import React, { Component } from 'react';
import { Text, View, TextInput, KeyboardAvoidingView, TouchableOpacity, Image } from 'react-native';
import CustomStyle from '../../common/c_style';
import { ScrollView } from 'react-native-gesture-handler';
import firebase from 'firebase';
import LinearGradient from 'react-native-linear-gradient';
import { images } from '../../common/images';
import { p } from '../../common/normalize';
import Icon from 'react-native-vector-icons/Ionicons';
import { Actions } from 'react-native-router-flux'
import { COLORS } from '../../common/colors';

export default class ForgetPassword extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: ''
    }
  }

  render() {
    return (
      <LinearGradient colors={['#020407', '#2d3e50']} style={{ flex: 1, padding: p(12) }}>

        <ScrollView style={CustomStyle.wrapper}>
          <KeyboardAvoidingView behavior='padding' style={{ flex: 1 }}>

            <TouchableOpacity onPress={() => Actions.pop()}>
              <Icon name="ios-arrow-round-back" color={COLORS.white} size={p(36)} />
            </TouchableOpacity>

            <View style={{ padding: p(1), alignItems: 'center' }}>
              <Image source={images.logo_white} style={{ width: p(240), height: p(60), marginTop: p(30), marginBottom: p(40) }} />
              <Text style={{ color: '#fff', fontSize: p(12), marginBottom: p(6), textAlign: 'center', lineHeight: p(18) }}>
                {'Recover my password'}
              </Text>
            </View>

            <TextInput style={CustomStyle.textInput} placeholder='Email'
              onChangeText={(username) => this.setState({ username })}
              underlineColorAndroid='transparent'
            />

            <LinearGradient
              colors={['#f5565b', '#ad3839']}
              style={{ borderRadius: p(10) }}
            >
              <TouchableOpacity
                style={{
                  alignSelf: 'stretch',
                  padding: p(10),
                  alignItems: 'center',
                  height: p(40),
                  borderRadius: p(10),
                }}
                onPress={this.recoverPasword}>
                <Text style={{ color: 'white', fontSize: p(16) }}> recover my password</Text>
              </TouchableOpacity>
            </LinearGradient>

          </KeyboardAvoidingView>
        </ScrollView>
      </LinearGradient>

    );
  }

  recoverPasword = () => {
    firebase.auth().sendPasswordResetEmail(this.state.username)
      .then(() => {
        this.props.navigation.navigate('Login');
        alert("A recovery link is sent to your email")
      })
      .catch(error => {
        alert("Wrong email", error);
      })
  }
}