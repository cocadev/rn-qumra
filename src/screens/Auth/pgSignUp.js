import React, { Component } from 'react';
import { Text, View, TextInput, KeyboardAvoidingView, TouchableOpacity, AsyncStorage, ScrollView, Image } from 'react-native';
import CustomStyle from '../../common/c_style';
import firebase from 'firebase';
import DatePicker from 'react-native-datepicker'
import firebaseAPI from '../../common/firebaseAPI';
import Icon from 'react-native-vector-icons/Ionicons';
import { p } from '../../common/normalize';
import { images } from '../../common/images';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../common/colors';
import { Actions } from 'react-native-router-flux';
import { showMessage } from "react-native-flash-message";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as actions from "../../store/auth/actions";
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import * as ATOM from '../../components/atoms';


class PgSignUp extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: 'invoker@x.io',
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
          // console.log(position);
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

            <View style={{ padding: p(1), alignItems: 'center', marginBottom: p(10) }}>
              <Image source={images.logo_white} style={{ width: p(200), height: p(50), marginTop: p(10), marginBottom: p(40) }} />
              <Text style={{ color: '#fff', fontSize: p(14), marginBottom: p(6), textAlign: 'center', lineHeight: p(18), fontFamily: 'CarinoSans' }}>
                {'Welcome to qumra for photographer!\nSign Up to continue'}
              </Text>
            </View>

            <Text style={{ color: 'white', padding: 5, fontSize: 14, fontFamily: 'CarinoSans' }}>Full Name</Text>
            <TextInput
              style={CustomStyle.textInput}
              placeholder='fullName'
              placeholderTextColor={COLORS.grey_color}
              autoCapitalize={'none'}
              autoCorrect={false}
              onChangeText={(fullName) => this.setState({ fullName })}
              value={this.state.fullName}
              underlineColorAndroid='transparent'
            />
            <Text style={{ color: 'white', padding: 5, fontSize: 14, fontFamily: 'CarinoSans' }}>Birthday</Text>
            <DatePicker
              style={{ width: '100%', borderRadius: 7, borderWidth: 0, backgroundColor: 'rgba(255,255,255,0.1)', marginBottom: p(10) }}
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
                  borderRadius: 7,
                  color: 'white',
                  alignItems: 'flex-start',
                  fontColor: 'white',
                  borderWidth: 0,
                  backgroundColor: '',
                  marginLeft: 7

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
            <Text style={{ color: 'white', padding: 5, fontSize: 14, fontFamily: 'CarinoSans' }}>Email</Text>

            <TextInput
              style={CustomStyle.textInput}
              placeholder='Email'
              placeholderTextColor={COLORS.white}
              onChangeText={(email) => this.setState({ email })}
              value={this.state.email}
              underlineColorAndroid='transparent'
            />
            <Text style={{ color: 'white', padding: 5, fontSize: 14, fontFamily: 'CarinoSans' }}>Password</Text>

            <TextInput
              style={CustomStyle.textInput}
              placeholder='Password'
              placeholderTextColor={COLORS.white}
              secureTextEntry={true}
              onChangeText={(password) => this.setState({ password })}
              value={this.state.password}
              underlineColorAndroid='transparent'
            />

            <TouchableOpacity
              style={CustomStyle.btn}
              onPress={this.signup}>
              <Text style={{ color: '#2d3e50', fontSize: p(17), fontFamily: 'CarinoSans-Bold' }}> Sign Up</Text>
            </TouchableOpacity>

            <View style={{ flexDirection: 'column', paddingTop: p(10), alignItems: 'center', justifyContent: 'center', marginVertical: p(12) }}>
              <Text style={{ color: '#fff', fontSize: p(13), marginRight: 4, fontFamily: 'CarinoSans' }}> By sign up, you agree to our</Text>
              <TouchableOpacity onPress={() => Actions.pgprivacypolicy()} >
                <Text style={{ color: '#f5565b', fontSize: p(13), fontFamily: 'CarinoSans' }}>Terms and Privacy Policy
                   </Text>
              </TouchableOpacity>
            </View>

          </KeyboardAvoidingView>

        </ScrollView>

      </LinearGradient>

    );
  }

  signup = () => {

    this.setState({ isWaiting: true })
    const { email, fullName, startDate, password, latitude, longitude } = this.state

    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ isWaiting: false })
        firebaseAPI.pgSignUp(email, fullName, startDate, latitude, longitude)
          .then((res) => {
            this.props.actions.setUser(res)
          })
      })
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
)(PgSignUp);
