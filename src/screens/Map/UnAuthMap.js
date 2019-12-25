import React, { Component } from 'react';
import { View, Dimensions, Image, TouchableOpacity, Text, FlatList, Platform, PermissionsAndroid, ActivityIndicator } from 'react-native'
import MapView, { Callout } from 'react-native-maps';
import Icon from 'react-native-vector-icons/Ionicons';
import { p } from '../../common/normalize';
import { images } from '../../common/images';
import { Actions } from 'react-native-router-flux';
import { styles } from './styles'
import GooglePlaceSearch from '../../components/GooglePlaceSearch';
import firebase from 'firebase';

import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as actions from "../../store/common/actions";
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import Modalphotographer from './Modalphotographer';
import { COLORS } from '../../common/colors';

var { width } = Dimensions.get('window')

var _UnAuthMap = null

class UnAuthMap extends Component {

  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
      bShowSearchMenu: false,
      modal: false,
      region: {
        latitude: 40.758043,
        longitude: -73.985692,
        latitudeDelta: 0.004,
        longitudeDelta: 0.007
      },
      loading: false,
      displayView: true
    };

    _UnAuthMap = this
  }

  async componentDidMount() {
    this.getLocation()
  }

  changeSearchText(newVal) {
    this.setState({
      searchText: newVal
    })
  }

  showSearchMenu() {
    this.setState({
      bShowSearchMenu: true
    })
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
            loading: false,
            region: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              latitudeDelta: 0.004,
              longitudeDelta: 0.007
            },
          });
          // console.log(position);
        },
        (error) => {
          this.setState({ location: error, loading: false });
          console.log(error);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000, distanceFilter: 50, forceRequestLocation: true }
      );
    });
  }

  setCurrentLocation() {
    let { region } = this.state
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // console.log("current position", position);
        this.setState({
          position,
          region: {
            ...region,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }
        })

      },
      (error) => {
        // See error code charts below.
        console.log(error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }

  goToMap(lat, lng) {
    let { region } = this.state
    this.setState({
      region: {
        ...region,
        latitude: lat,
        longitude: lng,
      }
    })
  }

  goLocationSelection() {
    this.setState({
      bShowSearchMenu: false
    })
  }

  changeRegion(region) {
    this.setState({ region })
  }

  clickMap() {
    this.setState({
      bShowSearchMenu: false,
      displayView: false
    })
  }

  selectPhotographer(person) {
    // console.log('person', person)
    _UnAuthMap.setState({
      photographer: person,
      modal: true
    })
  }

  renderIndicator() {
    const { currentUser } = firebase.auth();
    return (
      <Modalphotographer
        currentUser={currentUser}
        photographer={this.state.photographer}
        modal={this.state.modal}
        onClick={() => this.setState({ modal: false })}
      />
    );
  }

  _renderItem = ({ item }) => (
    item.turnOn && <View style={{ marginLeft: p(11) }}>

      <TouchableOpacity
        onPress={() => this.setState({ photographer: item, modal: true })}
        style={{ marginTop: p(2) }}
      >
        <Image source={item && item.avatar ? { uri: item.avatar } : images.img_photographer1} style={{ width: p(80), height: p(80), borderRadius: p(40), borderWidth: p(2), borderColor: COLORS.light_color }} />
      </TouchableOpacity>
      <View style={styles.price}>
        <Text style={{ fontSize: p(9), color: '#fff', fontFamily: 'CarinoSans-Bold' }}>${item.rate}</Text>
      </View>
      <TouchableOpacity
        style={styles.goView}
        onPress={() => {
          this.goToMap(parseFloat(item.location.split(",", 2)[0]), parseFloat(item.location.split(",", 2)[1]))
        }}
      >
        <Image source={images.icon_locateme} style={{ width: p(26), height: p(26) }} />
      </TouchableOpacity>

    </View>
  )

  render() {
    let { region } = this.state
    let { pgs } = this.props
    return (
      <View style={styles.container}>

        <MapView
          ref={(ref) => this.map = ref}
          // onRegionChangeComplete={this.changeRegion.bind(this)}
          style={styles.mapcontainer}
          showsUserLocation={true}
          showsCompass={false}
          zoomEnabled={true}
          region={region}
          onPress={this.clickMap.bind(this)}
        >
          {region &&
            <MapView.Marker
              coordinate={{ "latitude": region.latitude, "longitude": region.longitude }}
            >
              <Image source={images.markder_user} style={{ width: p(28), height: p(28) }} />
            </MapView.Marker>}
          {pgs.map((person, key) => (
            person.turnOn && <MapView.Marker
              key={key}
              coordinate={{
                latitude: parseFloat(person.location.split(",", 2)[0]),
                longitude: parseFloat(person.location.split(",", 2)[1])
              }}
              zIndex={10}
              onPress={() => this.selectPhotographer(person)}
            >
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Image source={person && person.avatar ? { uri: person.avatar } : images.img_photographer1} style={styles.markerA} />
              </View>
            </MapView.Marker>
          ))}
        </MapView>

        <GooglePlaceSearch
          listViewDisplayed={this.state.displayView}
          onFocus={() => { console.log('green stop///'); this.setState({ bShowSearchMenu: true }) }}
          onTouchStart={() => { this.setState({ bShowSearchMenu: true }) }}
          onClick={(lat, lng) => {
            this.goToMap(lat, lng)
          }} />

        <Callout style={{ top: p(140), right: p(20), alignSelf: 'flex-end' }}>
          <TouchableOpacity style={styles.iconBtn} onPress={this.getLocation}>
            {
              this.state.loading
                ? <ActivityIndicator size="small" color="#00ff00" />
                : <Image source={images.icon_locateme} style={{ width: p(27), height: p(27) }} />
            }
          </TouchableOpacity>
        </Callout>

        <Callout style={{ top: p(190), right: p(20), alignSelf: 'flex-end' }}>
          <TouchableOpacity style={styles.iconBtn}>
            <Image source={images.icon_alarm} style={{ width: p(27), height: p(27) }} />
          </TouchableOpacity>
        </Callout>

        <Callout style={{ width: '100%', height: "10%", marginTop: p(10), paddingLeft: p(12), flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            style={{ backgroundColor: 'transparent', width: p(30), marginTop: p(2) }}
            onPress={() => this.props.navigation.openDrawer()}
          >
            <Icon name='md-menu' size={p(30)} color={'grey'} />
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', marginLeft: p(42), top: p(2) }}>
            <Image source={images.logo_dark} style={{ width: p(140), height: p(37) }} />
          </View>
        </Callout>

        <Callout style={{ bottom: p(110), flexDirection: 'row', justifyContent: 'space-around', width: width }}>
          <TouchableOpacity onPress={() => Actions.signin()} style={[styles.btn, { backgroundColor: '#2b3954' }]}>
            <Text style={styles.btnText}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Actions.signup()} style={styles.btn}>
            <Text style={styles.btnText}>Sign Up</Text>
          </TouchableOpacity>
        </Callout>

        <Callout style={styles.listView}>
          <FlatList
            horizontal
            extraData={this.state}
            style={{ marginTop: 4 }}
            data={this.props.pgs}
            keyExtractor={(item, i) => String(i)}
            renderItem={this._renderItem}
          />
        </Callout>

        {this.renderIndicator()}

      </View>
    );
  }
}

export default connect(
  state => ({
    pgs: state.common.pgs,
  }),
  dispatch => ({
    actions: bindActionCreators(actions, dispatch)
  })
)(UnAuthMap);

