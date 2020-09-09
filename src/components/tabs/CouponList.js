import React from 'react'
import { StyleSheet, Text, TouchableHighlight, View, Dimensions, Image, ScrollView, Alert } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { getAll, use } from '../../lib/coupon'
import Swiper from 'react-native-swiper'
import moment from 'moment-timezone'
import Loading from '../parts/Loading'
import DeviceInfo from 'react-native-device-info';
import Hyperlink from 'react-native-hyperlink'

const isTablet = DeviceInfo.isTablet()
const {height, width} = Dimensions.get('window')

class CouponList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            coupons: this.props.getCoupons(),
            wait: true
        }
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: '#fff'}}>
                {(() => {
                    return this.state.wait ? <Loading/> : null
                })()}

                {(() => {
                    return this.state.coupons && this.state.coupons.length === 0 ?
                        <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
                          <Text style={{color: '#333', letterSpacing: 1}}>クーポンはありません</Text>
                        </View> : null
                })()}

                {(() => {
                    return this.state.coupons && this.state.coupons.length > 0 && !this.state.wait ?
                        <Swiper removeClippedSubviews={false}
                            showsButtons={true}
                            scrollEnabled={true}
                            showsButtons={!this.state.wait}
                            style={{opacity: this.state.wait ? 0 : 1}}
                            paginationStyle={{position:'absolute', top: 0, left:0, right:0, height: 50}}
                        >
                            {this.state.coupons.map((coupon,i) => {
                                return <Coupon coupon={coupon} key={i} />
                            })}
                        </Swiper> : null
                })()}
            </View>
        )
    }

    componentDidMount(){
        if(this.state.coupons !== null) {
            setTimeout(() => {
                this.setState({wait: false})
            },  500)
        }
    }
}

class Coupon extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            coupon: this.props.coupon,
            countDown: -600
        }
    }

    render() {
        return (
            <View style={{flex: 1, alignItems: 'center', paddingTop: 30}} >
                <View style={{height: 50}} />
                <View style={styles.imageWrapper}>
                    <Image source={{uri: this.state.coupon.image}} style={styles.image} />

                    {(() => {
                        if(this.state.coupon.is_expiration) {

                            return <View style={styles.absoluteCover}>
                                <Image source={require('../../assets/images/i_coupon_on.png')} style={styles.coverIcon} />
                                <Text style={styles.isExpiration}>このクーポンは{"\n"}一度しか使えません{"\n"}既に使用済みです</Text>
                            </View>

                        } else if(this.state.coupon.is_once && !this.state.coupon.user_expiration) {

                            return <View style={[styles.absoluteCover, {backgroundColor: 'rgba(0,0,0,0)'}]}>
                                <TouchableHighlight style={styles.useBtn} onPress={this.useCouponAlert.bind(this)} underlayColor='rgb(80,187,237)'>
                                    <View>
                                        <Text style={styles.useBtnSpan}>一度きりのクーポンです</Text>
                                        <Text style={styles.useBtnText}>使用する</Text>
                                    </View>
                                </TouchableHighlight>
                            </View>

                        } else if(this.state.coupon.user_expiration) {
                            return <View style={{backgroundColor: 'rgb(60,167,217)', padding: isTablet ? 8: 10}}>
                                <Text style={{color: '#fff', letterSpacing: 2, fontSize: isTablet ? 12: 14, fontWeight: '900', textAlign: 'center'}}>あと{this.state.countDown * -1}秒有効です</Text>
                            </View>
                        }
                    })()}

                </View>
                <View style={{flex:1}}>
                    <View style={styles.textWrapper}>
                        <Text style={styles.exp}>{moment(this.state.coupon.expiration).format('YYYY/MM/DD HH:mm')}まで</Text>
                        <ScrollView style={{flex: 1}}>
                            <Hyperlink linkStyle={{color: "#3078ca"}} linkDefault={true} >
                                <Text style={styles.detail}>{this.state.coupon.detail}</Text>
                            </Hyperlink>
                        </ScrollView>
                    </View>
                </View>
            </View>
        )
    }

    componentDidMount(){
        if(this.state.coupon.user_expiration && !this.state.coupon.is_expiration) {
            this.startCountDown()
        }
    }

    startCountDown() {
        const exp = moment(this.state.coupon.user_expiration).tz('Asia/Tokyo')

        let timer = setInterval(() => {
            const diff = moment().tz('Asia/Tokyo').diff(exp, 's')
            this.setState({countDown: diff})

            if(diff > 0) {
                let currentCoupon = this.state.coupon
                currentCoupon.is_expiration = true
                this.setState({coupon: currentCoupon})

                clearInterval(timer)
            }
        }, 1000)
    }

    // 関数名変えたい
    useCouponAlert() {
        Alert.alert(
            '確認',
            '本当に使用しますか？',
            [
                {
                    text: 'キャンセル',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel'
                },
                {
                    text: 'はい',
                    onPress: () => this.useCoupon(),
                },
            ],
            { cancelable: false }
        )
    }

    useCoupon() {
        use(this.state.coupon.id).then(resp => {
            let currentCoupon = this.state.coupon
            currentCoupon.user_expiration = resp.expiration
            this.setState({coupon: currentCoupon}, this.startCountDown)
        }).catch(err => {
            alert('クーポンの使用に失敗しました')
        })
    }

    // isWithCountdown() {
    //     return (this.state.coupon.is_expiration && !this.state.coupon.is_expiration)
    // }
}

export default CouponList

const styles = StyleSheet.create({
    imageWrapper: {
        width: isTablet ? (width * .55) : (width * .7),
        height: isTablet ? (width * .55) : (width * .7),
        backgroundColor: '#333',
        marginHorizontal: isTablet ? (width * .225) : (width * .15),
        position: 'relative'
    },
    image: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom:0
    },
    textWrapper: {
        width: (width * .7),
        flex: 1,
        marginHorizontal: width * .15
    },
    exp: {
        textAlign: 'right',
        color: 'rgb(60,167,217)',
        fontSize: isTablet ? 11 : 14,
        letterSpacing: 1,
        paddingVertical: 10,
        fontWeight: '500'
    },
    detail: {
        color: '#444',
        fontSize: isTablet ? 12 : 15
    },
    absoluteCover: {
        backgroundColor: 'rgba(10,10,10,.7)',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    },
    coverIcon: {
        width: isTablet ? 30 : 35,
        height: isTablet ? 30 : 35,
        opacity: .8,
        marginVertical: 8,
    },
    isExpiration:  {
        textAlign: 'center',
        color: '#cdcdcd',
        fontWeight: '600',
        letterSpacing: 1,
        lineHeight: isTablet ? 20 : 24,
        fontSize: isTablet ? 12 : 14
    },
    useBtn: {
        backgroundColor: 'rgb(60,167,217)',
        borderRadius: 40,
        width: isTablet ? (width * .45) : (width * .6),
        paddingVertical: 10
    },
    useBtnText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: isTablet ? 13 : 16,
        letterSpacing: 1,
        backgroundColor: 'transparent'
    },
    useBtnSpan: {
        color: '#fff',
        textAlign: 'center',
        fontSize: isTablet ? 10 : 12,
        paddingBottom: 5,
        letterSpacing: 1,
        backgroundColor: 'transparent'
    }

})
