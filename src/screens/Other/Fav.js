import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList } from 'react-native';
import { p } from '../../common/normalize';
import { COLORS } from '../../common/colors';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as authActions from "../../store/auth/actions";
import _ from 'underscore'
import Icon from 'react-native-vector-icons/Ionicons';

class Fav extends Component {

  constructor(props) {
    super(props);
    this.state = {
      chats: null,
      chatdata: [],
      isLoading: false
    };
  }

  componentDidMount() {
    var that = this;
    let items = Array.apply(null, Array(60)).map((v, i) => {
      return { id: i, src: 'https://unsplash.it/400/400?image=' + (i + 1) };
    });
    that.setState({
      dataSource: items,
    });
  }

  render() {

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Favourite Photos</Text>
        <TouchableOpacity
          style={{ position: 'absolute', top: p(8), left: p(12) }}
          onPress={() => this.props.navigation.openDrawer()}
        >
          <Icon name="md-menu" color={COLORS.light_color} size={p(30)} />
        </TouchableOpacity>

        <FlatList
          data={this.state.dataSource}
          renderItem={({ item }) => (
            <View style={{ flex: 1, flexDirection: 'column', margin: 12 }}>
              <Image style={styles.imageThumbnail} source={{ uri: item.src }} />
              <View style={styles.border}>
                <Text style={{ fontSize: p(10), color: '#8593a8' }}>Product Name</Text>
                <Text style={{ fontSize: p(10), color: '#8593a8' }}>200 $</Text>

              </View>
            </View>
          )}
          numColumns={2}
          keyExtractor={(item, index) => index.toString()}
        />

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
)(Fav);

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
    width: p(120),
    height: p(120),
    marginRight: p(12),
    borderRadius: 8
  },
  msgView: {
    paddingHorizontal: p(12),
    paddingVertical: p(5),
    backgroundColor: '#f0f0f0',
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
  imageThumbnail: {
		justifyContent: 'center',
		alignItems: 'center',
		height: p(100),
	},
	border: {
		backgroundColor: '#fff',
		borderWidth:1,
		borderColor: '#eaedf4',
		padding: 8
	}
});
