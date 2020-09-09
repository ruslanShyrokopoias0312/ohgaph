import React from 'react'
import { View, StyleSheet, ActivityIndicator } from 'react-native'

export default class Loading extends React.Component {
    render() {
        return <View style={styles.overlay}>
            <ActivityIndicator size="large" color="rgb(60,167,217)"/>
        </View>
    }
}
const styles = StyleSheet.create({
    overlay: {
        backgroundColor: 'rgba(30, 30, 30, 0.8)',
        zIndex: 1000,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center'
    }
})
