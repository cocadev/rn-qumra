import React, { Component } from 'react';
import { Text, View, TextInput, KeyboardAvoidingView, TouchableOpacity, AsyncStorage, ScrollView, Image } from 'react-native';
import CustomStyle from '../../common/c_style';
import firebase from 'firebase';
import Icon from 'react-native-vector-icons/Ionicons';
import DatePicker from 'react-native-datepicker'
import firebaseAPI from '../../common/firebaseAPI';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { p } from '../../common/normalize';
import { images } from '../../common/images';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../common/colors';
import { Actions } from 'react-native-router-flux';
import { showMessage } from "react-native-flash-message";
import * as ATOM from '../../components/atoms';
import * as actions from "../../store/auth/actions";
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';

class SignUp extends Component {

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: 'a@a.io',
      password: '123123',
      isWaiting: false,
      fullName: '',
      startDate: new Date(),
      latitude: 0,
      longitude: 0
    }
  }

  componentDidMount() {
    this.getLocation()
  }

  hasLocationPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status === 'granted') {
      const location = await Location.getCurrentPositionAsync({
        enableHighAccuracy: true,
      });
      return location;
    }
  }

  getLocation = async () => {
    const hasLocationPermission = await this.hasLocationPermission();

    if (!hasLocationPermission) return;

    this.setState({ loading: true }, () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.setState({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          this.setState({ location: error });
          console.log(error);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000, distanceFilter: 50, forceRequestLocation: true }
      );
    });
  }

  _loadInitialState = async () => {
    var value = await AsyncStorage.getItem('user');
    if (value !== null) {
      this.props.navigation.navigate('Map');
    }
  }
  takePicture = async () => {
    if (this.camera) {
      const options = { quality: 0.5, base64: true };
      const data = await this.camera.takePictureAsync(options);
    }
  };

  render() {

    const { isWaiting } = this.state

    return (
      <LinearGradient colors={['#020407', '#2d3e50']} style={{ flex: 1 }}>

        {isWaiting && <ATOM.Loading />}

        <ScrollView style={CustomStyle.wrapper}>

          <KeyboardAvoidingView behavior='padding' style={{ padding: p(12) }}>

            <TouchableOpacity onPress={() => Actions.pop()}>
              <Icon name="ios-arrow-round-back" color={COLORS.white} size={p(36)} />
            </TouchableOpacity>

            <View style={{ padding: p(1), alignItems: 'center' }}>
              <Image source={images.logo_full} style={{ width: p(200), height: p(60), marginTop: p(10), marginBottom: p(40) }} />
              <Text style={{ color: '#fff', fontSize: p(15), marginBottom: p(10), textAlign: 'center', lineHeight: p(18), fontFamily: 'CarinoSans' }}>
                {'Welcome to qumra!\nSign Up to continue'}
              </Text>
            </View>
            <Text style={{ color: 'white', padding: 5, fontSize: 14, fontFamily: 'CarinoSans' }}>Full Name</Text>
            <TextInput
              style={CustomStyle.textInput}
              placeholder='fullName'
              placeholderTextColor={COLORS.light_color}
              autoCapitalize={'none'}
              autoCorrect={false}
              onChangeText={(fullName) => this.setState({ fullName })}
              value={this.state.fullName}
              underlineColorAndroid='transparent'
            />
            <Text style={{ color: 'white', padding: 5, fontSize: 14, fontFamily: 'CarinoSans' }}>Birthday</Text>
            <DatePicker
              style={{ width: '100%', borderRadius: 7, borderWidth: 0, backgroundColor: 'rgba(255,255,255,0.1)' }}
              date={this.state.startDate}
              mode="date"
              placeholder=""
              format="YYYY-MM-DD"
              minDate="1900-01-01"
              maxDate="2020-06-01"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              showIcon={false}
              customStyles={{
                dateInput: {
                  // backgroundColor:'green',
                  borderRadius: 7,
                  color: 'white',
                  alignItems: 'flex-start',
                  fontColor: 'white',
                  borderWidth: 0,
                  backgroundColor: '',
                  marginLeft: 7,
                },
                dateText: {
                  color: 'white',
                  fontFamily: 'CarinoSans'
                }
              }}
              onDateChange={(date) => {
                this.setState({ startDate: date })
              }}
            />
            <View style={{ height: 15 }}></View>



            <Text style={{ color: 'white', padding: 5, fontSize: 14, fontFamily: 'CarinoSans' }}>Email</Text>
            <TextInput
              style={CustomStyle.textInput}
              placeholder='Email'
              placeholderTextColor={COLORS.light_color}
              autoCapitalize={'none'}
              autoCorrect={false}
              onChangeText={(email) => this.setState({ email })}
              value={this.state.email}
              underlineColorAndroid='transparent'
            />
            <Text style={{ color: 'white', padding: 5, fontSize: 14, fontFamily: 'CarinoSans' }}>Password</Text>
            <TextInput
              style={CustomStyle.textInput}
              placeholder='Password'
              placeholderTextColor={COLORS.light_color}
              autoCapitalize={'none'}
              autoCorrect={false}
              secureTextEntry={true}
              onChangeText={(password) => this.setState({ password })}
              value={this.state.password}
              underlineColorAndroid='transparent'
            //32
            />
            <TouchableOpacity
              style={CustomStyle.btn}
              onPress={this.signup}>
              <Text style={{ color: '#2d3e50', fontSize: p(17), fontFamily: 'CarinoSans-Bold' }}> Sign Up</Text>
            </TouchableOpacity>

            <View style={{ flexDirection: 'row', paddingTop: p(10) }}>
              <Text style={{ color: '#fff', fontSize: p(11), marginRight: 4, fontFamily: 'CarinoSans' }}> By signing up, you agree to our</Text>
              <TouchableOpacity onPress={() => Actions.privacypolicy()}>
                <Text style={{ color: '#f5565b', fontSize: p(11), fontFamily: 'CarinoSans' }}>
                  Terms and Privacy Policy
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => Actions.pgsignup()}
              style={{ marginTop: p(10) }}>
              <View style={CustomStyle.SignUp}>
                <Text style={{ color: 'white', fontSize: p(17), fontFamily: 'CarinoSans-Bold' }}> Sign Up as a Photographer </Text>
              </View>
            </TouchableOpacity>

            <View style={{ paddingTop: p(12) }}>
              <Text style={{ color: '#fff', fontSize: p(13), marginBottom: p(6), textAlign: 'center', fontFamily: 'CarinoSans' }}>
                Have a fancy camera? Sign Up today and make money!
                </Text>
            </View>

          </KeyboardAvoidingView>

        </ScrollView>

      </LinearGradient>
    );
  }

  onPhotographerSignUpPressed = () => {
    this.props.navigation.navigate("PhotographerRegistration")
  }

  signup = () => {
    const { startDate, email, fullName, password, latitude, longitude } = this.state
    this.setState({ isWaiting: true })
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ isWaiting: false })
        firebaseAPI.userSignUp(fullName, email, startDate, latitude, longitude)
          .then((res) => {
            this.props.actions.setUser(res)
          })
      }
      )
      .catch(error => {
        this.setState({ isWaiting: false })
        showMessage({
          message: "Fail SignUp",
          description: error.message,
          type: "danger",
          icon: "danger"
        });
      })
  }
}

export default connect(
  state => ({
    reduxUser: state.auth.reduxUser
  }),
  dispatch => ({
    actions: bindActionCreators(actions, dispatch),
  })
)(SignUp);

