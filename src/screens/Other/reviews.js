import React, { Component } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image, Dimensions } from 'react-native';
import { p } from '../../common/normalize';
import { COLORS } from '../../common/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import StarRating from 'react-native-star-rating';
import firebaseAPI from '../../common/firebaseAPI'
import TimeAgo from 'react-native-timeago';


export default class Reviews extends Component {

    constructor() {
        super();
        this.state = {
            reviews: []
        }
    }

    componentDidMount() {
        firebaseAPI.getPgReviews()
            .then((res) => this.setState({ reviews: res }))
            .catch((e) => console.log('~ e getPgReviews ~', e))
    }

    _renderItem = ({ item, index }) => {

        return (
            <View style={styles.msgView} key={index}>
                <View style={styles.bar}>
                    <View>
                        <StarRating
                            disabled={true}
                            maxStars={5}
                            rating={item.rating}
                            fullStarColor={'gold'}
                            starSize={p(22)}
                            starStyle={{ paddingLeft: p(6) }}
                        />
                        <Text style={styles.content}>
                            <TimeAgo time={item.date} interval={5000} />
                        </Text>
                    </View>
                    <Image source={{ uri: item.userAvatar }} style={styles.avatar} />
                </View>
                <View style={{ paddingHorizontal: p(12) }}>
                    <Text style={styles.titleText}>{item.userName}</Text>
                    <Text style={styles.description}>{item.review}</Text>
                </View>
            </View>
        )
    }

    render() {

        const { reviews } = this.state

        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.back} onPress={() => Actions.pop()}>
                        <Icon name="ios-arrow-round-back" color={COLORS.light_color} size={p(36)} />
                    </TouchableOpacity>
                    <Text style={[styles.text, { color: COLORS.light_color }]}>Reviews</Text>
                </View>
                {
                    <FlatList
                        style={{ marginTop: p(10) }}
                        data={reviews}
                        keyExtractor={(item, i) => String(i)}
                        renderItem={this._renderItem}
                    />
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: p(10)
    },
    back: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'flex-start',
        top: p(-8),
        left: p(12),
        width: p(40),
        height: p(40),
    },
    bar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: p(7),
        paddingBottom: 0
    },
    header: {
        marginTop: p(20),
        height: p(30),
    },
    text: {
        color: COLORS.red_color,
        fontSize: p(14),
        alignSelf: 'center'
    },
    msgView: {
        borderTopColor: 'grey',
        borderTopWidth: p(1.4)
    },
    description: {
        fontSize: p(12),
    },
    titleText: {
        fontSize: p(15),
        fontWeight: '600'
    },
    avatar: {
        width: p(40),
        height: p(40),
        borderRadius: p(20)
    },
    content: {
        fontSize: p(10),
        marginLeft: p(6),
        color: COLORS.red_color
    }
});
