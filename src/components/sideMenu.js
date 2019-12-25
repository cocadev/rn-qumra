import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity, TouchableNativeFeedback, TouchableHighlight, ScrollView, Dimensions, StyleSheet, ImageBackground } from 'react-native';
import { images } from '../common/images';
import { p } from '../common/normalize';
import { Actions } from 'react-native-router-flux';

import StarRating from 'react-native-star-rating';
import firebase from 'firebase'
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as actions from "../store/auth/actions";
import * as actionsMSG from "../store/messages/actions";
import * as actionsOrder from "../store/orders/actions";

const width = Dimensions.get('window').width

import { COLORS } from '../common/colors';

class SideMenu extends Component {

    constructor() {
        super();
        this.state = {
            reduxUser: null
        }
    }

    componentDidMount() {
        this.focusListner = this.props.navigation.addListener("didFocus", () => {
            this.setState({ reduxUser: this.props.reduxUser })
        })
    }

    componentWillUnmount() {
        this.focusListner.remove()
    }

    signOutUser = async () => {
        try {
            this.props.actions.clear()
            this.props.actionsMSG.clear()
            this.props.actionsOrder.clear()

            firebase.auth().signOut();
            //            }

        } catch (e) {
            console.log(e);
        }
    }

    render() {

        const { reduxUser } = this.state;

        return (
            <ScrollView>
                <View style={{ flex: 1 }}>
                    <Image source={reduxUser ? (reduxUser && reduxUser.avatar ? ({ uri: reduxUser.avatar }) : images.img_photographer1) : images.img_photographer1}
                        style={{
                            width: p(130),
                            height: p(130),
                            borderRadius: p(65),
                            borderWidth: p(4),
                            borderColor: "white",
                            marginBottom: p(5),
                            alignSelf: 'center',
                            marginTop: p(18)
                        }}
                    />

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

                    <Text style={{ alignSelf: 'center', marginBottom: p(5), fontSize: p(14), fontFamily: 'CarinoSans-SemiBold' }}> {reduxUser ? reduxUser.fullName : 'Hi, Guest!'}</Text>

                    <View style={{ width: width / 1.5, height: p(2), backgroundColor: '#f4f3f3', alignSelf: 'center', marginBottom: p(5) }}>

                    </View>

                    <TouchableHighlight underlayColor='#f0f0f0'
                        onPress={() => Actions.maps()}
                        background={TouchableNativeFeedback.SelectableBackground()}>

                        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: p(20) }} >
                            <Image source={images.icon_home} style={{ width: p(20), height: p(20) }} />
                            <Text style={styles.menuItem}>
                                Home
                            </Text>
                        </View>

                    </TouchableHighlight>

                    <TouchableHighlight
                        onPress={() => {
                            reduxUser ? (reduxUser.type == "user"
                                ? Actions.profile()
                                : Actions.photographerprofile()
                            ) : Actions.signin()
                        }}
                        underlayColor='#f0f0f0'
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: p(20) }} >
                            <Image source={images.icon_profile} style={{ width: p(20), height: p(20) }} />
                            <Text style={styles.menuItem}>
                                My Profile
                            </Text>
                        </View>
                    </TouchableHighlight>

                    <TouchableHighlight underlayColor='#f0f0f0'
                        onPress={() => reduxUser ? Actions.orders() : Actions.signin()}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: p(20) }} >
                            <Image source={images.icon_order} style={{ width: p(20), height: p(20) }} />
                            <Text style={styles.menuItem}>
                                My Orders
                        </Text>
                        </View>
                    </TouchableHighlight>

                    {
                        reduxUser && reduxUser.type == "user" &&
                        <TouchableHighlight 
                            underlayColor='#f0f0f0'
                            onPress={() => Actions.fav()}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: p(20) }} >
                                <Image source={images.icon_fav} style={{ width: p(20), height: p(20) }} />
                                <Text style={styles.menuItem}>
                                    My Favorites
                                </Text>
                            </View>
                        </TouchableHighlight>
                    }


                    <TouchableHighlight
                        onPress={() => reduxUser ? Actions.messages() : Actions.signin()}
                        underlayColor='#f0f0f0'
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: p(20) }} >
                            <Image source={images.icon_msg} style={{ width: p(20), height: p(20) }} />
                            <Text style={styles.menuItem}>
                                My Messages
                            </Text>
                        </View>
                    </TouchableHighlight>

                    {
                        reduxUser && reduxUser.type == "user" &&
                        <TouchableHighlight onPress={()=>Actions.cart()} underlayColor='#f0f0f0'>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: p(20) }} >
                                <Image source={images.icon_shop} style={{ width: p(20), height: p(20) }} />
                                <Text style={styles.menuItem}>
                                    Shopping Cart
                            </Text>
                            </View>
                        </TouchableHighlight>
                    }


                    <TouchableHighlight underlayColor='#f0f0f0'>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: p(20) }} >
                            <Image source={images.icon_set} style={{ width: p(20), height: p(20) }} />
                            <Text style={styles.menuItem}>
                                Settings
                            </Text>
                        </View>
                    </TouchableHighlight>

                    <TouchableHighlight underlayColor='#f0f0f0'>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: p(20) }} >
                            <Image source={images.icon_contact} style={{ width: p(20), height: p(20) }} />
                            <Text style={styles.menuItem}>
                                Contact Us
                            </Text>
                        </View>
                    </TouchableHighlight>


                    {
                        reduxUser &&
                        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                            <View style={{ width: width / 1.5, height: p(2), backgroundColor: '#f4f3f3', alignSelf: 'center' }}>
                            </View>
                            <TouchableHighlight
                                onPress={() => {
                                    this.signOutUser()
                                }}
                                underlayColor='#f0f0f0'
                            >
                                <View
                                    style={{ flexDirection: 'row', alignItems: 'center', marginLeft: p(20) }}
                                    onPress={() => this.signOutUser()}
                                >
                                    <Image source={images.icon_out} style={{ width: p(20), height: p(20) }} />
                                    <Text style={[styles.menuItem, { color: COLORS.red_color, fontFamily: 'CarinoSans' }]}>
                                        Log Out
                                </Text>
                                </View>
                            </TouchableHighlight>
                        </View>
                    }


                </View>
            </ScrollView>
        );
    }
}

export default connect(
    state => ({
        reduxUser: state.auth.reduxUser,
        messages: state.messages.messages,
        orders: state.orders.orders
    }),
    dispatch => ({
        actions: bindActionCreators(actions, dispatch),
        actionsMSG: bindActionCreators({ ...actionsMSG }, dispatch),
        actionsOrder: bindActionCreators({ ...actionsOrder }, dispatch),
    })
)(SideMenu);

const styles = StyleSheet.create({
    menuItem: {
        padding: p(10),
        marginLeft: p(10),
        backgroundColor: 'transparent',
        fontSize: p(14),
        fontFamily: 'CarinoSans'
    },
    avatar: {
        width: p(130),
        height: p(130),
        borderRadius: p(63),
        borderWidth: p(4),
        borderColor: "white",
        marginBottom: p(10),
        alignSelf: 'center',
        position: 'absolute',
        marginTop: p(130)
    },
    like: {
        width: p(16),
        height: p(16),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: p(9),
        backgroundColor: COLORS.red_color,
        marginRight: p(12)
    }
})