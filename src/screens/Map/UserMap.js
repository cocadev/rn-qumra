import React, { Component } from 'react';
import { View, Image, TouchableOpacity, FlatList, Text, ActivityIndicator } from 'react-native'
import MapView, { Callout } from 'react-native-maps';
import GooglePlaceSearch from '../../components/GooglePlaceSearch';
import Icon from 'react-native-vector-icons/Ionicons';
import firebase from 'firebase'
import Modalphotographer from './Modalphotographer';
import { p } from '../../common/normalize';
import { images } from '../../common/images';
import { COLORS } from '../../common/colors';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { styles } from './styles'
import * as actions from "../../store/common/actions";
import * as auth_actions from "../../store/auth/actions";
import * as orderActions from "../../store/orders/actions";
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import _ from 'underscore'

class UserMap extends Component {

    constructor(props) {
        super(props);
        this.state = {
            initialPosition: {
                latitude: parseFloat(props.reduxUser.location.split(",", 2)[0]),
                longitude: parseFloat(props.reduxUser.location.split(",", 2)[1]),
                latitudeDelta: 0.004,
                longitudeDelta: 0.007
            },
            mylocation: {
                latitude: parseFloat(props.reduxUser.location.split(",", 2)[0]),
                longitude: parseFloat(props.reduxUser.location.split(",", 2)[1]),
                latitudeDelta: 0.004,
                longitudeDelta: 0.007
            },
            displayName: null,
            persons: [],
            photographer: null,
            error: '',
            modal: false,
            loading: false,
            isOn: true,
            displayView: true,
            error: null,
            concat: null,
            coords: [],
            x: 'false',
            cordLatitude: 42.3353,
            cordLongitude: -71.0253,
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
        const hasLocationPermission = await this.hasLocationPermission();

        if (!hasLocationPermission) return;

        this.setState({ loading: true }, () => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.setState({
                        position: {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                        },
                        loading: false,
                        initialPosition: {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                            latitudeDelta: 0.004,
                            longitudeDelta: 0.007
                        },
                    });
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
        this.setState({
            initialPosition: {
                latitude: lat,
                longitude: lng,
                latitudeDelta: 0.004,
                longitudeDelta: 0.007
            },
        })
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

    setCurrentLocation() {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                let { initialPosition } = this.state
                this.setState({
                    position: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    },
                    initialPosition: {
                        ...initialPosition,
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    }
                })
            },
            (error) => {
                console.log(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    }

    changeRegion(region) {
        this.setState({ initialPosition: region })
    }

    onMapPress(e) {
        // console.log('My point here = ', e)
        this.setState({ displayView: false })
    }

    render() {

        let { initialPosition, mylocation, coords, x, cordLatitude, cordLongitude } = this.state
        let { pgs, reduxUser, orders } = this.props


        return (
            <View style={styles.container}>

                <MapView
                    style={styles.mapcontainer}
                    showsCompass={false}
                    zoomEnabled={true}
                    region={initialPosition}
                    showsUserLocation={true}
                    onPress={(e) => this.onMapPress(e)}

                >

                    {initialPosition &&
                        <MapView.Marker
                            coordinate={{ "latitude": initialPosition.latitude, "longitude": initialPosition.longitude }}
                        >
                            <Image source={images.markder_user} style={{ width: p(28), height: p(28) }} />
                        </MapView.Marker>}
                    {mylocation &&
                        <MapView.Marker
                            coordinate={{ "latitude": mylocation.latitude, "longitude": mylocation.longitude }}
                        >
                            <Image source={reduxUser && reduxUser.avatar ? { uri: reduxUser.avatar } : images.img_photographer1} style={[styles.markerA, { borderColor: 'red' }]} />
                        </MapView.Marker>}

                    {pgs.map((person, key) => (
                        person.turnOn && <MapView.Marker
                            style={{ zIndex: 100 }}
                            key={key}
                            coordinate={{
                                latitude: parseFloat(person.location.split(",", 2)[0]),
                                longitude: parseFloat(person.location.split(",", 2)[1])
                            }}
                        >
                            <Image source={{ uri: person.avatar }} style={styles.markerA} />
                        </MapView.Marker>
                    ))}


                </MapView>

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

                <GooglePlaceSearch
                    listViewDisplayed={this.state.displayView}
                    onClick={(lat, lng) => {
                        this.goToMap(lat, lng)
                    }}
                    onTouchStart={() => { }}
                    onFocus={() => { }}
                />

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
}

export default connect(
    state => ({
        pgs: state.common.pgs,
        reduxUser: state.auth.reduxUser,
        orders: state.orders.orders,
    }),
    dispatch => ({
        actions: bindActionCreators(actions, dispatch),
        auth_actions: bindActionCreators(auth_actions, dispatch),
        orderActions: bindActionCreators({ ...orderActions }, dispatch),
    })
)(UserMap);

