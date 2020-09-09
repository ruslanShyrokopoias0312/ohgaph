import React from 'react'
import { StyleSheet, Text, View, Image, TouchableHighlight, Linking } from 'react-native'
import { Actions } from 'react-native-router-flux'
import moment from 'moment-timezone'
import Loading from '../parts/Loading'
import DeviceInfo from 'react-native-device-info'
import Barcode from '../parts/Barcode'

import env from '../../env/env'

const isTablet = DeviceInfo.isTablet()

class CardPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            card: this.props.getCardInfo()
        }
        this.onPressChargeLink = this.onPressChargeLink.bind(this)
    }

    render() {
        return (
            <View style={{backgroundColor: '#fff', flexDirection: 'row', flex: 1}}>

                {(() => {
                    return !this.state.card.isLoaded ? <Loading/> : null
                })()}

                <View style={styles.left}>
                    <View style={styles.cardInfo}>
                        <View style={styles.balloonWrapperDummy}>
                            <View style={styles.balloonWrapper}>
                                <Text style={styles.cardInfoTitle}>残高</Text>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Text style={styles.cardInfoNumber}>{typeof this.state.card.money === "number" ? this.state.card.money : "-"}</Text>
                                    <Text style={styles.cardInfoUnit}>円</Text>
                                </View>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Text style={styles.cardInfoNumber}>{typeof this.state.card.point === "number" ? this.state.card.point : "-"}</Text>
                                    <Text style={styles.cardInfoUnit}>pt</Text>
                                </View>
                                <Text style={styles.cardInfoUpdateAt}>最終更新{"\n"}{this.state.card.updateAt}</Text>
                            </View>
                            <View style={styles.balloonBefore}/>
                            <View style={styles.balloonAfter}/>
                        </View>
                    </View>
                    <Image
                        resizeMode={"contain"}
                        source={require('../../assets/images/card.png')}
                        style={{width: isTablet ? 65 : 90, height: isTablet ? 65 : 90, marginVertical: 15}}
                    />
                    <TouchableHighlight style={styles.btn1} underlayColor={'rgb(60,163,217)'} onPress={this.onPressChargeLink}>
                        <Text style={styles.btnText}>チャージ</Text>
                    </TouchableHighlight>
                    {/*
                    <TouchableHighlight style={styles.btn2} underlayColor={'rgb(89,181,127)'} onPress={() => {}}>
                        <Text style={styles.btnText}>スタンプカード</Text>
                    </TouchableHighlight>
                    */}
                </View>
                <View style={styles.right}>
                    <View style={styles.barcode}>
                      <Barcode getValue={() => this.state.card.cardNumber}/>
                    </View>
                </View>
            </View>
        )
    }

    onPressChargeLink() {

        const chargeHost = env.env === 'production' ? 'https://www.giftcard.ne.jp' : 'https://demo.giftcard.ne.jp'
        const chargeLink = `${chargeHost}/gift/carduser/CardUserLoginPage/open.do?key=d505b85e7e5c5e0f&cn=${this.state.card.cardNumber}`
        Linking.openURL(chargeLink).catch(err => {
            Alert.alert('URLを開けませんでした。')
            console.log(err)
        })
    }

}

export default CardPage

const styles = StyleSheet.create({
    left: {
        flex: 1,
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    right: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    cardInfo: {
        paddingVertical: 10,
        width: '100%'
    },
    balloonWrapperDummy: {
        position: 'relative'
    },
    balloonWrapper: {
        overflow: 'visible',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingVertical: 15,
        paddingHorizontal: 5,
        borderWidth: 3,
        borderColor: 'rgb(237,99,124)',
    },
    balloonBefore: {
        zIndex: 2,
        position: 'absolute',
        bottom: -27,
        left: 25,
        borderTopWidth: 30,
        borderTopColor: 'rgb(237,99,124)',
        borderLeftWidth: 20,
        borderLeftColor: 'transparent',
        borderRightWidth: 20,
        borderRightColor: 'transparent'
    },
    balloonAfter: {
        zIndex: 2,
        position: 'absolute',
        bottom: -21,
        left: 28,
        borderTopWidth: 24,
        borderTopColor: '#fff',
        borderLeftWidth: 17,
        borderLeftColor: 'transparent',
        borderRightWidth: 17,
        borderRightColor: 'transparent'
    },
    cardInfoTitle: {
        letterSpacing: 1,
        color: '#000',
        fontSize: isTablet ? 17 : 19,
        fontWeight: "bold",
        paddingBottom: 10
    },
    cardInfoNumber: {
        fontSize: isTablet ? 21 : 26,
        color: '#111',
        letterSpacing: 3,
        paddingRight: 3
    },
    cardInfoUnit: {
        fontSize: isTablet ? 15 : 17,
        color: '#111',
        letterSpacing: 1
    },
    cardInfoUpdateAt: {
        textAlign: 'center',
        paddingTop: 10,
        color: 'rgb(237,99,124)',
        lineHeight: 20,
        letterSpacing: 1,
        fontSize: isTablet ? 12 : 15
    },
    btn1: {
        backgroundColor: 'rgb(50,153,207)',
        borderRadius: 10,
        width: '100%',
        paddingVertical: isTablet ? 10 : 15,
        paddingHorizontal: 10,
        marginVertical: 5,
    },
    btn2: {
        backgroundColor: 'rgb(79,171,117)',
        borderRadius: 10,
        width: '100%',
        paddingVertical: isTablet ? 10 : 15,
        paddingHorizontal: 10,
        marginVertical: 5
    },
    btnText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: isTablet ? 15 : 17,
        letterSpacing: 1
    },
    barcode: {
        transform: [{ rotate: '90deg' }]
    },
})
