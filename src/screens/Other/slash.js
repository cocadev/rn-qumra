import React from 'react';
import { View, Text, Image, StyleSheet, ImageBackground } from 'react-native';
import { p } from '../../common/normalize';
import { COLORS } from '../../common/colors';
import { images } from '../../common/images';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as actions from "../../store/auth/actions";
import * as actionsMSG from "../../store/messages/actions";
import * as actionsOrder from "../../store/orders/actions";
import * as actionsCommon from "../../store/common/actions";

import firebase from 'firebase';

class Splash extends React.Component {

    componentDidMount() {
        this.props.actionsCommon.loadPgs()
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.props.actions.getUser(user)
                    .then((res) => {
                        res.type == 'user'
                            ? this.props.actionsOrder.getUserOrders(res).then(() => this.props.onClick(res.type == 'pg' ? 2 : 1))
                            : this.props.actionsOrder.getPhotographerOrders(res).then(() => this.props.onClick(res.type == 'pg' ? 2 : 1))
                        this.props.actionsMSG.groupMessages(res);
                    })
                    .catch(e => console.log('**********', e))
            } else {
                this.props.onClick(0)
            }
        })
    }

    render() {
        return (
            <View
                style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
            >
                <Image source={images.logo} style={styles.img} />
                <Text style={{ color: COLORS.dark, fontSize: p(14), textAlign: 'center' }}>
                    Everyone's Private Photographer
                </Text>
            </View>
        );
    }
}

export default connect(
    state => ({
        reduxUser: state.reduxUser,
        messages: state.messages,
        orders: state.orders
    }),
    dispatch => ({
        actions: bindActionCreators({ ...actions }, dispatch),
        actionsMSG: bindActionCreators({ ...actionsMSG }, dispatch),
        actionsOrder: bindActionCreators({ ...actionsOrder }, dispatch),
        actionsCommon: bindActionCreators({ ...actionsCommon }, dispatch),
    })
)(Splash);

const styles = StyleSheet.create({
    img: {
        width: p(50),
        height: p(50),
        marginBottom: p(12)
    }
})