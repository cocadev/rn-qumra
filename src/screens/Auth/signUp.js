import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default class SignUp extends React.Component {
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: 'yellow', alignItems: 'center' }}>
                <TouchableOpacity onClick={() => Actions.drawerMenu()}>
                    <Text>Hello</Text>
                </TouchableOpacity>
            </View>
        );
    }
}