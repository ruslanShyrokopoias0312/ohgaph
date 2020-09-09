import env from '../env/env'
import DeviceInfo from 'react-native-device-info';
import FCM from 'react-native-fcm'
import AsyncStorage from '@react-native-community/async-storage'

const register = token => {
    return new Promise(async (resolve, reject) => {

        const cardNumber = await AsyncStorage.getItem('card_number')
        const jwtToken = await AsyncStorage.getItem('jwt_token')
        const unique = DeviceInfo.getUniqueId()

        if(!cardNumber) resolve({message: 'not login.'})

        if(!token) reject({message: '通知トークンが存在しません'})

        fetch(`${env.api_domain}/fcm/register`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: jwtToken},
            body: `device_unique_id=${unique}&fcm_token=${token}`
        }).then(resp => {

            // register topic
            FCM.subscribeToTopic(`CardType${cardNumber.slice(5,7)}`)
            FCM.subscribeToTopic(`all`)

            resolve()

        }).catch(err => reject(err))
    })
}

export { register }
