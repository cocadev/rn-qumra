import React, { Component } from 'react';
import { Text, View, TextInput, TouchableOpacity, Modal, KeyboardAvoidingView, Image } from 'react-native';
import WebView from 'react-native-webview';
import url from 'url';
import CustomStyle from '../../common/c_style';
import Icon from 'react-native-vector-icons/Ionicons';
import firebase from 'firebase';
import { LinearGradient } from 'expo-linear-gradient';
import { images } from '../../common/images';
import { p } from '../../common/normalize';
import { Actions } from 'react-native-router-flux'
import { COLORS } from '../../common/colors';
import * as ATOM from '../../components/atoms';

const captchaUrl = `https://qumradev.firebaseapp.com/Captcha.html`// link to your captcha.html

export default class PgPhonenumber extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      codeIsSent: false,
      input_value: '8615541961371',
      confirmation: {},
      errorMessage: "",
      myphone: ""
    }
  }

  _handleResponse = data => {

    let query = url.parse(data.url, true).query;

    if (query.hasOwnProperty('token')) {
      this._sendConfirmationCode(query.token);
    } else if (query.hasOwnProperty('cancel')) {
      this.setState({ showModal: false });
    }
  }

  _signUp = () => {
    if (this.state.codeIsSent) {
      this._confirmCode();
    } else {
      this.setState({
        showModal: true
      })
    }
  }

  _sendConfirmationCode = (captchaToken) => {
    this.setState({ showModal: false });
    let number = `+${this.state.input_value}`;
    const captchaVerifier = {
      type: 'recaptcha',
      verify: () => Promise.resolve(captchaToken)
    }
    firebase.auth().signInWithPhoneNumber(number, captchaVerifier)
      .then((confirmation) => {
        this.setState({ confirmation, myphone: number, codeIsSent: true, input_value: "", errorMessage: "" })
      })
      .catch((err) => {
        alert(JSON.stringify(err))
        this.setState({ errorMessage: "Oops! something is wrong" });
      });
  }

  _confirmCode = () => {
    this.state.confirmation.confirm(this.state.input_value)
      .then((result) => {
        this.setState({ isAuthenticated: true });
        result.additionalUserInfo.isNewUser && this.onLoginSuccess();
      })
      .catch((err) => {
        this.setState({ errorMessage: "Oops! something is wrong" });
      });
  }

  renderCaptchScreen = () => {
    return (
      <View style={{ marginTop: 100 }}>
        <Modal
          visible={this.state.showModal}
          onRequestClose={() => this.setState({ showModal: false })}
        >
          <WebView
            source={{ uri: captchaUrl }}
            onNavigationStateChange={data =>
              this._handleResponse(data)
            }
            injectedJavaScript={`document.f1.submit()`}
          />
        </Modal>
      </View>
    )
  }

  onLoginSuccess = () => {
    const { currentUser } = firebase.auth();
    currentUser.updateProfile({
      displayName: "photographer"
    }).then(function () {
      // console.log("Updated");
    }, function (error) {
      console.log("Error happened");
    });


    firebase.database().ref(`/photographers/${currentUser.uid}/language`).once("value", snapshot => {

      const UserDetails = {
        id: currentUser.uid,
        fullName: 'Photographer',
        phoneNumber: this.state.myphone,
        email: '',
        location: {
          latitude: null,
          longitude: null
        },
        img: 'https://www.sovereignsolutionscorp.com/wp-content/uploads/2018/12/img-avatar-blank.jpg',
      }

      firebase.database().ref(`/photographers/${currentUser.uid}`)
        .update({
          type: 'photographer',
          user: UserDetails,
          reviews: '',
          rating: 0,
          payment: 0,
          orders: ''
        });
    }
    ).catch(e => alert(e))
  }

  render() {

    return (
      <LinearGradient colors={['#020407', '#2d3e50']} style={{ flex: 1, padding: p(12) }}>

        {this.state.isWaiting && <ATOM.Loading />}

        <View style={CustomStyle.wrapper}>
          <KeyboardAvoidingView behavior='padding' style={{ flex: 1 }}>

            <TouchableOpacity onPress={() => Actions.pop()}>
              <Icon name="ios-arrow-round-back" color={COLORS.white} size={p(36)} />
            </TouchableOpacity>

            <View style={{ padding: p(1), alignItems: 'center', marginBottom: p(10) }}>
              <Image source={images.logo_white} style={{ width: p(240), height: p(60), marginTop: p(30), marginBottom: p(40) }} />
              <Text style={{ color: '#fff', fontSize: p(14), marginBottom: p(6), textAlign: 'center', lineHeight: p(18) }}>
                {this.state.codeIsSent ? 'Confirmation Code' : 'Phone Number'}
              </Text>
            </View>

            <TextInput
              style={CustomStyle.textInput}
              placeholder={this.state.codeIsSent ? 'Confirmation Code' : 'Phone Number'}
              placeholderTextColor={'#a9a9a9'}
              keyboardType={'numeric'}
              value={this.state.input_value}
              onChangeText={input_value => this.setState({ input_value })}
            >
            </TextInput>

            <LinearGradient
              colors={['#f5565b', '#ad3839']}
              style={{ borderRadius: p(10) }}
            >
              <TouchableOpacity
                style={{
                  alignSelf: 'stretch',
                  padding: p(10),
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: p(35),
                  borderRadius: p(10),
                }}
                onPress={this._signUp}
              >
                <Text style={{ color: 'white', fontSize: p(16) }}> {'Continue'}</Text>
              </TouchableOpacity>
            </LinearGradient>

            {
              this.state.errorMessage ?
                <View>
                  <Text style={{ color: COLORS.red_color }}>{this.state.errorMessage}</Text>
                </View>
                : null
            }

            {this.renderCaptchScreen()}


          </KeyboardAvoidingView>
        </View>
      </LinearGradient>

    );
  }
}