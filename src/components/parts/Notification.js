import React, { Component } from 'react';
import { View } from 'react-native';
import FCM, {FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType} from 'react-native-fcm';
import DeviceInfo from 'react-native-device-info';
import { Actions } from 'react-native-router-flux'
import { register } from '../../lib/fcm'
import { errorHandle } from '../../lib/api'

FCM.on(FCMEvent.RefreshToken, (token) => {
    register(token).then().catch(errorHandle)
})

export default class Notification extends Component {
    componentDidMount() {
        FCM.getFCMToken().then(token => { register(token).then().catch(errorHandle) })
        FCM.requestPermissions().then(token => {
            FCM.getFCMToken().then(token => register(token).then().catch(errorHandle))
        })

        setTimeout(() => {}, 5000)
    }

    render() {
        return (<View />);
    }

}
