import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList } from 'react-native';
import { p } from '../../common/normalize';
import { COLORS } from '../../common/colors';
import { Actions } from 'react-native-router-flux';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { images } from '../../common/images';
import * as authActions from "../../store/auth/actions";
import * as msgActions from "../../store/messages/actions";
import _ from 'underscore'
import UtilService from '../../common/utils';
import Icon from 'react-native-vector-icons/Ionicons';

class Messages extends Component {

  constructor(props) {
    super(props);
    this.state = {
      chats: null,
      chatdata: [],
      isLoading: false
    };
  }

  componentDidMount() {
    this.setState({ messages: this.props.messages })
  }

  componentDidUpdate(prevProps, state) {
    if (prevProps.messages !== this.props.messages) {
      this.setState({ messages: this.props.messages })
    }
  }

  _renderItem = ({ item, index }) => {

    return (
      <View style={styles.msgView} key={index}>

        <View style={{ elevation: 3, }}>
          <Image source={item.avatar ? { uri: item.avatar } : images.img_photographer1} style={styles.avatar} />
        </View>

        <TouchableOpacity
          onPress={() => {
            Actions.chat({ oppositeIndex: index, avatar: item.avatar, fullName: item.fullName, qumraId: item.qumraId, chatId: index })
          }
          }
          style={{ flex: 1 }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: p(230), }}>
            <Text style={[styles.name, { color: 'green' }]}>{item.fullName}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text ellipsizeMode='tail' numberOfLines={1} style={styles.content}>{item[item.length - 1].text}</Text>
            <Text style={styles.contentC}>
              {UtilService.getHourMinutes(item[item.length - 1].createdAt)}
            </Text>
          </View>

        </TouchableOpacity>
      </View>
    )
  }

  render() {

    let { reduxUser } = this.props
    let { messages } = this.state

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Messages</Text>
        <TouchableOpacity
          style={{ position: 'absolute', top: p(8), left: p(12) }}
          onPress={() => this.props.navigation.openDrawer()}
        >
          <Icon name="md-menu" color={COLORS.light_color} size={p(30)} />
        </TouchableOpacity>

        {
          reduxUser && messages &&
          <FlatList
            style={{ marginTop: p(10) }}
            data={messages}
            keyExtractor={(item, i) => String(i)}
            renderItem={(item) => this._renderItem(item, this.state)}
            extraData={this.state}

          />
        }
      </View>
    );
  }
}

export default connect(
  state => ({
    messages: state.messages.messages,
    reduxUser: state.auth.reduxUser,
  }),
  dispatch => ({
    authActions: bindActionCreators(authActions, dispatch),
    msgActions: bindActionCreators(msgActions, dispatch)
  })
)(Messages);

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
    maxWidth: p(150)
  },
  contentC: {
    fontSize: p(11),
    color: '#717171',
    fontFamily: 'CarinoSans',
    maxWidth: p(60)
  }
});
