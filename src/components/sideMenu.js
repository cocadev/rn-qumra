import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { images } from '../common/images';
import { p } from '../common/normalize';
import { Actions } from 'react-native-router-flux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import StarRating from 'react-native-star-rating';

const width = Dimensions.get('window').width

import { COLORS } from '../common/colors';

export default class SideMenu extends Component {
    render() {
        return (
            <View style={{ flex: 1 }}>
                <Image source={images.img_photographer1}
                    style={{
                        width: p(130),
                        height: p(130),
                        borderRadius: p(65),
                        borderWidth: p(4),
                        borderColor: "white",
                        marginBottom: p(5),
                        alignSelf: 'center',
                        marginTop: p(10)
                    }}
                />

                <View style={{ width: p(100), alignSelf: 'center'}}>
                    <StarRating
                        disabled={true}
                        emptyStar={'ios-star-outline'}
                        fullStar={'ios-star'}
                        halfStar={'ios-star-half'}
                        iconSet={'Ionicons'}
                        maxStars={5}
                        starStyle={{ paddingHorizontal: 1, marginHorizontal: 1, marginLeft: p(-1)}}
                        starSize={p(25)}
                        rating={3}
                        fullStarColor={'#fcb040'}
                    />
                </View>

                <Text style={{ alignSelf: 'center', marginBottom: p(5), fontSize: p(14) }}> Hi There!</Text>

                <View style={{ width: width / 1.5, height: p(2), backgroundColor: '#f4f3f3', alignSelf: 'center', marginBottom: p(5) }}>

                </View>

                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => Actions.signin()}>
                    <MaterialCommunityIcons style={{ marginHorizontal: p(12), width: p(30) }} name="home-outline" color={COLORS.light_color} size={p(26)} />
                    <Text style={styles.menuItem}>
                        Home
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => Actions.profile()}>
                    <SimpleLineIcons style={{ marginHorizontal: p(12), width: p(30) }} name="user" color={COLORS.light_color} size={p(26)} />
                    <Text style={styles.menuItem}>
                        My Account
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => Actions.orders()}>
                    <Ionicons style={{ marginHorizontal: p(12), width: p(30) }} name="ios-albums" color={COLORS.light_color} size={p(26)} />
                    <Text style={styles.menuItem}>
                        My Orders
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => Actions.signin()}>
                    <Ionicons style={{ marginHorizontal: p(12), width: p(30) }} name="ios-heart-empty" color={COLORS.light_color} size={p(26)} />
                    <Text style={styles.menuItem}>
                        My Favorites
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => Actions.signin()}>
                    <MaterialIcons style={{ marginHorizontal: p(12), width: p(30) }} name="mail-outline" color={COLORS.light_color} size={p(26)} />
                    <Text style={styles.menuItem}>
                        My Messages
                    </Text>
                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                        <View style={styles.like}>
                            <Text style={{ color: COLORS.white }}>12</Text>
                        </View>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => Actions.signin()}>
                    <MaterialIcons style={{ marginHorizontal: p(12), width: p(30) }} name="payment" color={COLORS.light_color} size={p(26)} />
                    <Text style={styles.menuItem}>
                        Payment
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => Actions.requestPhotographer()}>
                    <MaterialCommunityIcons style={{ marginHorizontal: p(12), width: p(30) }} name="account-switch" color={COLORS.light_color} size={p(26)} />
                    <Text style={styles.menuItem}>
                        Switch to Photographer
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => Actions.signin()}>
                    <MaterialCommunityIcons style={{ marginHorizontal: p(12), width: p(30) }} name="settings" color={COLORS.light_color} size={p(26)} />
                    <Text style={styles.menuItem}>
                        Settings
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => Actions.test()}>
                    <MaterialCommunityIcons style={{ marginHorizontal: p(12), width: p(30) }} name="account-settings" color={COLORS.light_color} size={p(26)} />
                    <Text style={styles.menuItem}>
                        Contact Us
                    </Text>
                </TouchableOpacity>

                <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                    <View style={{ width: width / 1.5, height: p(2), backgroundColor: '#f4f3f3', alignSelf: 'center' }}>
                    </View>
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', }} onPress={() => Actions.signin()}>
                        <AntDesign style={{ marginHorizontal: p(12), width: p(30) }} name="logout" color={COLORS.red_color} size={p(23)} />
                        <Text style={[styles.menuItem, { color: COLORS.red_color }]}>
                            Log Out
                        </Text>
                    </TouchableOpacity>
                </View>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    menuItem: {
        padding: p(10),
        borderTopWidth: p(1),
        borderColor: '#d2d5d9',
        borderWidth: p(0.4),
        backgroundColor: 'white',
        fontSize: p(14),
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