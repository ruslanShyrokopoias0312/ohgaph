import React from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

export default TabIcon = props => {
    switch(props.title){
        case 'ホーム':
            return props.focused ?
                <Image style={styles.icon} source={require('../../assets/images/i_home_on.png')} /> :
                <Image style={styles.icon} source={require('../../assets/images/i_home.png')} />
        case 'カード':
            return props.focused ?
                <Image style={styles.icon} source={require('../../assets/images/i_card_on.png')} /> :
                <Image style={styles.icon} source={require('../../assets/images/i_card.png')} />
        case 'クーポン':
            return props.focused ?
                <Image style={styles.icon} source={require('../../assets/images/i_coupon_on.png')} /> :
                <Image style={styles.icon} source={require('../../assets/images/i_coupon.png')} />
        case 'ニュース':
            return props.focused ?
                <Image style={styles.icon} source={require('../../assets/images/i_news_on.png')} /> :
                <Image style={styles.icon} source={require('../../assets/images/i_news.png')} />
        default:
            return null
    }
}

const styles = StyleSheet.create({
    icon: {
        width: 28,
        height: 25,
        marginTop: 20,
        marginBottom: 20
    }
})
