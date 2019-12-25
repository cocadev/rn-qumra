import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, KeyboardAvoidingView, ScrollView } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { p } from '../../common/normalize';
import { COLORS } from '../../common/colors';
import { Actions } from 'react-native-router-flux';
import { showMessage } from "react-native-flash-message";
import { Loading } from '../../components/atoms';
import StarRating from 'react-native-star-rating';
import firebase from 'firebase';
import Icon from 'react-native-vector-icons/Ionicons';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as actions from "../../store/auth/actions";
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import firebaseAPI from '../../common/firebaseAPI';

class Profile extends Component {

  constructor(props) {
    super(props);
    this.state = {
      fullname: '',
      summary: '',
      email: '',
      phone: '',
      filePath: null,
      isWaiting: false
    }
  };

  componentDidMount() {
    this.getPermissionAsync();

    const { reduxUser } = this.props
    this.setState({
      fullname: reduxUser.fullName,
      email: reduxUser.email,
      filePath: reduxUser && reduxUser.avatar,
    })
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
      console.log('Response = ', response);

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

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  }

  render() {
    const { email, fullname, phone, isWaiting } = this.state
    return (
      <ScrollView>
        <View style={{ flex: 1, backgroundColor: '#EEE8E7', paddingHorizontal: p(12) }}>

          {isWaiting && <Loading />}

          <TouchableOpacity onPress={() => Actions.pop()}>
            <Icon name="ios-arrow-round-back" color={COLORS.light_color} size={p(36)} />
          </TouchableOpacity>

          <KeyboardAvoidingView keyboardVerticalOffset={p(20)} behavior='padding' style={{ flex: 1, padding: p(12) }}>

            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
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
                <Text style={{ color: '#111', fontSize: p(15), fontFamily: 'CarinoSans' }}>0</Text>
                <Text style={{ color: COLORS.light_color, fontSize: p(13), fontFamily: 'CarinoSans' }}>{"Loctions"}</Text>
              </View>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Text style={{ color: '#111', fontSize: p(15), fontFamily: 'CarinoSans' }}>0</Text>
                <Text style={{ color: COLORS.light_color, fontSize: p(13), textAlign: 'center', fontFamily: 'CarinoSans' }}>{'Photos\nPurchased'}</Text>
              </View>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Text style={{ color: '#111', fontSize: p(15), fontFamily: 'CarinoSans' }}>0</Text>
                <Text style={{ color: COLORS.light_color, fontSize: p(13), fontFamily: 'CarinoSans' }}>{'Reviews'}</Text>
              </View>
            </View>

            <View style={styles.body}>
              <View style={styles.bodyContent}>

                <TextInput
                  style={styles.textInputStlye}
                  placeholder='Full Name'
                  onChangeText={(fullname) => this.setState({ fullname })}
                  underlineColorAndroid='transparent'
                  value={fullname}
                />

                <TextInput
                  style={styles.textInputStlye}
                  placeholder='Email'
                  onChangeText={(email) => this.setState({ email })}
                  underlineColorAndroid='transparent'
                  value={email}

                />

                <TextInput
                  style={styles.textInputStlye}
                  placeholder='Phone Number'
                  onChangeText={(phone) => this.setState({ phone })}
                  underlineColorAndroid='transparent'
                  value={phone}

                />

                <TouchableOpacity style={styles.buttonContainer} onPress={this.onChangePressed}>
                  <Text style={{ color: '#fff', fontSize: p(17), fontFamily: 'CarinoSans-Bold' }}>Save Changes</Text>
                </TouchableOpacity>

              </View>
            </View>

          </KeyboardAvoidingView>
        </View>
      </ScrollView>
    );
  }

  onChangePressed = async () => {
    this.setState({ isWaiting: true })

    const currentUser = this.props.reduxUser
    const { email, fullname, phone, filePath } = this.state
    uploadResult = null
    if(filePath){
      uploadResult = await uploadImageAsync(filePath, currentUser);
      if (typeof uploadResult == 'string') {
  
      }
    }

    firebaseAPI.userUpdate(currentUser, email, fullname, phone, uploadResult)
     .then((res)=>{ 
       this.setState({ isWaiting: false})
       this.props.actions.updateProfile(email, fullname, phone, uploadResult)
      })
     .catch(e=>console.log('* e *', e))

     }
  }

async function uploadImageAsync(uri, currentUser) {

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

  const ref = firebase.storage().ref().child(`/images/${currentUser.uid}`);
  const snapshot = await ref.put(blob);

  // We're done with the blob, close and release it
  blob.close();
  return await snapshot.ref.getDownloadURL();
}

export default connect(
  state => ({
    reduxUser: state.auth.reduxUser,
  }),
  dispatch => ({
    actions: bindActionCreators(actions, dispatch)
  })
)(Profile);

const styles = StyleSheet.create({

  avatar: {
    width: p(110),
    height: p(110),
    borderRadius: p(56),
    borderWidth: p(4),
    borderColor: "#fff",
    marginBottom: p(10),
  },

  name: {
    fontSize: p(22),
    color: "#FFFFFF",
    fontWeight: '600',
  },

  body: {
    marginTop: p(5),
  },

  bodyContent: {
    flex: 1,
    padding: p(16),
  },

  name: {
    fontSize: p(28),
    color: "#696969",
    fontWeight: "600"
  },

  info: {
    fontSize: p(16),
    color: "#00BFFF",
    marginTop: p(10)
  },

  description: {
    fontSize: p(16),
    color: "#696969",
    marginTop: p(10),
    textAlign: 'center'
  },

  buttonContainer: {
    alignSelf: 'center',
    marginTop: p(10),
    height: p(35),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: p(10),
    width: p(200),
    borderRadius: p(30),
    backgroundColor: "#00BFFF",
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

  textInputStlye: {
    alignSelf: 'stretch',
    fontFamily: 'CarinoSans',
    fontSize: p(16),
    padding: p(10),
    marginVertical: p(7),
    backgroundColor: 'white',
    borderBottomEndRadius: p(5),
    height: p(36),
    borderRadius: p(10),
  },
  item: {
    flexDirection: 'row',
    borderBottomColor: COLORS.light_color,
    borderTopColor: COLORS.light_color,
    borderTopWidth: p(2),
    borderBottomWidth: p(2),
    paddingVertical: p(10)
  }
});
