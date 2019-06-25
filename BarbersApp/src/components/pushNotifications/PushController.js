import React, { Component } from "react";
import firebase, { Notification, RemoteMessage } from "react-native-firebase";
import PushNotification from "react-native-push-notification";

export default class PushController extends Component {
    async componentDidMount() {
        PushNotification.configure({
            onNotification: function(notification) {
                console.log("NOTIFICATION:", notification);
            }
        });

        try {
            const res = await firebase.messaging().requestPermission();
            const fcmToken = await firebase.messaging().getToken();

            if (fcmToken) {
                console.log("FCM Token: ", fcmToken);

                const enabled = await firebase.messaging().hasPermission();
                if (enabled) {
                    console.log("FCM messaging has permission:" + enabled);
                } else {
                    try {
                        await firebase.messaging().requestPermission();
                        console.log("FCM permission granted");
                    } catch (error) {
                        console.log("FCM Permission Error", error);
                    }
                }
                firebase
                    .notifications()
                    .onNotificationDisplayed(notification => {
                        // Process your notification as required
                        // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
                        console.log("Notification: ", notification);
                    });

                this.notificationListener = firebase
                    .notifications()
                    .onNotification(notification => {
                        console.log("Notification: ", notification);
                    });
            } else {
                console.log("FCM Token not available");
            }
        } catch (e) {
            console.log("Error initializing FCM", e);
        }
    }

    render() {
        return null;
    }
}
