import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList, ImageBackground } from 'react-native';
import { p } from '../../common/normalize';
import { COLORS } from '../../common/colors';
import { Actions } from 'react-native-router-flux';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Icon from 'react-native-vector-icons/Ionicons';
import UtilService from '../../common/utils';
import * as orderActions from "../../store/orders/actions";
import * as authActions from "../../store/auth/actions";
import { images } from '../../common/images';
import Label from '../../components/label';

class Orders extends Component {

    _renderItem = ({ item, index }, props) => {

        return (
            <View style={styles.msgView} key={index}>
                <Image source={item && item.avatar ? { uri: item.avatar } : images.img_photographer1} style={styles.avatar} />
                <TouchableOpacity
                    onPress={() => {
                        Actions.orderDetail({ orderFlag: props.reduxUser.type == 'pg' ? item.sender : item.receiver })
                    }
                    }
                    style={{ flex: 1 }}
                >
                    <Label color={UtilService.acceptColor(item.accept)} text={item.accept} />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: p(210) }}>
                        <Text style={[styles.name, { color: 'red' }]}>{item.fullName}</Text>
                    </View>

                    <View style={{ marginTop: p(9) }}>
                        <Text style={styles.content}>
                            {UtilService.getHourMinutes(item.updatedAt ? item.updatedAt : item.createdAt)}
                        </Text>
                        <Text style={styles.content}>{'Order: ' + item.order}</Text>
                    </View>

                </TouchableOpacity>
            </View>
        )
    }

    render() {

        let { orders, reduxUser, navigation } = this.props

        return (
            <View style={styles.container}>
                <Text style={styles.title}>Orders</Text>
                <TouchableOpacity
                    style={{ position: 'absolute', top: p(10), left: p(12) }}
                    onPress={() => navigation.openDrawer()}
                >
                    <Icon name="md-menu" color={COLORS.light_color} size={p(30)} />
                </TouchableOpacity>

                {
                    reduxUser && orders &&
                    <FlatList
                        style={{ marginTop: p(10) }}
                        data={orders}
                        keyExtractor={(item, i) => String(i)}
                        renderItem={(item) => this._renderItem(item, this.props)}
                        extraData={this.props}
                    />
                }

            </View>
        );
    }
}

export default connect(
    state => ({
        orders: state.orders.orders,
        reduxUser: state.auth.reduxUser,
    }),
    dispatch => ({
        orderActions: bindActionCreators({ ...orderActions }, dispatch),
        authActions: bindActionCreators({ ...authActions }, dispatch),
    })
)(Orders);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        alignSelf: 'center',
        fontSize: p(18),
        marginTop: p(10),
        fontFamily: 'CarinoSans-SemiBold'
    },
    avatar: {
        width: p(50),
        height: p(50),
        marginRight: p(20),
        borderRadius: p(26)
    },
    msgView: {
        paddingHorizontal: p(12),
        paddingVertical: p(5),
        backgroundColor: '#f0f0f0',
        flexDirection: 'row',
        borderRadius: 6,
        borderColor: 'grey',
        borderWidth: 0.5,
        alignItems: 'center',
        marginTop: 5,
        marginHorizontal: 12
    },
    name: {
        fontSize: p(18),
        color: '#373737',
        fontFamily: 'CarinoSans'
    },
    content: {
        fontSize: p(12),
        color: '#717171',
        fontFamily: 'CarinoSans',
        lineHeight: p(12)
    }
});
