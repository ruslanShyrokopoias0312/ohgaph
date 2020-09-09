import React from 'react'
import { StyleSheet, Text, View, TouchableHighlight, Alert } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import { Scene, Router, Actions } from 'react-native-router-flux'
import FCM, {FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType} from 'react-native-fcm'

import FirstPage from './FirstPage.js'
import CreateCardPage from './CreateCardPage.js'
import ChangeProfilePage from './ChangeProfilePage'

import CardPage from './tabs/CardPage.js'
import CouponList from './tabs/CouponList'
import HomePage from './tabs/HomePage.js'
import NewsList from './tabs/NewsList'

import TabIcon from './parts/TabIcon.js'
import Icon from 'react-native-vector-icons/Ionicons'

import { getPoint, getMoney } from '../lib/card'
import { getAll } from '../lib/coupon'
import { errorHandle } from '../lib/api'
import { register } from '../lib/fcm'
import moment from 'moment'
import DeviceBrightness from '@adrianso/react-native-device-brightness'

class App extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            activeTab: 'Home',
            newsActionTime: null,
            isFirst: false,
            isLoadedStorage: false,
            card: { isLoaded: false },
            coupons: null,
            bonusPoint: 0,
            isCardCreated: false
        }
    }

    render() {
        if(!this.state.isLoadedStorage) return <View />

        return (
            <Router key='router'>
                <Scene key="root"
                    panHandlers={null}
                    gestureEnabled={false}
                >
                    <Scene key="firstView"
                        onLogin={this.onLogin.bind(this)}
                        component={FirstPage}
                        initial={this.state.isFirst}
                        renderTitle={<Text style={styles.navText}>大賀薬局Bibica</Text>}
                        navigationBarStyle={{backgroundColor: 'rgb(60,167,217)', textAlign: 'center'}}
                    />
                    <Scene key="createCard"
                        renderRightButton={() => <View/>}
                        onCreate={this.onCreate.bind(this)}
                        navigationBarStyle={{backgroundColor: 'rgb(60,167,217)', textAlign: 'center'}}
                        component={CreateCardPage}
                        renderTitle={<Text style={styles.navText}>カード発行</Text>}
                    />
                    <Scene key="ChangeProfile"
                        renderTitle={<Text style={styles.navText}>登録情報変更</Text>}
                        navigationBarStyle={{backgroundColor: 'rgb(60,167,217)', textAlign: 'center'}}
                        component={ChangeProfilePage}
                        icon={TabIcon}
                        hideNavBar={false}
                        renderRightButton={() => <View/>}
                        renderTitle={<Text style={styles.navText}>登録情報変更</Text>}
                    />
                    <Scene
                        tabBarPosition={'bottom'}
                        key="mainView" tabs
                        tabBarStyle={styles.tabBar}
                        hideNavBar={true}
                        titleStyle={{color: '#fff', alignSelf: 'center'}}
                        navigationBarStyle={{backgroundColor: 'rgb(60,167,217)'}}
                        initial={!this.state.isFirst}
                    >
                        <Scene key="Home"
                            getCardInfo={() => this.state.card}
                            component={HomePage} title="ホーム"
                            icon={TabIcon} hideNavBar={true}
                            renderTitle={<Text style={styles.navText}>ホーム</Text>}
                            tabBarOnPress={() => this.setState({activeTab: 'Home'})}
                            initial={this.state.activeTab === 'Home' && !this.state.isFirst}
                        />

                        <Scene key="Card"
                            getCardInfo={() => this.state.card}
                            component={CardPage}
                            renderLeftButton={() => <View style={{paddingLeft: 40}}/>}
                            renderRightButton={() =>
                                <TouchableHighlight underlayColor={'transparent'} style={{paddingRight: 15}} onPress={this.getCardInfo.bind(this)}>
                                    <Icon style={styles.reloadIcons} name="md-refresh" />
                                </TouchableHighlight>
                            }
                            title="カード" icon={TabIcon}
                            onEnter={() => {
                              DeviceBrightness.setBrightnessLevel(1)
                            }}
                            onExit={() => {
                                DeviceBrightness.setBrightnessLevel(0.5)
                            }}
                            renderTitle={<Text style={styles.navText}>Bibicaカード</Text>}
                            tabBarOnPress={() => this.setState({activeTab: 'Card'})}
                            initial={this.state.activeTab === 'Card' && !this.state.isFirst}
                        />

                        <Scene key="Coupon"
                            getCoupons={() => this.state.coupons}
                            icon={TabIcon}
                            isCouponExists={this.state.isCouponExists}
                            renderLeftButton={() => <View style={{paddingLeft: 40}}/>}
                            renderRightButton={() =>
                                <TouchableHighlight underlayColor={'transparent'} style={{paddingRight: 15}} onPress={this.getCoupons.bind(this)}>
                                    <Icon style={styles.reloadIcons} name="md-refresh" />
                                </TouchableHighlight>
                            }
                            renderTitle={<Text style={styles.navText}>Bibicaクーポン</Text>}
                            title="クーポン" component={CouponList}
                            tabBarOnPress={() => this.setState({activeTab: 'Coupon'})}
                            initial={this.state.activeTab === 'Coupon' && !this.state.isFirst}
                        />

                        <Scene key="News"
                            actionTime={() => this.state.newsActionTime}
                            title="ニュース"
                            renderTitle={<Text style={styles.navText}>Bibicaニュース</Text>}
                            icon={TabIcon} component={NewsList}
                            tabBarOnPress={() => this.setState({activeTab: 'News'})}
                            initial={this.state.activeTab === 'News' && !this.state.isFirst}
                        />

                    </Scene>
                </Scene>
            </Router>
        )
    }

    UNSAFE_componentWillMount(){
        AsyncStorage.getItem('card_number').then(value => {
            this.setState({
                ...this.state,
                isLoadedStorage: true,
                isFirst: !value,
                isLoaded: true
            })

            if(value) {
                this.getCardInfo()
                this.getCoupons()
            }
        })
    }

    async componentDidMount() {
        // 通知を受け取った時の処理
        FCM.on(FCMEvent.Notification, async (notif) => {
            const card_number = await AsyncStorage.getItem('card_number')
            if(!card_number) {
                return false
            }

            if(notif.type === 'coupon') {
                this.getCoupons()
                Actions.Coupon()
            }
            if(notif.type === 'news') {
                this.setState({...this.state, newsActionTime: new Date()})
                Actions.News()
            }
        })

        FCM.on(FCMEvent.RefreshToken, async (token) => {
            const resp = await register(token).catch(() => {})
        })
    }


    async getCardInfo(){
        this.setState({card: {...this.state, isLoaded: false}})

        const cardNumber = await AsyncStorage.getItem('card_number')
        const pinNumber = await AsyncStorage.getItem('pin_number')


        Promise.all([ getPoint(), getMoney()])
          .then(responses => {

            this.setState({ ...this.state, card: {
                point: responses[1].point,
                money: responses[0].point,
                updateAt: moment().format('YYYY/MM/DD kk:mm'),
                isLoaded: true,
                cardNumber: cardNumber,
                pinNumber: pinNumber,
                bonusPoint: null
            }})

          }).catch(err => { errorHandle(err) })
    }

    async getCoupons() {
        this.setState({...this.state, coupons: null})
        const coupons = await getAll()
        this.setState({...this.state, coupons: coupons })
    }

    onLogin(e) {
        this.setState({...this.state, bonusPoint: e.bonusPoint})
        this.setState({...this.state, isFirst: false})
        Actions.reset('mainView', {})
        this.getCardInfo()
        this.getCoupons()


        if(e.bonusPoint) alert(`${e.bonusPoint}円分の残高をプレゼントしました`)
    }

    onCreate(card_number, pin_number) {
        this.setState({...this.state, bonusPoint: 0})
        this.setState({...this.state, isCardCreated: true})
        this.setState({...this.state, card: {
            point: 0,
            money: 0,
            updateAt: moment().format('YYYY/MM/DD kk:mm'),
            isLoaded: true,
            cardNumber: card_number,
            pinNumber: pin_number,
            bonusPoint: null
        }})
        this.setState({...this.state, isFirst: false})
        Actions.reset('mainView', {})
        this.getCardInfo()
        this.getCoupons()
    }

}

export default App

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabBar: {
        paddingVertical: 5,
        height: 60
    },
    reloadIcons: {
        color: '#fff',
        fontSize: 25,
    },
    navText: {
        flex: 1,
        fontSize: 17,
        fontWeight: "600",
        color: "#fff",
        textAlign: "center",
        alignSelf: "center",
        marginHorizontal: 16
    }
})
