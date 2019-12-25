
import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { p } from '../common/normalize';

export default class Label extends Component {

  render() {

    const color = this.props.color
    const text = this.props.text

    return (
      <View style={{ position: 'absolute', right: p(89), bottom: p(20) }}>
        <View style={styles.talkBubble}>
          <View style={[styles.talkBubbleSquare, { backgroundColor: color,}]}>
              <Text style={styles.text}>{text}</Text>
          </View>
          <View style={styles.talkBubbleTriangle} />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  talkBubble: {
    marginTop: p(-2),
    position: 'absolute'
  },
  talkBubbleSquare: {
    width: p(100),
    height: p(22),
    justifyContent: 'center',
    alignItems: 'center',
    
    borderTopRightRadius: 5
  },
  talkBubbleTriangle: {
    position: 'absolute',
    borderTopColor: 'transparent',
    borderTopWidth: p(12),
    borderLeftWidth: p(12),
    borderLeftColor: '#A7CE38',
    borderBottomWidth: p(12),
    borderBottomColor: 'transparent',
    borderColor: '#f0f0f0'
  },
  text: {
      fontSize: p(14),
      color: '#fff',
      fontFamily: 'CarinoSans-SemiBold'
  }

})
