import React, { Component } from 'react';
import { View, StyleSheet, Dimensions, Image, TouchableOpacity, Text, ActivityIndicator } from 'react-native'
import { p } from '../../common/normalize';
import { images } from '../../common/images';
import { Actions } from 'react-native-router-flux';
import MapView, { Callout, } from 'react-native-maps';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Polyline from '@mapbox/polyline';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';

const { width, height } = Dimensions.get('window');

export default class MyMap extends Component {

  constructor(props) {
    super(props);
    this.state = {
      initialPosition: {
        latitude: this.props.location.latitude,
        longitude: this.props.location.longitude,
        latitudeDelta: 0.004,
        longitudeDelta: 0.007
      },

      cordLatitude: 42.361415,
      cordLongitude: -71.0161,

      error: null,
      concat: null,
      coords:[],
      x: 'false',

      persons: [],
      error: '',
      loading: false

    };
    this.goToMap = this.goToMap.bind(this)
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
    let { initialPosition } = this.state

    const hasLocationPermission = await this.hasLocationPermission();

    if (!hasLocationPermission) return;

    this.setState({ loading: true }, () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          initialPosition = {
            ...initialPosition,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }
          this.setState({
            location: position, loading: false,
            initialPosition,
          });
          console.log(position);
        },
        (error) => {
          this.setState({ location: error, loading: false });
          console.log(error);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000, distanceFilter: 50, forceRequestLocation: true }
      );
    });
  }

  goToMap(lat, lng) {
    let { initialPosition } = this.state
    initialPosition = {
      ...initialPosition,
      latitude: lat,
      longitude: lng,
    }

    this.setState({
      initialPosition
    })
  }

  onMapPress(e) {
    let { initialPosition } = this.state
    initialPosition = {
      ...initialPosition,
      latitude: e.nativeEvent.coordinate.latitude,
      longitude: e.nativeEvent.coordinate.longitude,
    }
    this.setState({
      initialPosition
    })
  }

  render() {

    const { initialPosition } = this.state

    return (
      <View style={styles.container}>

        <MapView
          style={styles.mapcontainer}
          ref={ref => { this.map = ref; }}
          showsCompass={false}
          zoomEnabled={true}
          region={initialPosition}
          onPress={(e) => this.onMapPress(e)}
        >
        </MapView>

        <Callout style={{ top: p(20), right: p(12), alignSelf: 'flex-end' }}>
          <TouchableOpacity style={{ elevation: 5, padding: p(9), backgroundColor: '#fff', borderRadius: 5 }} onPress={this.getLocation}>
            {this.state.loading ? <ActivityIndicator size='small' color={'grey'} /> : <MaterialIcons name='my-location' size={p(13)} color={'grey'} />}
          </TouchableOpacity>
        </Callout>

        <Callout style={{ top: p(20), left: p(12), alignSelf: 'flex-end' }}>
          <TouchableOpacity style={{ elevation: 5, padding: p(9), backgroundColor: '#fff', borderRadius: 5 }} onPress={() => Actions.pop()}>
            <MaterialIcons name="arrow-back" color={'grey'} size={p(13)} />
          </TouchableOpacity>
        </Callout>

        <Callout style={{ bottom: p(20), alignSelf: 'center' }}>
          <TouchableOpacity style={styles.btn} onPress={() => this.uploadLocation()}>
            <Text style={{ color: '#fff', fontSize: p(12) }}>Select this Location</Text>
          </TouchableOpacity>
        </Callout>

      </View>
    );
  }

  uploadLocation = () => {
    if (this.props.update) {
      this.props.update(this.state.initialPosition)
      Actions.pop();
    }
  }

}

const styles = StyleSheet.create({
  btn: {
    fontSize: p(17),
    width: p(130),
    height: p(30),
    backgroundColor: '#ff5a5f',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: p(6)
  },
  btnText: {
    fontSize: p(17),
    color: '#fff'
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

  container: {
    flex: 1,
    flexDirection: 'column',
    paddingTop: p(2)
  },
  mapcontainer: {
    width: width,
    height: height,
  },
  markerA: {
    width: p(28),
    height: p(28),
    borderRadius: p(14)
  },
})