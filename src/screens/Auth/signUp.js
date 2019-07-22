import React, { Component } from 'react';
import { Text, View, TextInput, KeyboardAvoidingView, TouchableOpacity, AsyncStorage, ScrollView, Image } from 'react-native';
import CustomStyle from '../../common/c_style';
import firebase from 'firebase';
import { p } from '../../common/normalize';
import { images } from '../../common/images';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS } from '../../common/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import { Actions } from 'react-native-router-flux';

export default class SignUp extends Component {

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      password: '',
    }
  }

  _loadInitialState = async () => {
    var value = await AsyncStorage.getItem('user');
    if (value !== null) {
      this.props.navigation.navigate('Map');
    }
  }

  render() {
    return (
      <LinearGradient colors={['#020407', '#2d3e50']} style={{ flex: 1 }}>
        <ScrollView>
          <KeyboardAvoidingView behavior='padding' style={CustomStyle.wrapper}>

            <View style={{ padding: p(12) }}>

              <TouchableOpacity onPress={() => Actions.pop()}>
                <Icon name="ios-arrow-round-back" color={COLORS.white} size={p(36)} />
              </TouchableOpacity>

              <View style={{ padding: p(1), alignItems: 'center' }}>
                <Image source={images.logo_full} style={{ width: p(200), height: p(60), marginTop: p(10), marginBottom: p(40) }} />
                <Text style={{ color: '#fff', fontSize: p(12), marginBottom: p(6), textAlign: 'center', lineHeight: p(18) }}>
                  {'Welcome to qumra!\nSign Up to continue'}
                </Text>
              </View>

              <TextInput
                style={CustomStyle.textInput}
                placeholder='Email'
                placeholderTextColor='#FFF'
                onChangeText={(email) => this.setState({ email })}
                underlineColorAndroid='transparent'
              />

              <TextInput
                style={CustomStyle.textInput}
                placeholder='Password'
                placeholderTextColor='#FFF'
                secureTextEntry={true}
                onChangeText={(password) => this.setState({ password })}
                underlineColorAndroid='transparent'
              />

              <TouchableOpacity
                style={CustomStyle.btn}
                onPress={this.signup}>
                <Text style={{ color: '#2d3e50', fontWeight: 'bold', fontSize: p(17) }}> Sign Up</Text>
              </TouchableOpacity>

              <View style={{ flexDirection: 'row', paddingTop: p(10), justifyContent: 'space-between' }}>
                <Text style={{ color: '#fff', fontSize: p(14) }}> By signing up, you agree to our</Text>
                <TouchableOpacity onPress={this.onTermsPrivacyPressed}>
                  <Text style={{ color: '#f5565b', fontSize: p(14) }}>Terms and Privacy Policy
                     </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={this.onPhotographerSignUpPressed}
                style={{ marginTop: p(90) }}
              >
                <View style={CustomStyle.SignUp}>
                  <Text style={{ color: 'white', fontSize: p(17) }}> Sign Up with your Phone number </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={this.onPhotographerLoginPress}
                style={{ marginTop: p(10) }}>
                <View style={CustomStyle.SignUp}>
                  <Text style={{ color: 'white', fontSize: p(17) }}> Sign Up as a Photographer </Text>
                </View>
              </TouchableOpacity>

              <View style={{ paddingTop: p(12) }}>
                <Text style={{ color: '#fff', fontSize: p(14), marginBottom: p(6), textAlign: 'center' }}>
                  Have a fancy camera? Sign Up today and make money!
                </Text>
              </View>

            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      </LinearGradient>
    );
  }

  onPhotographerSignUpPressed = () => {
    this.props.navigation.navigate("PhotographerRegistration")
  }

  onTermsPrivacyPressed = () => {
    this.props.navigation.navigate("PrivacyPolicy")
  }

  signup = () => {
    firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(user => {
        alert("successfuly registered! ", user)
        this.props.navigation.navigate("UserProfile")
      }
      )
  }
}

