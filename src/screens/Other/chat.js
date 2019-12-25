import React, { PureComponent } from 'react';
import { StyleSheet, View, Text, Image, FlatList, TextInput, KeyboardAvoidingView, Dimensions, TouchableOpacity, Keyboard, ImageBackground } from 'react-native';
import { COLORS } from '../../common/colors';
import { p } from '../../common/normalize';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Actions } from 'react-native-router-flux';

import Icon from 'react-native-vector-icons/Ionicons';

import * as msgActions from "../../store/messages/actions";
import * as authActions from "../../store/auth/actions";
import firebaseAPI from '../../common/firebaseAPI';
import _ from 'underscore'
import UtilService from '../../common/utils';
import { images } from '../../common/images';

const width = Dimensions.get('window').width

class Chat extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            chats: null,
            chatdata: [],
            isLoading: false
        };
    }

    componentDidMount() {

        var myIndex = _.findIndex(this.props.messages, (u) => {
            return u[0].sender == this.props.qumraId || u[0].receiver == this.props.qumraId
        })
        var mapping = _.sortBy(this.props.messages[myIndex], 'createdAt').reverse()
        this.setState({ chats: mapping })
    }

    componentDidUpdate(prevProps, state) {
        if (prevProps.messages !== this.props.messages) {
            var myIndex = _.findIndex(this.props.messages, (u) => {
                return u[0].sender == this.props.qumraId || u[0].receiver == this.props.qumraId
            })
            var mapping = _.sortBy(this.props.messages[myIndex], 'createdAt').reverse()

            if (mapping.length !== 0) {
                this.setState({ chats: mapping })
            }


        }
    }

    _renderItem = ({ item }) => (
        <View style={{ flexDirection: 'column', marginHorizontal: p(12), marginTop: p(8), alignItems: item.sender == this.props.reduxUser.qumraId ? 'flex-end' : 'flex-start', flex: 1 }}>
            <View style={{ flexDirection: 'row', marginTop: 2, alignItems: 'flex-end', }}>
                {
                    item.sender !== this.props.reduxUser.qumraId && <Image source={this.props.avatar ? { uri: this.props.avatar } : images.img_photographer1} style={styles.avatar} />
                }
                {
                    item.sender !== this.props.reduxUser.qumraId &&
                    <View style={styles.nameView}>
                        <Text style={{ paddingHorizontal: p(5), color: '#7f8083', fontSize: p(8), fontFamily: 'CarinoSans-SemiBold', color: '#fff' }}>{this.props.fullName}</Text>
                    </View>
                }
            </View>
            <View style={[styles.contentbox, item.sender == this.props.reduxUser.qumraId ? { borderTopRightRadius: 0, backgroundColor: '#007acc' } : { borderTopLeftRadius: 0 }]}>
                <Text uppercase={false} style={[styles.itemText, { paddingHorizontal: 9, paddingVertical: 7, fontSize: p(13) }]}>{item.text}</Text>
            </View>
            <Text style={styles.timeText}>{UtilService.getHourMinutes(item.createdAt)}</Text>

        </View>
    );

    _ItemSeparator = () => <View style={styles.separator} />;

    render() {

        const { message, chats } = this.state;

        return (

            <KeyboardAvoidingView
                enabled
                behavior='padding'
                keyboardVerticalOffset={20}
                style={styles.container}
            >
                <View style={styles.header}>

                    <Text style={styles.title}>Chat</Text>

                    <TouchableOpacity
                        style={{ position: 'absolute', top: p(5), left: p(2) }}
                        onPress={() => { Actions.pop() }}
                    >
                        <Icon name="ios-arrow-round-back" color={COLORS.light_color} size={p(36)} />
                    </TouchableOpacity>
                </View>


                <View style={{ flex: 1 }}>
                    <FlatList
                        style={{ marginBottom: 1, }}
                        inverted
                        data={chats}
                        keyExtractor={(item, i) => String(i)}
                        renderItem={this._renderItem}
                        ItemSeparatorComponent={this._ItemSeparator}
                    />
                </View>

                <View style={{ flexDirection: 'row', marginBottom: p(2), padding: p(12) }}>
                    <TextInput
                        style={styles.message}
                        uppercase={false}
                        onChangeText={(message) => this.setState({ message })}
                        value={message}
                    />
                    <TouchableOpacity
                        disabled={message == null ? true : false}
                        style={[styles.btn, { backgroundColor: (message == null ? '#E88E93' : COLORS.red_color) }]}
                        onPress={() => this._onSend()}
                    >
                        <Text style={styles.sendText}>Send</Text>
                    </TouchableOpacity>
                </View>

            </KeyboardAvoidingView>

        );
    }

    _onSend = () => {
        Keyboard.dismiss();
        const currentUserUid = this.props.reduxUser.qumraId
        const { qumraId } = this.props
        const { message } = this.state
        this.setState({ message: null })
        firebaseAPI.sendMessage(currentUserUid, qumraId, message)
    }
}

export default connect(
    state => ({
        reduxUser: state.auth.reduxUser,
        messages: state.messages.messages
    }),
    dispatch => ({
        msgActions: bindActionCreators(msgActions, dispatch),
        authActions: bindActionCreators(authActions, dispatch),
    })
)(Chat);

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        borderBottomColor: COLORS.light_color,
        borderBottomWidth: 1,
        paddingBottom: p(6),
        marginHorizontal: p(12)
    },
    title: {
        alignSelf: 'center',
        fontSize: p(18),
        marginTop: p(10),
        fontFamily: 'CarinoSans-SemiBold'
    },
    headBox: {
        borderLeftColor: '#00d014',
        borderLeftWidth: p(5),
        elevation: 5
    },
    itemText: {
        fontSize: p(12),
        fontFamily: 'CarinoSans-SemiBold',
        color: '#fff'
    },
    content: {
        marginTop: p(20),
        flexDirection: 'column',
        flex: 1
    },
    message: {
        height: p(30),
        borderColor: '#fff',
        borderRadius: p(5),
        borderWidth: 1,
        flex: 1,
        backgroundColor: '#fff',
        fontSize: p(16),
        // fontFamily: 'CarinoSans',
        paddingLeft: p(10)
    },
    avatar: {
        width: p(42),
        height: p(42),
        borderRadius: p(22),
        borderColor: '#fff',
        borderWidth: 2,
        backgroundColor: '#fff',
        zIndex: 10,
    },
    contentbox: {
        flexDirection: 'row',
        borderRadius: p(7),
        padding: p(2),
        marginTop: p(-5.5),
        backgroundColor: '#fff',
        maxWidth: width / 1.2,
        minWidth: p(140),
        backgroundColor: '#01d867',
        borderRadius: 20
    },
    separator: {
        height: p(12),
    },
    btn: {
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: p(15),
        backgroundColor: COLORS.red_color,
        borderRadius: p(5)
    },
    sendText: {
        fontSize: p(12),
        paddingHorizontal: p(20),
        color: '#fff',
        fontFamily: 'CarinoSans-Bold'
    },
    nameView: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        zIndex: 15,
        marginBottom: p(4.5),
        backgroundColor: '#397227',
        borderRadius: p(12)
    },
    timeText: {
        color: '#a0a0a0',
        fontSize: p(9),
        fontFamily: 'CarinoSans-SemiBold',
        marginHorizontal: p(3)
    }

});
