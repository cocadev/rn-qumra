import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, Dimensions, Image, FlatList } from 'react-native';
import { p } from '../../common/normalize';
import { COLORS } from '../../common/colors';
import StarRating from 'react-native-star-rating';
import Icon from 'react-native-vector-icons/AntDesign';
import { Actions } from 'react-native-router-flux';
import ImageCarousel from 'react-native-image-carousel';

// const photoes = [
//     'https://testgolfskiworld.s3.amazonaws.com/photo/NYC-Destination-Senior-Pictures-Carrie-Anne-Photography-387-326x217.jpg',
//     'https://testgolfskiworld.s3.amazonaws.com/photo/NYCSeniorPortraits_AlysonEdie_0034-311x311.jpg',
//     'https://testgolfskiworld.s3.amazonaws.com/photo/new_york_city_engagement_wedding_photography_luxury_julian_ribinik_019.jpg',
//     'https://testgolfskiworld.s3.amazonaws.com/photo/new_york_city_portrait_photographer_0314.jpg',
//     'https://testgolfskiworld.s3.amazonaws.com/photo/shout_it_from_the_rooftops_by_sabrinacichy-d6vfrn1.jpg'
// ]

export default class Modalphotographer extends React.Component {

    _renderContent(idx, props) {

        const myImages = props.photographer;
        const myCarouselPics = myImages.myProfilePics ? myImages.myProfilePics : null

        return (
            <Image
                style={styles.Imgcontainer}
                source={{ uri: myCarouselPics[idx] }}
                resizeMode={'contain'}
            />
        )
    }

    requestPhotographer() {
        if(this.props.currentUser) {
            console.log('this.props.photographer', this.props.photographer)
            Actions.requestPhotographer({
                photographer: this.props.photographer
            })
        } else {
            Actions.signin()
        }
        this.props.onClick();
    }

    render() {

        const item = this.props.photographer;

        if (!item) {
            return false
        }

        const myProfilePics = item.myProfilePics ? item.myProfilePics : null

        // console.log(' myProfilePicsmyProfilePicsmyProfilePics ', myProfilePics)

        return (
            <Modal
                visible={this.props.modal}
                transparent={true}
                onRequestClose={() => { }}
            >
                <View style={styles.indicatorContainer}>

                    <View style={styles.img}>
                        <Image
                            source={{ uri: item.avatar }}
                            style={styles.avatar}
                        />
                    </View>

                    <View style={styles.indicator}>

                        <TouchableOpacity
                            style={{ alignSelf: 'flex-end', margin: p(8) }}
                            onPress={() => this.props.onClick()}
                        >
                            <Icon name='closecircleo' size={p(20)} color={'grey'} />
                        </TouchableOpacity>

                        <Text style={{ fontSize: p(22), color: '#818181', marginTop: p(50), fontFamily: 'CarinoSans' }}>{item.fullName}</Text>

                        <StarRating
                            disabled={true}
                            emptyStar={'ios-star-outline'}
                            fullStar={'ios-star'}
                            halfStar={'ios-star-half'}
                            iconSet={'Ionicons'}
                            maxStars={5}
                            starStyle={{ paddingHorizontal: 1, marginHorizontal: 1, marginLeft: p(-1) }}
                            starSize={p(25)}
                            rating={3}
                            fullStarColor={'#fcb040'}
                        />

                        <Text style={{ fontSize: p(16), color: '#646464', fontFamily: 'CarinoSans' }}>${item.rate} / Photo</Text>

                        <View style={{ flex: 1, marginTop:20, alignItems:'center', justifyContent:'center' }}>
                            <ImageCarousel
                                renderContent={(item) => this._renderContent(item, this.props)}
                            >
                                {myProfilePics 
                                ? myProfilePics.map((item) => (
                                    <Image
                                        key={item}
                                        source={{ uri: item }}
                                        style={styles.imgView}
                                        resizeMode={'cover'}
                                    />
                                ))
                                : <Text style={styles.available}>No available Photos</Text>
                            }
                            </ImageCarousel>
                        </View>

                        <Text style={styles.available}>Available Time : {item.availbility?item.availbility: 'No available'}</Text>

                        <TouchableOpacity
                            onPress={() => {
                                this.props.onClick();
                                this.props.currentUser ? Actions.photographerresume({ uid: item.id, photographer: item }) : Actions.signin()
                            }}
                            style={[styles.btn, { backgroundColor: COLORS.red_color}]}
                        >
                            <Text style={{ fontSize: p(15), color: '#fff', fontFamily: 'CarinoSans-Bold' }}>Check Photographer Profile</Text>

                        </TouchableOpacity>

                        <TouchableOpacity style={styles.btn} onPress={this.requestPhotographer.bind(this)}>
                            <Text style={{ fontSize: p(15), color: '#fff', fontFamily: 'CarinoSans-Bold' }}>Request Photographer</Text>
                        </TouchableOpacity>

                    </View>
                </View>
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
        width: p(270),
        height: p(360),
        marginTop: p(-65),
        borderRadius: p(20),
        shadowColor: "black",
        alignItems: "center",
        justifyContent: "center",
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 3,
        backgroundColor: "white"
    },
    img: {
        zIndex: 2,
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
        borderWidth: p(3),
        borderColor: '#fff',
        backgroundColor:'white'
    },
    btn: {
        width: p(240),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.light_color,
        paddingVertical: p(8),
        marginBottom: p(12),
        borderRadius: 6
    },
    imgView: {
        width: 200,
        height: 150,
        marginHorizontal: 6,
    },
    Imgcontainer: {
        flex: 1,
        backgroundColor: '#111'
    },

    available: {
        fontSize: p(15), 
        fontFamily: 'CarinoSans',
        marginBottom: p(6)
    }
})