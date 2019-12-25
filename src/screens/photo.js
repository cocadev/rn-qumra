import React, { Component } from "react";
import { Text, StyleSheet, Dimensions, Image, View, TouchableOpacity, ImageBackground } from "react-native";
import { p } from "../common/normalize";
import { COLORS } from "../common/colors";
import { Actions } from "react-native-router-flux";
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { images } from "../common/images";

const width = Dimensions.get('window').width
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  btn: {
    marginTop: p(30),
    backgroundColor: COLORS.light_color,
    width: p(180),
    height: p(30),
    borderRadius: p(6),
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center'
  },
  btnText: {
    color: COLORS.white,
    fontSize: p(13)
  },
  qumra: {
    opacity: 0.5,
    width: p(110),
    height: p(25),
    transform: [
      { rotate: "45deg" },
    ],
  }
});

export default class Photo extends Component {

  constructor() {
    super();
    this.state = {
      fav: false
    }
  }

  render() {
    const { fav } = this.state
    const { dimensions } = this.props

    // const mySize = dimensions.width / dimensions.height
    const mySize = 1.75

    return (
      <View style={styles.container}>

        <View style={{ width: width, paddingLeft: p(5) }}>

          <TouchableOpacity
            style={{ alignItems: 'flex-start' }}
            onPress={() => Actions.pop()}
          >
            <MaterialCommunityIcons name="arrow-left" color={COLORS.white} size={p(28)} />
          </TouchableOpacity>
        </View>

        <ImageBackground
          resizeMode='contain'
          source={{ uri: this.props.image }}
          style={{ width: width, height: width, justifyContent: 'center', alignItems: 'center' }}
        >
          <View style={{ flexDirection: 'row' }}>
          <Image source={images.logo_white} style={[styles.qumra, { marginTop: p(20)}]}/>
            <Image source={images.logo_white} style={[styles.qumra, { marginTop: p(20)}]}/>
          </View>

          <View style={{ flexDirection: 'row' }}>
            <Image source={images.logo_white} style={[styles.qumra, { marginTop: p(50)}]}/>
            <Image source={images.logo_white} style={[styles.qumra, { marginTop: p(50)}]}/>
          </View>

        </ImageBackground>

        <TouchableOpacity 
          onPress={() => this.setState({ fav: !fav })}
          style={{ alignSelf: 'flex-start', marginLeft: p(12)}}
        >
          <Icon
            name={fav ? "ios-heart" : "ios-heart-empty"}
            color={COLORS.white}
            size={p(20)}
            style={{ marginTop: p(5) }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, { backgroundColor: COLORS.red_color }]}
        >
          <Text style={styles.btnText}>Add to Cart</Text>
        </TouchableOpacity>


      </View>
    );
  }
}

