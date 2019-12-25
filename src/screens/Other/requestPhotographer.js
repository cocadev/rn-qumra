import React from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, StyleSheet, KeyboardAvoidingView, Dimensions, ScrollView, ImageBackground } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { p } from '../../common/normalize';
import { COLORS } from '../../common/colors';
import { images } from '../../common/images';
import { showMessage } from "react-native-flash-message";
import Icon from 'react-native-vector-icons/Ionicons';
import ModalRequest from './ModalRequest';
import MapView, { Callout } from 'react-native-maps';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as actions from "../../store/auth/actions";
import * as msgActions from "../../store/messages/actions";
import firebaseAPI from '../../common/firebaseAPI';
import getDirections from 'react-native-google-maps-directions'

const { width, height } = Dimensions.get('window');
const LATITUDE_DELTA = 0.004;
const LONGITUDE_DELTA = 0.007;

class RequestPhotographer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            msg: '',
            modal: false,
            latitude: parseFloat(props.reduxUser.location.split(",", 2)[0]),
            longitude: parseFloat(props.reduxUser.location.split(",", 2)[1]),
        }
    }

    renderIndicator() {
        return (
            <ModalRequest
                photographer={{
                    fullname: this.state.fullname,
                    avatar: this.state.filePath,
                }}
                modal={this.state.modal}
                onClick={() => this.setState({ modal: false })}
            />
        );
    }

    sendRequest() {

        const { photographer } = this.props
        const { msg, latitude, longitude } = this.state;
        const currentUser = this.props.reduxUser

        if (!this.state.msg) {
            showMessage({
                message: "Fail",
                description: "Message can not be null",
                type: "danger",
                icon: "danger"
            });
            return false
        }

        firebaseAPI.sendRequest(currentUser, photographer, msg, latitude, longitude)
        Actions.orders()

    }

    handleGetDirections = () => {
        const { photographer } = this.props

        const data = {
            source: {
                latitude: this.state.latitude,
                longitude: this.state.longitude
            },
            destination: {
                latitude: parseFloat(photographer.location.split(",", 2)[0]),
                longitude: parseFloat(photographer.location.split(",", 2)[1])
            },
            params: [
                {
                    key: "travelmode",
                    value: "driving"        // may be "walking", "bicycling" or "transit" as well
                },
                {
                    key: "dir_action",
                    value: "navigate"       // this instantly initializes navigation using the given travel mode
                }
            ],
            //   waypoints: [
            //     {
            //       latitude: -33.8600025,
            //       longitude: 18.697452,
            //     },
            //     {
            //       latitude: -33.8600026,
            //       longitude: 18.697453,
            //     },
            //        {
            //       latitude: -33.8600036,
            //       longitude: 18.697493,
            //     },
            //        {
            //       latitude: -33.8600046,
            //       longitude: 18.69743,
            //     },

            //   ]
        }

        getDirections(data)
    }

    render() {

        const { photographer } = this.props
        const { msg, latitude, longitude } = this.state;
        const currentUser = this.props.reduxUser

        return (
            <ScrollView style={{ flex: 1 }}>

                <View style={styles.header}>
                    <TouchableOpacity style={styles.back} onPress={() => Actions.pop()}>
                        <Icon name="ios-arrow-round-back" color={COLORS.light_color} size={p(36)} />
                    </TouchableOpacity>
                    <Text style={[styles.text, { color: COLORS.light_color, fontFamily: 'CarinoSans-SemiBold', fontSize: p(17), marginTop: p(7.5) }]}>Request Photographer</Text>
                </View>

                <KeyboardAvoidingView keyboardVerticalOffset={p(50)}>

                    <View style={{ flexDirection: 'row', padding: p(12), alignItems: 'center' }}>
                        <Image source={{ uri: photographer.avatar }} style={styles.avatar} />
                        <Text style={styles.title}>{photographer.fullName}</Text>
                    </View>

                    <Text style={[styles.text, { marginLeft: p(12) }]}>{'Rate: $' + photographer.rate + ' per photo\nAvailability: ' + photographer.availbility}</Text>

                    <View style={styles.item}>
                        <Text style={styles.itemText}>Where to meet?</Text>
                        <TouchableOpacity
                            style={{ flexDirection: 'row', alignItems: 'center', marginTop: p(12) }}
                            onPress={() => Actions.mymap({
                                location: {
                                    latitude, longitude
                                },
                                photographer,
                                currentUser,
                                update: (i) => {
                                    this.setState({
                                        latitude: i.latitude,
                                        longitude: i.longitude,
                                    })
                                }
                            })}
                        >
                            <Image source={images.markder_user} style={styles.marker} />
                            <Text style={[styles.itemText, { fontFamily: 'CarinoSans' }]}>Selected Location</Text>
                        </TouchableOpacity>
                        <Text style={[styles.text, { alignSelf: 'flex-start', marginLeft: p(16), fontFamily: 'CarinoSans-SemiBold', color: COLORS.red_color, fontSize: p(12) }]}>{photographer.fullName} will meet you at the selected location</Text>

                        <MapView
                            provider={this.props.provider}
                            style={{ width: width - p(24), height: p(150), marginTop: p(12) }}
                            region={{
                                latitude: this.state.latitude,
                                longitude: this.state.longitude,
                                latitudeDelta: LATITUDE_DELTA,
                                longitudeDelta: LONGITUDE_DELTA,
                            }}
                        >
                            <MapView.Marker
                                coordinate={{
                                    latitude: this.state.latitude,
                                    longitude: this.state.longitude,
                                    latitudeDelta: LATITUDE_DELTA,
                                    longitudeDelta: LONGITUDE_DELTA,
                                }}
                            >
                                <Image source={images.markder_user} style={{ width: p(20), height: p(26) }} />
                            </MapView.Marker>
                        </MapView>
                    </View>

                    <TouchableOpacity style={styles.btn} onPress={this.handleGetDirections}>
                        <Text style={styles.btnText}>Go To Map</Text>
                    </TouchableOpacity>

                    <View style={{ marginVertical: p(28), paddingHorizontal: p(12) }}>
                        <Text style={styles.itemText}>Send a message to {photographer.fullName}:</Text>

                        <TextInput
                            style={styles.texinput}
                            textAlignVertical={'top'}
                            multiline
                            onChangeText={(msg) => this.setState({ msg })}
                            value={msg}
                        />

                        <TouchableOpacity style={styles.btn} onPress={() => this.sendRequest()}>
                            <Text style={styles.btnText}>Send Request</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>

                {this.renderIndicator()}

            </ScrollView>
        );
    }
}

export default connect(
    state => ({
        reduxUser: state.auth.reduxUser
    }),
    dispatch => ({
        actions: bindActionCreators(actions, dispatch),
        msgActions: bindActionCreators(msgActions, dispatch),
    })
)(RequestPhotographer);

const styles = StyleSheet.create({
    back: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'flex-start',
        // padding: p(12),
        width: p(40),
        height: p(40),
    },
    header: {
        marginHorizontal: p(12),
        height: p(38),
        borderBottomWidth: 1,
        borderBottomColor: COLORS.light_color,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 60
    },
    title: {
        color: COLORS.light_color,
        fontFamily: 'CarinoSans',
        fontSize: p(25),
        fontWeight: '600',
        marginLeft: p(22)
    },
    text: {
        fontFamily: 'CarinoSans',
        color: COLORS.red_color,
        fontSize: p(14),
        alignSelf: 'center'
    },
    item: {
        marginTop: p(15),
        paddingHorizontal: p(12),
        borderBottomColor: COLORS.light_color,
        borderBottomWidth: p(2),
        borderTopColor: COLORS.light_color,
        borderTopWidth: p(2),
        paddingVertical: p(12)
    },
    marker: {
        width: p(19),
        height: p(25),
        marginHorizontal: p(12)
    },
    btn: {
        marginVertical: p(12),
        backgroundColor: COLORS.light_color,
        width: p(180),
        height: p(30),
        borderRadius: p(6),
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnText: {
        fontFamily: 'CarinoSans-Bold',
        color: COLORS.white,
        fontSize: p(16)
    },
    itemText: {
        fontFamily: 'CarinoSans-SemiBold',
        color: COLORS.light_color,
        fontSize: p(14)
    },
    texinput: {
        marginTop: p(7),
        height: p(100),
        fontSize: p(11),
        lineHeight: p(17),
        borderColor: 'gray',
        borderWidth: 1
    }

})