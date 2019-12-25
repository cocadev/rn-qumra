import React, { Component } from 'react';
import { View, Image, TouchableOpacity, Text, Platform, PermissionsAndroid, ActivityIndicator } from 'react-native'
import MapView, { Callout } from 'react-native-maps';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ToggleSwitch from 'toggle-switch-react-native';
import { p } from '../../common/normalize';
import { images } from '../../common/images';
import { COLORS } from '../../common/colors';
import { styles } from './styles'
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as actions from "../../store/common/actions";
import * as auth_actions from "../../store/auth/actions";
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';

class PhotographerMap extends Component {

  constructor(props) {
    super(props);
    this.state = {
      region: {
        latitude: parseFloat(props.reduxUser.location.split(",", 2)[0]),
        longitude: parseFloat(props.reduxUser.location.split(",", 2)[1]),
        latitudeDelta: 0.004,
        longitudeDelta: 0.007
      },
      myUsers: null,
      photographer: null,
      turnOn: true,
      loading: false
    };
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

  toggleLocation(x) {
    const { latitude, longitude } = this.state
    this.props.auth_actions.toggleLocation(this.props.reduxUser.qumraId, x, latitude, longitude).then((res) => {
      this.setState({ turnOn: x })
    })
  }

  getLocation = async () => {
    const hasLocationPermission = await this.hasLocationPermission();

    if (!hasLocationPermission) return;

    this.setState({ loading: true }, () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.setState({
            loading: false,
            region: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              latitudeDelta: 0.004,
              longitudeDelta: 0.007
            },
          });

          this.props.auth_actions.toggleLocation(this.props.reduxUser.id, this.props.reduxUser.turnOn, position.coords.latitude, position.coords.longitude)

        },
        (error) => {
          this.setState({ location: error, loading: false });
          console.log(error);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000, distanceFilter: 50, forceRequestLocation: true }
      );
    });

  }

  render() {

    if (!this.props.reduxUser) {
      return false
    }

    const user = this.props.reduxUser

    return (
      <View style={styles.container}>

        <MapView
          style={styles.mapcontainer}
          showsUserLocation={true}
          showsCompass={false}
          zoomEnabled={true}
          region={this.state.region}
        >
          {/* {this.props.photographers.map((person, key) => (
            <MapView.Marker
              key={key}
              coordinate={{
                latitude: parseFloat(person.lat),
                longitude: parseFloat(person.lng)
              }}
            >
              <Image source={images.markder_user} style={{ width: p(40), height: p(52) }} />
              <Image source={{ uri: person.avatar }} style={styles.markerA} />
            </MapView.Marker>
          ))} */}

          {user && !!this.state.region.latitude && !!this.state.region.longitude &&
            <MapView.Marker
              coordinate={{ "latitude": this.state.region.latitude, "longitude": this.state.region.longitude }}
            >
              {/* <Image source={images.marker_area} style={{ width: p(24), height: p(30) }} /> */}
              <View style={styles.round}>
                <Image source={{ uri: user.avatar }} style={styles.markerB} />
              </View>

            </MapView.Marker>}

        </MapView>

        <Callout style={{ width: '100%', height: "12%", paddingLeft: p(12), flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            style={{ backgroundColor: 'transparent', width: p(30), marginTop: p(2) }}
            onPress={() => this.props.navigation.openDrawer()}
          >
            <Icon name='md-menu' size={p(30)} color={'grey'} />
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', marginLeft: p(50) }}>
            <Image source={images.logo_dark} style={{ width: p(140), height: p(37) }} />
          </View>
        </Callout>

        <Callout style={{ alignContent: 'center', width: '100%', marginTop: p(50) }}>
          <View style={styles.dashboard}>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={styles.dashboardText1}>Location is ON</Text>
              <View style={{ marginVertical: p(6), alignItems: 'center' }}>
                <ToggleSwitch
                  isOn={user.turnOn}
                  onColor='#638259'
                  offColor='#555'
                  size='small'
                  // onToggle={(isOn) => {
                  //   this.setState({ isOn: !this.state.isOn });
                  // }}
                  onToggle={(turnOn) => this.toggleLocation(turnOn)}

                />
              </View>
              <Text style={styles.dashboardText2}>
                {user.turnOn ? 'customers can see\nyour location' : 'location is OFF'}
              </Text>
            </View>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={styles.dashboardText1}>Rate</Text>
              <View style={styles.card}>
                <Text style={{ fontSize: p(12), color: COLORS.red_color, fontFamily: 'CarinoSans' }}>${user.rate}</Text>
              </View>
              <Text style={[styles.dashboardText2, { marginTop: p(10) }]}>{'per photo'}</Text>
            </View>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={styles.dashboardText1}>Availability</Text>
              <View style={styles.card}>
                <Text style={{ fontSize: p(12), color: COLORS.red_color, fontFamily: 'CarinoSans' }}>{user.availbility ? user.availbility : 'Not available'}</Text>
              </View>
              <Text style={[styles.dashboardText2, { marginTop: p(6) }]}>{'for the next\nphoto session'}</Text>
            </View>
          </View>
        </Callout>

        <Callout style={{ top: p(155), right: p(20), alignSelf: 'flex-end' }}>
          <TouchableOpacity style={styles.iconBtn} onPress={this.getLocation}>
            {
              this.state.loading
                ? <ActivityIndicator size="small" color="#00ff00" />
                : <Image source={images.icon_locateme} style={{ width: p(27), height: p(27) }} />
            }
          </TouchableOpacity>
        </Callout>

        <Callout style={{ top: p(200), right: p(20), alignSelf: 'flex-end' }}>
          <TouchableOpacity style={styles.iconBtn}>
            <Image source={images.icon_alarm} style={{ width: p(27), height: p(27) }} />
          </TouchableOpacity>
        </Callout>

        <Callout style={{ bottom: p(6), alignSelf: 'center' }}>
          <Text style={{ fontSize: p(14), fontFamily: 'CarinoSans' }}>Your Earning</Text>
          <View style={styles.earning}>
            <Text style={{ fontSize: p(14), color: '#fff', fontFamily: 'CarinoSans' }}>$0.00</Text>
          </View>
        </Callout>

      </View>
    );
  }
}

export default connect(
  state => ({
    photographers: state.common.photographers,
    reduxUser: state.auth.reduxUser
  }),
  dispatch => ({
    actions: bindActionCreators(actions, dispatch),
    auth_actions: bindActionCreators(auth_actions, dispatch)
  })
)(PhotographerMap);
