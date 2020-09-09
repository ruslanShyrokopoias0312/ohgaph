import React from 'react'
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Dimensions, Image } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import FCM, {FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType} from 'react-native-fcm';
import { Actions } from 'react-native-router-flux'
import { signin } from '../lib/card'
import { register } from '../lib/fcm'
import LinearGradient from 'react-native-linear-gradient'
import { errorHandle } from '../lib/api'
import { getPoint, getMoney } from '../lib/card'
import moment from 'moment'
import Loading from './parts/Loading'

import DeviceInfo from 'react-native-device-info';

const isTablet = DeviceInfo.isTablet()
const {height, width} = Dimensions.get('window')

class FirstPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = { loading: false, card_number: '', pin_number: '', fix_number: '88002' }
    }

    render() {
        return (
            <LinearGradient style={{position: 'relative', flex: 1, paddingTop: 30, paddingHorizontal: 30}} colors={['#ef6e87', '#f3a8b4']}>
                {(() => {
                    return this.state.loading ? <Loading/> : null
                })()}
                <View style={{flexDirection: 'row', alignItems: 'center', paddingVertical: isTablet ? 10 : 20}}>
                    <Text style={styles.key}>カード番号: </Text>
                    <Text style={styles.fix}>{this.state.fix_number + " "}</Text>
                    <TextInput
                        style={styles.input}
                        underlineColorAndroid={"transparent"}
                        keyboardType={'default'}
                        onChangeText={(text) => this.setState({ card_number: text })}
                        value={this.state.card_number}
                    />
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center', paddingVertical: isTablet ? 10 : 20}}>
                    <Text style={styles.key}>PIN(カード裏面に記載): </Text>
                    <TextInput
                        style={styles.input}
                        underlineColorAndroid={"transparent"}
                        keyboardType={'default'}
                        onChangeText={(text) => this.setState({ pin_number: text })}
                        value={this.state.pin_number}
                    />
                </View>
                <TouchableOpacity style={styles.btn} onPress={ () => { this.registrationCard()  }}>
                    <Text style={styles.btnText}>登録する</Text>
                </TouchableOpacity>
                <Text style={styles.newLabel}>カードをお持ちでない方はこちら</Text>
                <TouchableOpacity style={styles.btnNew} onPress={Actions.createCard}>
                    <Text style={styles.btnText}>新規カード発行</Text>
                </TouchableOpacity>
                <Image
                    source={require('../assets/images/top_bg_logo.png')}
                    resizeMode={'contain'}
                    style={{position: 'absolute', bottom: 0, left: 0, width: width, height: (width * 0.773), zIndex: -1}}
                />
            </LinearGradient>
        )
    }

    componentDidMount() {
    }

    registrationCard(){
        this.setState({loading: true})

        let bonusPoint = 0

        let card_number = `${this.state.fix_number}${this.state.card_number}`

        signin(card_number, this.state.pin_number).then(async (resp) => {
            bonusPoint = resp.bonusPoint
            await AsyncStorage.multiSet([
                ['card_number', card_number],
                ['pin_number', this.state.pin_number],
                ['jwt_token', resp.token]
            ])
            return FCM.getFCMToken()
        }).then(token => {
            return register(token)
        }).then(resp => {
            this.setState({loading: false})
            this.props.onLogin && this.props.onLogin({bonusPoint: bonusPoint})
        }).catch(err => {
            this.setState({loading: false})
            errorHandle(err)
        })

    }
}

export default FirstPage

const styles = StyleSheet.create({
    key: {
        backgroundColor: 'transparent',
        color: '#fff',
        fontSize: isTablet ? 13 : 15,
        fontWeight: '500',
        paddingRight: 10
    },
    fix: {
        color: '#333',
        fontSize: isTablet ? 15 : 18,
        letterSpacing: 1,
        marginRight: 5,
        fontWeight: '500',
        backgroundColor: 'transparent',
    },
    input: {
        flex: 1,
        backgroundColor: '#fff',
        fontWeight: '500',
        borderRadius: 4,
        paddingVertical: 6,
        paddingHorizontal: 4,
        color: '#333',
        fontSize: isTablet ? 15 : 18
    },
    btn: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 1,
        marginTop: 20,
        marginBottom: 12,
        paddingVertical: isTablet ? 13 : 15,
        backgroundColor: 'rgb(56,161,213)'
    },
    btnNew: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 1,
        marginBottom: 12,
        paddingVertical: isTablet ? 13 : 15,
        backgroundColor: '#59b480'
    },
    btnText: {
        textAlign: 'center',
        color: '#fff',
        fontSize: isTablet ? 15 : 17,
        letterSpacing: 2
    },
    newLabel: {
        color: '#fff',
        fontSize: 15,
        marginTop: 30,
        marginBottom: 8,
    },
})
