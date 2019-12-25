import React from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import { Notifications } from "expo";
import * as Permissions from 'expo-permissions';

export default class Notify extends React.Component {
  askPermissions = async () => {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      return false;
    }
    return true;
  };

  sendNotificationImmediately = async () => {
    let notificationId = await Notifications.presentLocalNotificationAsync({
      title: "This is crazy",
      body: "Your mind will blow after reading this"
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <Button
          title="Please accept Notifications Permissions"
          onPress={() => this.askPermissions()}
        />
        <Button
          title="Send Notification immediately"
          onPress={() => this.sendNotificationImmediately()}
        />
        <Button
          title="Dismiss All Notifications"
          onPress={() => Notifications.dismissAllNotificationsAsync()}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});