import React, { Component } from 'react';
import { ActivityIndicator, View, Dimensions } from 'react-native';
import { p } from '../common/normalize';
import { COLORS } from '../common/colors';

var { width, height } = Dimensions.get('window')

export const Loading = () => (
    <View style={{ 
        backgroundColor: '#555', 
        opacity: 0.9, 
        position: 'absolute', 
        height, 
        width, 
        zIndex: 2, 
        justifyContent: 'center', 
        alignItems: 'center' 
    }}>
        <ActivityIndicator size='large' color={COLORS.red_color} />
    </View>
  )
