import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions, ScrollView, TextInput, TouchableWithoutFeedback } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { p } from '../../common/normalize';
import { COLORS } from '../../common/colors';
import { images } from '../../common/images';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Icon from 'react-native-vector-icons/Ionicons';
import MapView from 'react-native-maps';
import * as actions from "../../store/auth/actions";
import * as orderActions from "../../store/orders/actions";
import UtilService from '../../common/utils';
import _ from 'underscore'
import StarRating from 'react-native-star-rating';
import ValidationService from '../../common/validation';
import MasonryList from "react-native-masonry-list";
import getDirections from 'react-native-google-maps-directions'

const { width } = Dimensions.get('window');

class OrderUser extends React.Component {

    constructor(props) {
        super(props);

        var orderIndex = _.findIndex(props.orders, (u) => {
            return u.receiver == props.orderFlag
        })
        var order = props.orders[orderIndex]

        this.state = {
            msg: '',
            modal: false,
            latitude: order.latitude,
            longitude: order.longitude,
            isWaiting: false,
            starCount: 0,
            review: null,
            images: []
        }
    }

    componentDidMount() {
        var filterd = null
        this.setState({ images: [] })
        const { orders, orderFlag } = this.props

        var orderIndex = _.findIndex(orders, (u) => {
            return u.receiver == orderFlag
        })
        var order = orders[orderIndex]

        if (order && order.photoes) {
            x = order.photoes;
            filterd = []
            Object.keys(order.photoes).map(function (_) {
                filterd.push({ id: idGenerator(), uri: order.photoes[_] })
            })
            if (filterd.length !== 0) {
                this.setState({ images: filterd })
                filterd = null
            }
        }
    }

    sendRequest(myview) {

        const { orders, reduxUser, orderActions, orderFlag } = this.props

        var orderIndex = _.findIndex(orders, (u) => {
            return u.receiver == orderFlag
        })

        const opposite = orders[orderIndex].receiver
        orderActions.sendRequest(reduxUser, opposite, myview)
        this.setState({ isWaiting: !this.state.isWaiting })
    }

    btnView1() {
        return (
            <View style={{ marginTop: p(30) }}>
                <TouchableOpacity
                    style={[styles.btn, { backgroundColor: COLORS.red_color }]}
                    onPress={() => this.sendRequest('accepted')}
                >
                    <Text style={styles.btnText}>Accept Request</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btn} onPress={() => this.sendRequest('rejected')}>
                    <Text style={styles.btnText}>Reject Request</Text>
                </TouchableOpacity>
            </View>
        )
    }

    btnOpen() {
        return (
            <View style={{ marginTop: p(30) }}>
                <View style={{ backgroundColor: '#f0f0f0', marginVertical: p(12) }}>

                    <MasonryList
                        rerender={true}
                        sorted
                        images={this.state.images}
                        columns={2}
                        imageContainerStyle={{
                            borderRadius: p(7),
                        }}
                        renderIndividualHeader={(data) => {
                            return (
                                <TouchableWithoutFeedback
                                    style={{ padding: p(4) }}
                                    onPress={() => Actions.photo({ image: data.source.uri, dimensions: data.dimensions })}>
                                    <View style={styles.masonryHeader}>
                                        <Text style={{ fontSize: p(9), color: '#fff' }}>{'Details'}</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                            );
                        }}
                    />
                </View>

            </View>
        )
    }

    btnConfirm() {
        return (
            <View style={{ marginTop: p(30) }}>
                <TouchableOpacity
                    style={[styles.btn, { backgroundColor: COLORS.red_color }]}
                    onPress={() => this.sendRequest('opened')}
                >
                    <Text style={styles.btnText}>Confirm Meeting</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.btn} onPress={this.handleGetDirections}>
                    <Text style={styles.btnText}>Go To Map</Text>
                </TouchableOpacity>

            </View>
        )
    }

    onStarRatingPress(rating) {
        this.setState({
            starCount: rating
        });
    }

    review(user) {
        const { review, starCount } = this.state
        if (ValidationService.giveReview(review, starCount)) {
            return false
        }
        this.props.actions.givePhotographerReview(this.props.reduxUser.uid, user.id, starCount, review)
            .then((res) => this.sendRequest('reviewed'))
    }

    btnReview(user) {
        return (
            <View style={{ marginTop: p(30) }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: width }}>
                    <StarRating
                        maxStars={5}
                        rating={this.state.starCount}
                        fullStarColor={'gold'}
                        starSize={p(30)}
                        starStyle={styles.start}
                        selectedStar={(rating) => this.onStarRatingPress(rating)}
                    />
                </View>
                <Text style={styles.titleText}>Review</Text>
                <TextInput
                    multiline
                    style={styles.textinput}
                    placeholder={'Awesome!'}
                    onChangeText={(review) => this.setState({ review })}
                    value={this.state.review}
                />

                <TouchableOpacity
                    style={[styles.btn, { backgroundColor: COLORS.red_color, marginTop: p(20) }]}
                    onPress={() => this.review(user)}
                >
                    <Text style={styles.btnText}>Publish Review</Text>
                </TouchableOpacity>
            </View>
        )
    }

    handleGetDirections = () => {
        const { reduxUser } = this.props
        const data = {
            source: {
                latitude: parseFloat(reduxUser.location.split(",", 2)[0]),
                longitude: parseFloat(reduxUser.location.split(",", 2)[1])
            },
            destination: {
                latitude: this.state.latitude,
                longitude: this.state.longitude
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
        }

        getDirections(data)
    }

    render() {

        var { orders, orderFlag } = this.props;

        var orderIndex = _.findIndex(orders, (u) => {
            return u.receiver == orderFlag
        })

        var order = orders[orderIndex];

        return (
            <View style={{ flex: 1, paddingHorizontal: p(12) }}>

                <View style={styles.header}>
                    <TouchableOpacity style={styles.back} onPress={() => Actions.pop()}>
                        <Icon name="ios-arrow-round-back" color={COLORS.light_color} size={p(36)} />
                    </TouchableOpacity>
                    <Text style={[styles.text, { color: COLORS.light_color, fontFamily: 'CarinoSans-SemiBold', fontSize: p(18) }]}>Order Detail</Text>
                </View>

                <View keyboardVerticalOffset={p(50)}>
                    <ScrollView>

                        <View style={{ flexDirection: 'row', paddingVertical: p(12), alignItems: 'center' }}>
                            <Image source={order && order.avatar ? { uri: order.avatar } : images.img_photographer1} style={styles.avatar} />
                            <View>
                                <Text style={styles.title}>{order.fullName}</Text>
                                <Text style={styles.dateText}>
                                    {UtilService.getHourMinutes(order.updatedAt ? order.updatedAt : order.createdAt)}
                                </Text>
                            </View>
                            <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                <View style={[styles.order, { backgroundColor: UtilService.acceptColor(order.accept), marginTop: p(35) }]}>
                                    <Text style={styles.content}>{order.accept}</Text>
                                </View>
                            </View>

                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={styles.itemText}>{'Rate: $' + order.rate + ' per photo'}</Text>
                            <Text style={styles.itemText}>{'Order: ' + order.order}</Text>
                        </View>

                        {
                            order.accept == ('pending' || 'accepted') &&
                            <View style={styles.item}>
                                <Text style={styles.itemText}>Meeting Location: </Text>

                                <MapView
                                    provider={this.props.provider}
                                    style={{ width: width, height: p(150), marginTop: p(5) }}
                                    region={{
                                        latitude: this.state.latitude,
                                        longitude: this.state.longitude,
                                        latitudeDelta: 0.004,
                                        longitudeDelta: 0.007,
                                    }}
                                >
                                    <MapView.Marker
                                        coordinate={{
                                            latitude: this.state.latitude,
                                            longitude: this.state.longitude,
                                            latitudeDelta: 0.004,
                                            longitudeDelta: 0.007,
                                        }}
                                    >
                                        <Image source={images.marker_area} style={{ width: p(20), height: p(26) }} />
                                    </MapView.Marker>
                                </MapView>

                                <TouchableOpacity style={styles.btn} onPress={this.handleGetDirections}>
                                    <Text style={styles.btnText}>Go To Map</Text>
                                </TouchableOpacity>

                            </View>
                        }

                        {
                            order.accept == 'accepted' &&
                            this.btnConfirm()
                        }

                        {
                            order.accept == ('closed') &&
                            this.btnOpen()
                        }

                        {
                            order.accept == ('opened') &&
                            this.btnOpen()
                        }

                        {/* {
                            order.accept == 'closed' &&
                            this.btnReview(order)
                        } */}

                        <Text style={{ alignSelf: 'center', fontSize: p(14), marginTop: p(30), textAlign: 'center', fontFamily: 'CarinoSans' }}>
                            {UtilService.getOrderSituation1(order.accept)}
                        </Text>

                    </ScrollView>
                </View>

            </View>
        );
    }
}

export default connect(
    state => ({
        reduxUser: state.auth.reduxUser,
        orders: state.orders.orders,
    }),
    dispatch => ({
        actions: bindActionCreators({ ...actions }, dispatch),
        orderActions: bindActionCreators({ ...orderActions }, dispatch)
    })
)(OrderUser);

const styles = StyleSheet.create({
    back: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'flex-start',
        top: p(-4),
        width: p(40),
        height: p(40),
    },
    header: {
        marginTop: p(10),
        height: p(30),
        borderBottomWidth: 1,
        borderBottomColor: COLORS.light_color,
    },
    avatar: {
        width: p(60),
        height: p(60),
        borderRadius: p(31)
    },
    title: {
        color: COLORS.light_color,
        fontSize: p(21),
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
        marginTop: p(4),
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
        marginTop: p(4),
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
        fontSize: p(13)
    },
    itemText: {
        fontFamily: 'CarinoSans',
        color: COLORS.light_color,
        fontSize: p(14)
    },
    dateText: {
        fontFamily: 'CarinoSans',
        color: 'grey',
        fontSize: p(12),
        marginLeft: p(20)
    },
    texinput: {
        marginTop: p(7),
        height: p(100),
        fontSize: p(11),
        lineHeight: p(17),
        borderColor: 'gray',
        borderWidth: p(2)
    },
    order: {
        width: p(80),
        height: p(20),
        alignItems: 'center',
        borderRadius: p(5)
    },
    content: {
        fontFamily: 'CarinoSans-SemiBold',
        fontSize: p(13),
        color: '#fff'
    },
    start: {
        paddingHorizontal: p(5)
    },
    textinput: {
        // width: p(130),
        height: p(100),
        textAlignVertical: 'top',
        padding: p(6),
        fontSize: p(15),
        borderColor: '#333',
        borderWidth: p(1.2)
    },
    titleText: {
        fontSize: p(15),
        marginTop: p(12)
    },
    masonryHeader: {
        position: "absolute",
        zIndex: 10,
        right: p(5),
        bottom: p(5),
        flexDirection: "row",
        borderRadius: p(12),
        paddingHorizontal: p(5),
        alignItems: "center",
        backgroundColor: "rgba(150,150,150,0.8)"
    },


})

function idGenerator() {
    return Math.random().toString(36).substr(2, 9);
}