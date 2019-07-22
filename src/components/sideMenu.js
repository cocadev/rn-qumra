import React from 'react';
import { View, Text } from 'react-native';

export default class SideMenu extends React.Component {
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: 'grey', alignItems: 'center' }}>
                <Text>Grey</Text>
            </View>
        );
    }
}