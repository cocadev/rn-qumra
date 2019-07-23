import React, { Component } from 'react';
import { View, StyleSheet, Dimensions, Image, TouchableOpacity, FlatList, Text, Platform } from 'react-native'
import MapView, { PROVIDER_GOOGLE, Callout, } from 'react-native-maps';
import GooglePlaceSearch from '../../components/GooglePlaceSearch';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { p } from '../../common/normalize';
import { images } from '../../common/images';
import { COLORS } from '../../common/colors';
import axios from 'axios';

var { width, height } = Dimensions.get('window')

export default class Maps extends Component {

  constructor(props) {
    super(props);
    this.state = {
      // default value, you have to give default value
      initialPosition: {
        latitude: 40.758043,
        longitude: -73.985692,
        latitudeDelta: 7,
        longitudeDelta: 7
      },
      persons: [],
      error: ''
    };
  }

  componentDidMount() {
    axios.get(`https://randomuser.me/api/?seed=1&page=1&results=6`)
      .then(res => {
        const persons = res.data.results;
        this.setState({ persons });
      })
  }

  onCurrentLocationPressed = () => {

  }

  _renderItem = ({ item }) => (
    <TouchableOpacity 
      style={{ marginTop: p(8)}}
      onPress={()=>{
        this.setState({
          initialPosition: {
            latitude: parseFloat(item.location.coordinates.latitude),
            longitude: parseFloat(item.location.coordinates.longitude),
            latitudeDelta: 7,
            longitudeDelta: 7
          },
        })
      }} 
    >
      <Image source={{ uri: item.picture.medium}} style={{ width: p(80), height: p(80), borderRadius: p(40), marginLeft: p(11) }} />
      <Text style={{ fontSize: p(15), alignSelf: 'center', marginTop: p(6) }}>${item.dob.age}</Text>
    </TouchableOpacity>
  )


  render() {
    console.log('_____________', this.state.persons)
    return (
      <View style={styles.container}>

        <MapView
          style={styles.mapcontainer}
          showsCompass={false}
          zoomEnabled={true}
          region={this.state.initialPosition}
        >
          {this.state.persons.map((person, key) => (
            <MapView.Marker
              key={key}
              coordinate={{
                latitude: parseFloat(person.location.coordinates.latitude) ,
                longitude: parseFloat(person.location.coordinates.longitude) 
              }}
            >
              <Image source={images.markder_user} style={{ width: p(40), height: p(52) }} />
              <Image source={{ uri: person.picture.medium }} style={{ position: 'absolute', left: p(7.55), top: p(5.6),  width: p(26), height: p(26), borderRadius: p(13) }} />
            
            </MapView.Marker>
          ))}

          {/* {!!this.state.initialPosition.latitude && !!this.state.initialPosition.longitude &&
            <MapView.Marker
              coordinate={{ "latitude": this.state.initialPosition.latitude, "longitude": this.state.initialPosition.longitude }}
            >
              <Image source={images.markder_user} style={{ width: p(40), height: p(52) }} />
              <Image source={{ uri: 'https://asia-mag.com/wp-content/uploads/2019/06/zhangitanai7.png' }} style={{ position: 'absolute', left: p(8.2), top: p(6), width: p(26), height: p(26), borderRadius: p(13) }} />
            
            </MapView.Marker>} */}

        </MapView>

        <Callout style={{ width: '100%', height: "10%", marginTop: p(10), paddingLeft: p(12), flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            style={{ backgroundColor: 'transparent', width: p(30), marginTop: p(2) }}
            onPress={() => this.props.navigation.openDrawer()}
          >
            <Icon name='md-menu' size={p(22)} color={'grey'} />
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', marginLeft: p(70) }}>
            <Image source={images.logo_dark} style={{ width: p(140), height: p(37) }} />
          </View>
        </Callout>

        <Callout style={{ alignContent: 'center', width: '100%', height: "20%", marginTop: p(50) }}>
          <GooglePlaceSearch />
        </Callout>

        <Callout style={{ top: p(140), right: p(12), alignSelf: 'flex-end' }}>
          <TouchableOpacity style={{ elevation: 5, padding: p(9), backgroundColor: '#fff', borderRadius: 5 }} onPress={this.onCurrentLocationPressed}>
            <MaterialIcons name='my-location' size={p(13)} color={'grey'} />
          </TouchableOpacity>
        </Callout>

        {/* <Callout style={{ bottom: p(20), flexDirection: 'row', justifyContent: 'space-around', width: width }}>
          <TouchableOpacity onPress={()=>Actions.signin()} style={[styles.btn, { backgroundColor: '#2b3954'}]}>
            <Text style={styles.btnText}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>Actions.signup()} style={styles.btn}>
            <Text style={styles.btnText}>Sign Up</Text>
          </TouchableOpacity>
        </Callout> */}

        <Callout style={styles.listView}>
          <FlatList
            horizontal
            style={{ marginTop: 12 }}
            data={this.state.persons}
            keyExtractor={(item, i) => String(i)}
            renderItem={this._renderItem}
          />
        </Callout>

      </View>
    );
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
    flexDirection: 'column',
    paddingTop: p(2)
  },
  mapcontainer: {
    width: width,
    height: height,
  },
  listView: {
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: width,
    height: p(140),
    backgroundColor: COLORS.white,
    elevation: 6,
    borderRadius: p(16),
  }
})