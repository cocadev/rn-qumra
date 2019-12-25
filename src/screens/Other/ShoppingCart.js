import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList } from 'react-native';
import { p } from '../../common/normalize';
import { COLORS } from '../../common/colors';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as authActions from "../../store/auth/actions";
import _ from 'underscore'
import Icon from 'react-native-vector-icons/Ionicons';

const demoCarts = [
  { img: 'https://images.pexels.com/photos/247878/pexels-photo-247878.jpeg', cartId: 'IMG2019', name: 'Alexa', price: 5 },
  { img: 'https://akns-images.eonline.com/eol_images/Entire_Site/201983/rs_1024x759-190903112947-1024-Can-Yaman.cm.9319.jpg', cartId: 'IMG2022', name: 'Alexa', price: 15 }
]

class ShoppingCart extends Component {

  constructor(props) {
    super(props);
    this.state = {
      chats: null,
      chatdata: [],
      isLoading: false
    };
  }

  _renderItem = ({ item, index }) => {

    return (
      <View style={styles.msgView} key={index}>

        <View style={{ elevation: 3, }}>
          <Image source={{ uri: item.img }} style={styles.avatar} />
        </View>

        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: p(230), }}>
            <Text style={[styles.name, { color: 'green' }]}>{item.cartId}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text ellipsizeMode='tail' numberOfLines={1} style={styles.content}>{item.name + " 's photo session"}</Text>
            <Text style={styles.contentC}>
              ${item.price}
            </Text>
          </View>

        </View>
      </View>
    )
  }

  render() {

    let { reduxUser } = this.props

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Shopping Cart</Text>
        <TouchableOpacity
          style={{ position: 'absolute', top: p(8), left: p(12) }}
          onPress={() => this.props.navigation.openDrawer()}
        >
          <Icon name="md-menu" color={COLORS.light_color} size={p(30)} />
        </TouchableOpacity>

        {
          reduxUser &&
          <FlatList
            style={{ marginTop: p(10) }}
            data={demoCarts}
            keyExtractor={(item, i) => String(i)}
            renderItem={(item) => this._renderItem(item, this.state)}
            extraData={this.state}

          />
        }

        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{ fontSize: p(14), marginVertical: p(12) }}>Check Payment Options</Text>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => this.sendRequest('cancelled')}
          >
            <Text style={styles.btnText}>Place Order</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: p(14), marginVertical: p(12) }} >{'Once you place the order, your photos will be downloaded\n and will be able to check in your orders anytime'}</Text>
        </View>

      </View>
    );
  }
}

export default connect(
  state => ({
    reduxUser: state.auth.reduxUser,
  }),
  dispatch => ({
    authActions: bindActionCreators(authActions, dispatch),
  })
)(ShoppingCart);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontFamily: 'CarinoSans-SemiBold',
    alignSelf: 'center',
    fontSize: p(18),
    marginTop: p(9)
  },
  avatar: {
    width: p(50),
    height: p(50),
    marginRight: p(12),
    borderRadius: 8
  },
  msgView: {
    paddingHorizontal: p(12),
    paddingVertical: p(5),
    backgroundColor: '#f0f0f0',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    marginHorizontal: 12
  },
  name: {
    fontSize: p(14),
    color: '#373737',
    fontFamily: 'CarinoSans'
  },
  content: {
    fontSize: p(12),
    color: '#717171',
    fontFamily: 'CarinoSans',
    maxWidth: p(150)
  },
  contentC: {
    fontSize: p(11),
    color: '#222',
    fontFamily: 'CarinoSans',
    maxWidth: p(60)
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
});
