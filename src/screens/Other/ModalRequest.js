import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { p } from '../../common/normalize';
import { COLORS } from '../../common/colors';
import { images } from '../../common/images';
import Icon from 'react-native-vector-icons/Ionicons';

export default class ModalRequest extends React.Component {

    _renderItem = ({ item }) => (
        <Image source={{ uri: item }} style={styles.imgView} />
    )

    render() {

        const item = this.props.photographer;

        if (!item) {
            return false
        }

        return (
            <Modal
                visible={this.props.modal}
                transparent={true}
                onRequestClose={() => { }}
            >
                <ImageBackground
                    source={images.bg_modal}
                    style={styles.indicatorContainer}>

                    <View style={styles.img}>
                        <Image
                            source={{ uri: item.avatar }}
                            style={styles.avatar}
                        />
                    </View>

                    <View style={styles.indicator}>

                        <Text style={{ fontSize: p(22), color: '#818181', marginTop: p(20), fontFamily: 'CarinoSans' }}>{item.fullName}</Text>
                        <Text style={{ fontSize: p(16), color: '#fff', fontFamily: 'CarinoSans' }}>Requested Accepted</Text>
                        <Text style={{ fontSize: p(16), color: '#B8B7C3', marginVertical: p(12), alignSelf: 'flex-start', fontFamily: 'CarinoSans' }}>Meet {item.fullname} ?</Text>

                        <View style={{ flexDirection: 'row', alignSelf: 'flex-end', marginTop: p(15) }}>
                            
                            <TouchableOpacity
                                style={styles.icon}
                                onPress={() => this.props.onClick()}
                            >
                                <Icon name='ios-close' size={p(26)} color={'#fff'} />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.icon, { backgroundColor: '#00B294' }]}
                                onPress={() => this.props.onClick()}
                            >
                                <Icon name='ios-checkmark' size={p(26)} color={'#fff'} />
                            </TouchableOpacity>

                        </View>

                    </View>
                </ImageBackground>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    indicatorContainer: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        alignItems: "center",
        justifyContent: "center"
    },
    indicator: {
        width: p(330),
        height: p(260),
        padding: p(20),
        marginTop: p(-45),
        borderRadius: p(20),
        shadowColor: "black",
        alignItems: "center",
        justifyContent: "center",
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 3,
        backgroundColor: "#2A2C43"
    },
    img: {
        zIndex: 2,
        backgroundColor: '#fff',
        shadowColor: "black",
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 3,
        elevation: p(5),
        borderRadius: p(65),
    },
    avatar: {
        width: p(130),
        height: p(130),
        borderRadius: p(65),
        borderWidth: p(8),
        borderColor: '#fff'
    },
    btn: {
        width: p(270),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.light_color,
        paddingVertical: p(8),
        marginBottom: p(12),
        borderRadius: p(20)
    },
    imgView: {
        width: p(100),
        height: p(100),
        marginHorizontal: p(12),
        borderRadius: p(8)
    },
    icon: {
        width: p(40),
        height: p(40),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: p(22),
        marginHorizontal: p(10),
        backgroundColor: COLORS.red_color
    }
})