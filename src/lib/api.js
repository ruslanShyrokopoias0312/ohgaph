import { Linking, Alert } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import { Actions } from 'react-native-router-flux'
import env from '../env/env'

const call = async (method, url, body = '') => {

    let token = await AsyncStorage.getItem('jwt_token')
    let opts = {
        method: method,
        headers: {
            Authorization: token,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }

    if(method == 'POST' || method == 'PUT') opts.body = body

    return fetch(url, opts)
    .then(fetchCheckError)
    .then(resp => { return resp ? resp.json() : resp })
    .catch(err => { throw err })
}

const fetchCheckError = res => {

    if(!res.ok) {
        return res.json().then(err => {
            throw Object.assign(err, {status: res.status})
        })
    }
    else return res
}

const fetchAddressByPostal = (postalCode) => {
    return call('GET', `${env.api_domain}/address?postalCode=${postalCode}`)
}

const errorHandle = (err, afterAction) => {

    if(err.status === 403){
        Alert.alert('エラー', '無効なユーザー情報です')
        AsyncStorage.clear()
        Actions.firstView()
    } else if(err.status === 500) {
        Alert.alert('エラー', 'サーバーエラーです')
    } else {
        if(~err.message.indexOf('Network request failed')) {
            Alert.alert('エラー', 'ネットワークに接続できませんでした。電波がつながる環境でアプリを再起動してお試しください。')
        } else if(err.code === 'G61') {
            Alert.alert('エラー', err.message, [
                {text: '閉じる', onPress: () => {}},
                {text: 'メールを送信する',
                    onPress: () => Linking.openURL('mailto:bibica-app@ohga-ph.com')
                      .then().catch(Alert.alert('エラー', 'メールアプリを開けませんでした'))
                }
            ])
        } else {
            Alert.alert('エラー', err.message,[
                { text: "OK", onPress: () => afterAction && afterAction() },
            ])
        }
    }
}

export { call, errorHandle, fetchAddressByPostal }
