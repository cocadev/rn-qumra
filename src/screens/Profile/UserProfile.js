import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { p } from '../../common/normalize';
import firebase from 'firebase';
import ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../common/colors';
import { Actions } from 'react-native-router-flux';
import { showMessage } from "react-native-flash-message";

export default class Profile extends Component {

  constructor(props) {
    super(props);
    this.state = {
      fullname: '',
      summary: '',
      filePath: null,
      isWaiting: false
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
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        // alert(response.customButton);
      } else {
        //  let source = response;
        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };
        this.setState({
          filePath: response.uri,
        });
      }
    });
  };

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#EEE8E7', padding: p(12) }}>

        <TouchableOpacity onPress={() => Actions.pop()}>
          <Icon name="ios-arrow-round-back" color={COLORS.light_color} size={p(36)} />
        </TouchableOpacity>

        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => this.chooseFile()}
          >
            <Image
              style={styles.avatar}
              source={(this.state.filePath == null) ? require('../../../assets/image/photographer1.png') : {
                uri: this.state.filePath,
              }} />
          </TouchableOpacity>
        </View>

        <View style={styles.body}>
          <View style={styles.bodyContent}>
           
            <Text style={styles.info}>Type your name and select your avatar</Text>
            <Text style={{ fontSize: p(16), color: '#4B4B4B', marginTop: p(25) }}> Full Name</Text>
            <TextInput style={styles.textInputStlye} placeholder='Full Name'
              onChangeText={(fullname) => this.setState({ fullname })}
              underlineColorAndroid='transparent'
            />
            <Text style={{ fontSize: p(16), color: '#4B4B4B', marginTop: p(10) }}> How much do you wish to pay for photo?</Text>
            <TextInput style={styles.textInputStlye} placeholder='Add value'
              onChangeText={(summary) => this.setState({ summary })}
              underlineColorAndroid='transparent'
            />

            <TouchableOpacity style={styles.buttonContainer} onPress={this.onChangePressed}>
              <Text style={{ color: '#fff', fontSize: p(17) }}>Save Changes</Text>
            </TouchableOpacity>

          </View>
        </View>
      </View>
    );
  }

  onChangePressed = async () => {

    const { currentUser } = firebase.auth();
    const id = currentUser.uid;
    const { fullname, summary } = this.state;
    
    firebase.database().ref(`userdetail`)
      .push({ id, fullname, summary })
      .then((res) => {
        console.log('res==>', res)
        showMessage({ message: "Success Request", description: "Great", type: "success", icon: "success" });
      })
      .catch(error=>{
        showMessage({ message: "Fail Request", description: error.message, type: "danger", icon: "danger" });
      })

    uploadResult = await uploadImageAsync(this.state.filePath);
    if (typeof uploadResult == 'string') {
      showMessage({
        message: "Success",
        description: "Image uploaded",
        type: "success",
        icon: "success"
      });
    }
  }
}

async function uploadImageAsync(uri) {

  // alert("Started uploading Image")
  

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

  const { currentUser } = firebase.auth();
  const ref = firebase.storage().ref().child(`/images/${currentUser.uid}`);
  const snapshot = await ref.put(blob);

  // We're done with the blob, close and release it
  blob.close();
  return await snapshot.ref.getDownloadURL();
}

const styles = StyleSheet.create({

  avatar: {
    width: p(130),
    height: p(130),
    borderRadius: p(63),
    borderWidth: p(4),
    borderColor: "#fff",
    marginBottom: p(10),
    marginTop: p(10)
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
    alignItems: 'center',
    padding: p(30),
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
    marginTop: p(30),
    height: p(45),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: p(20),
    width: p(250),
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
    fontSize: p(16),
    padding: p(10),
    marginTop: p(10),
    marginBottom: p(15),
    backgroundColor: 'white',
    borderBottomEndRadius: p(5),
    height: p(50),
    borderRadius: p(10),
  }
});
