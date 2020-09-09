import React from 'react'
import { StyleSheet, Text, View, TextInput, Image, Dimensions, TouchableHighlight, TouchableOpacity, Alert } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';
import LinearGradient from 'react-native-linear-gradient'
import Modal from 'react-native-modalbox'
import { Actions } from 'react-native-router-flux'
import { signin } from '../../lib/card'
import Loading from '../parts/Loading'
import DeviceInfo from 'react-native-device-info';

const isTablet = DeviceInfo.isTablet()
const {height, width} = Dimensions.get('window')

class HomePage extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            card: this.props.getCardInfo(),
            swipeToClose: false,
            newPinNumber: ""
        }

        this.popup = this.popup.bind(this)
    }

    checkPinNumber() {
        signin(this.state.card.cardNumber, this.state.newPinNumber)
          .then(async resp => {
              await AsyncStorage.setItem('pin_number', this.state.newPinNumber)
              this.setState({card: Object.assign({}, this.state.card, {pinNumber: this.state.newPinNumber}) })
              Alert.alert('再認証成功', 'PINを保存しました')
          }).catch(err => {
              Alert.alert('再認証失敗', err.message)
          })
    }

    render() {
        return (
            <LinearGradient style={{position: 'relative', flex: 1, paddingTop: 30}} colors={['#ef6e87', '#f3a8b4']}>

                {(() => {
                    return !this.state.card.isLoaded ? <Loading/> : null
                })()}

                <Image
                    source={require('../../assets/images/home_logo.png')}
                    style={{width: width, height: (width * 0.403), marginVertical: isTablet ? 15 : 30}}
                    resizeMode={'contain'}
                />
                <View style={{flexDirection: 'row', alignItems: 'center', paddingHorizontal: 30}}>
                    <View style={{flex: 0.6, paddingRight: 25}}>
                        <View style={styles.balloonWrapperDummy}>
                            <View style={styles.balloon}>
                                <Text style={styles.cardInfoTitle}>残高</Text>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Text style={styles.cardInfoNumber}>{typeof this.state.card.money === "number" ? this.state.card.money : "-"}</Text>
                                    <Text style={styles.cardInfoUnit}>円</Text>
                                </View>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Text style={styles.cardInfoNumber}>{typeof this.state.card.point === "number" ? this.state.card.point : "-"}</Text>
                                    <Text style={styles.cardInfoUnit}>pt</Text>
                                </View>
                            </View>
                            <View style={styles.balloonBefore} />
                            <View style={styles.balloonAfter} />
                        </View>
                    </View>
                    <View style={{flex: 0.4, alignItems: 'center'}}>
                        <TouchableHighlight onPress={this.popup} underlayColor={'transparent'}>
                            <Image
                                source={require('../../assets/images/card2.png')}
                                style={{width: isTablet ? 80 : 100, height: isTablet ? 80 :100}}
                                resizeMode={'contain'}
                            />
                        </TouchableHighlight>
                    </View>
                </View>
                <View style={{paddingHorizontal: isTablet ? 20 : 30, paddingVertical: 20 }}>
                    <TouchableHighlight style={styles.btn} onPress={Actions.Card} underlayColor={'rgb(66,171,223)'}>
                        <Text style={{color: '#fff', textAlign: 'center', fontSize: isTablet ? 15 : 17, letterSpacing: 2}}>カード</Text>
                    </TouchableHighlight>
                </View>
                <TouchableHighlight style={styles.profileChangeBtn} underlayColor={'rgb(60,163,217)'} onPress={() => Actions.ChangeProfile()}>
                    <Text style={styles.profileChangeLabel}>登録情報変更</Text>
                </TouchableHighlight>
                <Image
                    source={require('../../assets/images/bg_logo.png')}
                    style={{width: width, height: (width * 0.472), position: 'absolute', bottom: 0, zIndex: -1}}
                    resizeMode={'contain'}
                />
                <Modal
                    style={[styles.modal]}
                    ref={"confirmModal"}
                    position={"center"}
                    swipeToClose={this.state.swipeToClose}
                >
                    <View style={styles.confirmRow}>
                        <Text style={styles.confirmRowLabel}>カード番号:</Text>
                        <Text style={styles.confirmRowValue}>{this.state.card.cardNumber}</Text>
                    </View>
                    <View style={styles.confirmRow}>
                        <Text style={styles.confirmRowLabel}>PIN:</Text>
                        {
                            this.state.card.pinNumber ?
                                ( <Text style={styles.confirmRowValue}>{this.state.card.pinNumber}</Text> ) :
                                ( <TextInput style={styles.pinInput} keyboardType={'numeric'} onChangeText={v => this.setState({newPinNumber: v})} /> )
                        }
                    </View>
                    <View>
                        {
                            this.state.card.pinNumber ?
                                null :
                                ( <TouchableOpacity
                                    onPress={() => this.checkPinNumber()}
                                    style={styles.authBtn}
                                >
                                    <Text style={styles.btnLabel}>PIN再認証</Text>
                                </TouchableOpacity> )
                        }
                        <TouchableOpacity
                            onPress={() => this.refs.confirmModal.close()}
                            style={styles.backBtn}
                        >
                            <Text style={styles.btnLabel}>閉じる</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
            </LinearGradient>
        )
    }

    popup() {
        this.refs.confirmModal.open()
    }

}

export default HomePage

const windowSize = Dimensions.get('window');
const modalWidth = parseInt(windowSize.width * 0.75)
const modalMargin = (windowSize.width - modalWidth) / 2.0

const btnStyleObj = {
    borderRadius: 10,
    borderColor: '#fff',
    borderWidth: 1,
    paddingVertical: isTablet ? 14 : 20,
    backgroundColor: 'rgb(56,161,213)'
}

const styles = StyleSheet.create({
    balloon: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        position: 'relative',
        alignItems: 'center'
    },
    cardInfoTitle: {
        letterSpacing: 1,
        color: '#333',
        fontSize: isTablet ? 15 : 16,
        paddingBottom: 10
    },
    cardInfoNumber: {
        fontSize: isTablet ? 19 : 21,
        color: '#222',
        letterSpacing: 3,
        paddingRight: 3
    },
    cardInfoUnit: {
        fontSize: isTablet ? 13 : 14,
        color: '#333',
        letterSpacing: 1
    },
    cardInfoUpdateAt: {
        textAlign: 'center',
        paddingTop: 10,
        color: 'rgb(237,99,124)',
        lineHeight: 20,
        letterSpacing: 1
    },
    balloonWrapperDummy: {
        position: 'relative',
    },
    balloonBefore: {
        position: 'absolute',
        top: '50%',
        right: -20,
        transform: [{translateY: 5}],
        borderLeftWidth: 20,
        borderLeftColor: '#fff',
        borderTopWidth: 10,
        borderTopColor: 'transparent',
        borderBottomWidth: 10,
        borderBottomColor: 'transparent'
    },
    btn: btnStyleObj,
    profileChangeBtn : Object.assign({}, btnStyleObj, {
        backgroundColor: '#f08095',
        bottom: 20,
        paddingTop: 10,
        paddingBottom: 10,
        paddingRight: 20,
        paddingLeft: 20,
        position: 'absolute',
        right: 30,
        width: 130,
    }),
    profileChangeLabel: {
        color: '#fff',
    },
    modal: {
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        display: 'flex',
        height: height * 0.45,
        paddingRight: 30,
        paddingLeft: 30,
        marginLeft: 1,
        width: modalWidth,
    },
    confirmRow: {
        marginBottom: 15,
        justifyContent: 'flex-start',
        width: '100%',
    },
    confirmRowLabel: {
        fontSize: 14,
    },
    confirmRowValue: {
        fontSize: 20,
        letterSpacing: 1,
    },
    pinInput: {
      borderRadius: 5,
      borderColor: '#aaa',
      borderWidth: 1,
      paddingVertical: 5,
      paddingHorizontal: 7,
      marginVertical: 3,
      fontWeight: '500',
      fontSize: isTablet ? 15 : 18,
    },
    backBtn: {
        backgroundColor: '#a0a0a0',
        borderRadius: 10,
        borderColor: 'transparent',
        marginRight: 'auto',
        marginLeft: 'auto',
        marginTop: 5,
        marginBottom: 5,
        paddingVertical: isTablet ? 1 : 13,
        width: 150,
    },
    authBtn: {
        backgroundColor: 'rgb(56,161,213)',
        borderRadius: 10,
        borderColor: 'transparent',
        marginRight: 'auto',
        marginLeft: 'auto',
        marginTop: 5,
        marginBottom: 5,
        paddingVertical: isTablet ? 11 : 13,
        width: 150,
    },
    btnLabel: {
        color: '#fff',
        textAlign: 'center',
        fontSize: isTablet ? 13 : 16,
        letterSpacing: 2,
    },
})
