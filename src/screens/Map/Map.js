import React, { Component } from 'react';
import { View, StyleSheet, Dimensions, Image, TouchableOpacity, Text } from 'react-native'
import MapView, { PROVIDER_GOOGLE, Callout, } from 'react-native-maps';
import GooglePlaceSearch from '../GooglePlaceSearch';
import { images } from '../config/images';
import { p } from '../config/normalize';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

var { width, height } = Dimensions.get('window')
const ASPECT_RATIO = width / height
const LATITUDE_DELTA = 0.0922
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO

export default class Map extends Component {

  constructor(props) {
    super(props);
    this.state = {
      // default value, you have to give default value
      initialPosition: {
        latitude: 40.758043,
        longitude: -73.985692,
        latitudeDelta: 0.004,
        longitudeDelta: 0.004
      },
      error: ''
    };
  }

  componentWillMount() {
    this.fetchCurrentLocaiton();
  }

  componentWillUnmount() {
    // to stop the location tracking observer, required for memory management.
    //  navigator.geolocation.clearWatch(this.watchId);
  }

  onCurrentLocationPressed = () => {
    this.fetchCurrentLocaiton();
  }

  // This is the method to find current position of device/ user
  fetchCurrentLocaiton = () => {
    // watch position will start locaiton tracking observer
    this.watchId = navigator.geolocation.watchPosition((position) => {
      var lat = parseFloat(position.coords.latitude)
      var long = parseFloat(position.coords.longitude)

      var initialRegion = {
        latitude: lat,
        longitude: long,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      }
      this.setState({ initialPosition: initialRegion });
    },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  }

  render() {
    return (
      <View style={styles.container}>

        <MapView
          style={styles.mapcontainer}
          provider={PROVIDER_GOOGLE}
          // showsUserLocation={true}
          // showsMyLocationButton={true}
          showsCompass={false}
          zoomEnabled={true}
          region={this.state.initialPosition}
        >
          {/* We will put marker as per the list of database */}

          {!!this.state.initialPosition.latitude && !!this.state.initialPosition.longitude && 
           <MapView.Marker
            coordinate={{ "latitude": this.state.initialPosition.latitude, "longitude": this.state.initialPosition.longitude }}
          >
            <Image source={images.markder_user} style={{ width: p(40), height: p(52)}}/>
            <Image source={{ uri: 'https://asia-mag.com/wp-content/uploads/2019/06/zhangitanai7.png'}} style={{ position: 'absolute', left: p(8.2), top: p(6), width: p(26), height: p(26), borderRadius: p(13)}}/>
          </MapView.Marker>}

        </MapView>

        <Callout style={{ width: '100%', height: "10%", marginTop: p(8), paddingLeft: p(12), flexDirection: 'row'}}>
          <TouchableOpacity
            style={{backgroundColor:'transparent', width: p(30)}}
            onPress={() => this.props.navigation.openDrawer()}
          >
            <Icon name='md-menu' size={p(22)} color={'grey'}/>
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', marginLeft: p(110)}}>
            <Image source={images.markder_qumrahmarker} style={{ width: p(36), height: p(30)}}/>
            <Text style={{ color: 'grey', fontSize: p(16), marginLeft: p(3)}}>qumra</Text>
          </View>
        </Callout>
        {/* <TouchableOpacity
             style={{ position:'absolute',
            marginTop: 700,
            marginLeft: 50,
            borderRadius: 5,
            width: 220,

             backgroundColor: '#f5565b',
             padding: 10,
             alignItems: 'center',}} onPress={this.PhotographerLogin}>
               <Text style={{color: 'white'}}> Sign In</Text>
             </TouchableOpacity>
             <TouchableOpacity
             style={{ position:'absolute',
            marginTop: 700,
            marginLeft: 300,
            borderRadius: 5,
            width: 220,

             backgroundColor: '#2d3e50',
             padding: 10,
             alignItems: 'center',}} onPress={this.PhotographerLogin}>
               <Text style={{color: 'white'}}> Sign Up</Text>
             </TouchableOpacity>        */}

        <Callout style={{ alignContent: 'center', width: '100%', height: "20%", marginTop: p(30) }}>
          <GooglePlaceSearch />
        </Callout>

        <Callout style={{ top: p(100), right: p(12), alignSelf: 'flex-end' }}>
          <TouchableOpacity style={{ elevation: 5, padding: p(6), backgroundColor: '#fff', borderRadius: 5}} onPress={this.onCurrentLocationPressed}>
            <MaterialIcons name='my-location' size={p(13)} color={'grey'}/>
          </TouchableOpacity>
        </Callout>

        <Callout style={{ bottom: p(20), flexDirection: 'row', justifyContent: 'space-around', width: width }}>
          <TouchableOpacity style={[styles.btn, { backgroundColor: '#2b3954'}]}>
            <Text style={styles.btnText}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn}>
            <Text style={styles.btnText}>Sign Up</Text>
          </TouchableOpacity>
        </Callout>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  btn:{
    fontSize: p(17),
    width: p(130),
    height: p(30),
    backgroundColor: '#ff5a5f',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: p(6)
  },
  btnText:{
    fontSize: p(17),
    color: '#fff'
  },
  raduis: {
    height: 50,
    width: 50,
    borderRadius: 50 / 2,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.1)', // rgba(255,90,95,0.1)
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  // on the style sheet
  calloutView: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 15,
    width: "80%",
    marginTop: "10%",
    marginLeft: "15%"

  },
  calloutSearch: {
    borderColor: "transparent",
    marginLeft: 10,
    width: "90%",
    marginRight: 10,
    height: 40,
    borderWidth: 0.0
  },
  marker: {
    height: 20,
    width: 20,
    borderWidth: 3,
    borderColor: 'white',
    borderRadius: 20 / 2,
    overflow: 'hidden',
    backgroundColor: 'black'  //'#ff5a5f'
  },
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  mapcontainer: {
    width: width,
    height: height,
  },
})