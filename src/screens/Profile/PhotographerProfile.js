import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, KeyboardAvoidingView, ScrollView, PermissionsAndroid, Platform } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { p } from '../../common/normalize';
import { COLORS } from '../../common/colors';
import { showMessage } from "react-native-flash-message";
import { Loading } from '../../components/atoms';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import firebase from 'firebase';
import Icon from 'react-native-vector-icons/Ionicons';
import Constants from 'expo-constants';
import StarRating from 'react-native-star-rating';
import ToggleSwitch from 'toggle-switch-react-native';
import ValidationService from '../../common/validation';
import * as actions from "../../store/auth/actions";
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import _ from 'underscore'
import { images } from '../../common/images';
import firebaseAPI from '../../common/firebaseAPI';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

class PhotographerProfile extends Component {

  constructor(props) {
    super(props);
    this.state = {
      fullname: '',
      summary: '',
      filePath: '',
      rate: 20,
      turnOn: false,
      latitude: 0,
      longitude: 0,
      male: 0,
      photos: null,
      reviews: null,
      isWaiting: false,
      availbility: '',
      profilePics: []
    }
    this.updateLocation = this.updateLocation.bind(this)
  };

  componentDidMount() {
    const user = this.props.reduxUser
    this.getPermissionAsync();
    this.setState({
      fullname: user.fullName,
      filePath: user.avatar,
      rate: user.rate.toString(),
      male: user.male,
      summary: user.summary,
      photos: user && user.photos && user.photos.toString(),
      reviews: user && user.reviews && user.reviews.length,
      turnOn: user.turnOn,
      latitude: user.location.split(",", 2)[0],
      longitude: user.location.split(",", 2)[1],
      availbility: user.availbility,
    })

    if (user && user.myProfilePics) {
      x = user.myProfilePics;
      var filterd = []

      Object.keys(user.myProfilePics).map(function (_) {
        filterd.push(user.myProfilePics[_])
      })
      if (filterd !== []) {
        this.setState({ profilePics: filterd })
      }
    }
  }

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  }

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.cancelled) {
      this.setState({ filePath: result.uri });
    }
  };

  _addImage = async () => {

    if (this.state.profilePics.length == 10) {
      showMessage({
        message: "Fail",
        description: "Max image limited to 10",
        type: "danger",
        icon: "danger"
      });
      return false
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.cancelled) {
      var joined = this.state.profilePics.concat(result.uri);
      this.setState({ profilePics: joined })
    }
  };

  hasLocationPermission = async () => {
    if (Platform.OS === 'ios' ||
      (Platform.OS === 'android' && Platform.Version < 23)) {
      return true;
    }

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );

    if (hasPermission) return true;

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED) return true;

    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show('Location permission denied by user.', ToastAndroid.LONG);
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show('Location permission revoked by user.', ToastAndroid.LONG);
    }
    return false;
  }

  chooseFile = () => {
    var options = {
      title: 'Select Image',
      customButtons: [
        { name: 'customOptionKey', title: 'Choose Photo from Custom Option' },
      ],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
      } else if (response.error) {
      } else if (response.customButton) {
      } else {
        this.setState({
          filePath: response.uri,
        });
      }
    });
  };

  getLocation = async () => {
    const hasLocationPermission = await this.hasLocationPermission();

    if (!hasLocationPermission) return;

    this.setState({ loading: true }, () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.setState({
            loading: false,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          this.updateLocation()
        },
        (error) => {
          this.setState({ location: error, loading: false });
          console.log(error);
          alert(JSON.stringify(error))

        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000, distanceFilter: 50, forceRequestLocation: true }
      );
    });
  }

  render() {
    const { summary, male, fullname, rate, isWaiting, backImg, photos, reviews, turnOn, latitude, longitude, availbility, profilePics } = this.state
    return (
      <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#EEE8E7' }} enabled behavior='padding'>

        {isWaiting && <Loading />}

        <ScrollView>

          <View style={{ backgroundColor: COLORS.dark_color }}>
            <Image source={images.bg_photographer} style={{ width: width, height: p(130) }} />
          </View>

          <TouchableOpacity
            style={{ position: 'absolute', top: p(12), left: p(12) }}
            onPress={() => this.props.navigation.openDrawer()}
          >
            <Icon name='md-menu' size={p(30)} color={COLORS.white} />
          </TouchableOpacity>
          <View>

            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: p(-60) }}>
              <TouchableOpacity
                onPress={() => this._pickImage()}
              >
                <Image
                  style={styles.avatar}
                  source={(this.state.filePath == '' || this.state.filePath == null) ? require('../../../assets/image/manplace.jpg') : {
                    uri: this.state.filePath,
                  }} />
              </TouchableOpacity>
            </View>

            <View style={{ width: p(100), alignSelf: 'center' }}>
              <StarRating
                disabled={true}
                emptyStar={'ios-star-outline'}
                fullStar={'ios-star'}
                halfStar={'ios-star-half'}
                iconSet={'Ionicons'}
                maxStars={5}
                starStyle={{ paddingHorizontal: 1, marginHorizontal: 1, marginLeft: p(-1) }}
                starSize={p(25)}
                rating={0}
                fullStarColor={'#fcb040'}
              />

            </View>

            <View style={styles.item}>
              <View style={{ flex: 1, alignItems: 'center' }}>

                <Text style={styles.titleText}>0</Text>

                <View>
                  <Text style={styles.titleText}>{"Places"}</Text>
                </View>

              </View>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Text style={styles.titleText}>{photos ? photos : 0}</Text>
                <Text style={styles.titleText}>{'Photos'}</Text>
              </View>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Text style={styles.titleText}>{reviews ? reviews : 0}</Text>
                <Text style={styles.titleText}>{'Reviews'}</Text>
              </View>
            </View>

            <View style={styles.body}>

              <View style={{ flexDirection: 'row', padding: p(12) }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.titleText}>Full Name</Text>
                  <TextInput
                    style={styles.textinput}
                    onChangeText={(fullname) => this.setState({ fullname })}
                    value={fullname}
                  />
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'flex-end', flex: 1 }}>
                  <TouchableOpacity onPress={() => this.setState({ male: 0 })}>
                    <Icon
                      name="ios-man"
                      color={male == 0 ? COLORS.sky_color : COLORS.dark_color}
                      size={male == 0 ? p(26) : p(16)}
                      style={{ marginRight: p(20) }}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => this.setState({ male: 1 })}>
                    <Icon
                      name="ios-woman"
                      color={male == 1 ? COLORS.sky_color : COLORS.dark_color}
                      size={male == 1 ? p(26) : p(16)}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => this.setState({ male: 2 })}>
                    <Text style={{ fontSize: male == 2 ? p(20) : p(14), marginLeft: p(16), color: male == 2 ? COLORS.sky_color : COLORS.dark_color, fontFamily: 'CarinoSans-Bold' }}>NA</Text>
                  </TouchableOpacity>
                </View>

              </View>

              <View style={{ paddingHorizontal: p(12) }}>
                <Text style={styles.titleText}>Summary</Text>
                <TextInput
                  style={styles.textarea}
                  multiline
                  textAlignVertical={'top'}
                  onChangeText={(summary) => this.setState({ summary })}
                  underlineColorAndroid='transparent'
                  value={summary}
                />
              </View>

              <View style={{ alignSelf: 'center', marginTop: p(22) }}>
                <Text style={[styles.titleText, { textAlign: 'center' }]}>Upload some previous art</Text>
                <Text style={[styles.titleText, { color: COLORS.red_color, fontFamily: 'CarinoSans-Bold', fontSize: p(10) }]}>(this will help users pick you over others)</Text>
                <TouchableOpacity
                  style={styles.btnUpload}
                  onPress={() => this._addImage()}
                >
                  <Text style={{ color: '#fff', fontSize: p(13), fontFamily: 'CarinoSans-Bold' }}>Upload</Text>
                </TouchableOpacity>
              </View>

              <ScrollView horizontal>
                {
                  profilePics !== [] && profilePics.map((item, index) =>
                    <View key={index}>

                      <Image source={{ uri: item }} style={styles.imgProfile} />
                      <TouchableOpacity
                        style={styles.closeIcon}
                        onPress={() => {
                          var array = profilePics
                          array.splice(index, 1);
                          this.setState({ profilePics: array })
                        }}
                      >
                        <Icon name='ios-close-circle-outline' size={p(20)} color={COLORS.light_color} />
                      </TouchableOpacity>
                    </View>
                  )
                }
              </ScrollView>

              <View style={{ flexDirection: 'row', marginTop: p(20) }}>
                <View style={{ flex: 1, alignItems: 'center', }}>
                  <Text style={styles.titleText}>Your Photo Rate</Text>
                  <TextInput
                    style={styles.textinput}
                    keyboardType={'numeric'}
                    onChangeText={(rate) => this.setState({ rate })}
                    underlineColorAndroid='transparent'
                    value={rate}
                  />
                </View>
                <View style={{ flex: 1, alignItems: 'center', }}>
                  <Text style={styles.titleText}>Availbility</Text>
                  <TextInput
                    style={styles.textinput}
                    onChangeText={(availbility) => this.setState({ availbility })}
                    underlineColorAndroid='transparent'
                    value={availbility}
                  />
                </View>

              </View>

              <View style={{ flex: 1, alignItems: 'center', marginVertical: p(20) }}>
                <Text style={[styles.titleText, { marginBottom: p(10) }]}>Turn your location on</Text>
                <ToggleSwitch
                  isOn={this.state.turnOn}
                  onColor='#2699FB'
                  offColor='#555'
                  size='small'
                  onToggle={(turnOn) => {
                    this.setState({ turnOn: !this.state.turnOn });
                    if (turnOn) {
                      this.getLocation()
                    }
                  }}
                />

              </View>

              <TouchableOpacity style={styles.buttonContainer} onPress={this.onChangePressed}>
                <Text style={{ color: '#fff', fontSize: p(13), fontFamily: 'CarinoSans-Bold' }}>Save Changes</Text>
              </TouchableOpacity>

            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView >
    );
  }

  onChangePressed = async () => {

    const { summary, fullname, rate, male, turnOn, availbility, profilePics, filePath } = this.state
    const uid = this.props.reduxUser.id
    var uploadResult = null
    var myProfilePics = []

    if (ValidationService.updatePhotographer(fullname, summary, rate, availbility, turnOn)) {
      return false
    }

    this.setState({ isWaiting: true })

    for (let i = 0; i < profilePics.length; i++) {
      if (profilePics[i].substring(0, 1) == 'f') {
        myProfilePics[i] = await uploadImageAsync(profilePics[i], uid + i)
      } else {
        myProfilePics[i] = profilePics[i]
      }
    }

    if (filePath) {

      if (filePath.substring(0, 1) == 'f') {
        uploadResult = await uploadImageAsync(filePath, uid);
      } else {
        uploadResult = filePath
      }

      if (typeof uploadResult == 'string') { }

    }

    firebaseAPI.pgUpdate(summary, fullname, rate, male, turnOn, availbility, uploadResult, myProfilePics)
      .then((res) => {
        this.setState({ isWaiting: false })
        this.props.actions.updatePhotographer(summary, fullname, rate, male, turnOn, uploadResult, availbility, myProfilePics)

      })
      .catch(e => console.log('* e *', e))

  }

  updateLocation() {

    const uid = this.props.reduxUser.id;
    this.setState({ isWaiting: true })
    firebase.database().ref(`/photographers/${uid}/user/location`)
      .update({
        latitude: this.state.latitude,
        longitude: this.state.longitude,
      })
      .then((res) => {
        console.log('res==>', res)
        this.setState({
          location: {
            latitude: this.state.latitude,
            longitude: this.state.longitude
          }
        })
        showMessage({ message: "Success Upload Current Location", description: "Great", type: "success", icon: "success" });
        this.setState({ isWaiting: false })
      })
      .catch(error => {
        showMessage({ message: "Fail Upload Current Location", description: error.message, type: "danger", icon: "danger" });
        this.setState({ isWaiting: false })

      })
  }
}

async function uploadImageAsync(uri, uid) {

  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function (e) {
      console.log(e);
      reject(new TypeError('Network request failed'));
    };
    xhr.responseType = 'blob';
    xhr.open('GET', uri, true);
    xhr.send(null);
  });

  const ref = firebase.storage().ref().child(`/images/${uid}`);
  const snapshot = await ref.put(blob);

  blob.close();
  return await snapshot.ref.getDownloadURL();
}

export default connect(
  state => ({
    reduxUser: state.auth.reduxUser
  }),
  dispatch => ({
    actions: bindActionCreators(actions, dispatch),
  })
)(PhotographerProfile);


const styles = StyleSheet.create({

  avatar: {
    width: p(110),
    height: p(110),
    borderRadius: p(56),
    borderWidth: p(4),
    borderColor: "#fff",
    marginBottom: p(10),
    marginTop: p(10)
  },

  body: {
    marginTop: p(5),
  },

  bodyContent: {
    flex: 1,
    padding: p(16),
  },

  buttonContainer: {
    alignSelf: 'center',
    marginTop: p(10),
    height: p(27),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: p(20),
    width: p(150),
    borderRadius: p(10),
    backgroundColor: COLORS.red_color,
  },

  btnUpload: {
    alignSelf: 'center',
    height: p(20),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: p(100),
    borderRadius: p(4),
    marginTop: p(5),
    backgroundColor: COLORS.light_color,
    marginTop: p(12)
  },

  UploadPictureContainer: {
    marginTop: p(10),
    height: p(45),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: p(20),
    width: p(150),
    borderRadius: p(15),
    backgroundColor: "#00BFFF",
  },

  item: {
    flexDirection: 'row',
    borderBottomColor: COLORS.light_color,
    borderBottomWidth: p(2),
    paddingVertical: p(10),
  },
  textinput: {
    width: p(100),
    padding: p(6),
    fontSize: p(14),
    borderColor: 'gray',
    fontFamily: 'CarinoSans',
    borderWidth: 1
  },
  textarea: {
    fontSize: p(16),
    borderRadius: p(3),
    height: p(100),
    borderColor: 'gray',
    fontFamily: 'CarinoSans',
    borderWidth: 1
  },
  titleText: {
    color: '#333',
    fontSize: p(14),
    fontFamily: 'CarinoSans'
  },
  imgProfile: {
    marginTop: p(12),
    width: p(70),
    height: p(70),
    borderRadius: p(5),
    marginHorizontal: p(8),
    resizeMode: 'cover'
  },
  closeIcon: {
    position: 'absolute',
    right: p(9),
    top: p(12),
    zIndex: 100
  }
});
