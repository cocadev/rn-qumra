import React from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, StyleSheet } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { p } from '../../common/normalize';
import { COLORS } from '../../common/colors';
import { images } from '../../common/images';
import Icon from 'react-native-vector-icons/Ionicons';

export default class RequestPhotographer extends React.Component {

    constructor() {
        super();
        this.state = {
            text: 'Request Photographer: When customer clicks on request photographer, he/she will be directed into a form screen where he/she should confirm location, time and photographer rate in addition to sample request message that should be sent to photographer'
        }
    }

    render() {
        return (
            <View style={{ flex: 1, padding: p(12) }}>

                <TouchableOpacity style={styles.back} onPress={() => Actions.pop()}>
                    <Icon name="ios-arrow-round-back" color={COLORS.light_color} size={p(36)} />
                </TouchableOpacity>

                <View style={styles.header}>
                    <Text style={[styles.text, { color: COLORS.light_color }]}>Request Photographer</Text>
                </View>

                <View style={{ flexDirection: 'row', paddingVertical: p(12), alignItems: 'center' }}>
                    <Image source={{ uri: 'https://cdn2.stylecraze.com/wp-content/uploads/2013/06/He-Zi-1.jpg' }} style={styles.avatar} />
                    <Text style={styles.title}>Diana Walen</Text>
                </View>

                <Text style={styles.text}>{'Rate: $9 per photo\nAvailability: until 2pm'}</Text>

                <View style={styles.item}>
                    <Text style={styles.itemText}>Where to meet?</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: p(12) }}>
                        <Image source={images.markder_user} style={styles.marker} />
                        <Text style={styles.itemText}>Current Location</Text>
                    </View>
                    <Text style={[styles.text, { alignSelf: 'flex-start', marginLeft: p(16) }]}>Diana will meet you at your current location</Text>
                </View>

                <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                    <Text style={styles.itemText}>Send a message to Diana:</Text>

                    <TextInput
                        style={styles.texinput}
                        multiline
                        onChangeText={(text) => this.setState({ text })}
                        value={this.state.text}
                    />

                    <TouchableOpacity style={styles.btn}>
                        <Text style={styles.btnText}>Send Request</Text>
                    </TouchableOpacity>
                </View>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    back:{
        position: 'absolute', 
        justifyContent: 'center',
        alignItems: 'flex-start',
        left: p(12), 
        top: p(3), 
        width: p(40), 
        height: p(40),
    },
    header: {
        height: p(30),
        borderBottomWidth: p(2),
        borderBottomColor: COLORS.light_color,
    },
    avatar: {
        width: p(100),
        height: p(100),
        borderRadius: p(50)
    },
    title: {
        color: COLORS.light_color,
        fontSize: p(25),
        fontWeight: '600',
        marginLeft: p(22)
    },
    text: {
        color: COLORS.red_color,
        fontSize: p(14),
        alignSelf: 'center'
    },
    item: {
        marginTop: p(15),
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
        height: p(40),
        borderRadius: p(6),
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnText: {
        color: COLORS.white,
        fontSize: p(16)
    },
    itemText: {
        color: COLORS.light_color,
        fontSize: p(14)
    },
    texinput: {
        marginTop: p(7),
        fontSize: p(11),
        lineHeight: p(17),
        borderColor: 'gray',
        borderWidth: p(2)
    }

})