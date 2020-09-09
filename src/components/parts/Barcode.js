import React from 'react'
import { View, StyleSheet, ActivityIndicator } from 'react-native'
import DeviceInfo from 'react-native-device-info'
import Barcode from 'react-native-barcode-builder'

const isTablet = DeviceInfo.isTablet()

export default class BarcodeWrapper extends React.Component {
    constructor(props){
        super(props)
        this.state = {
          value: this.props.getValue(),
          rand: Math.random()
        }
    }
    render() {
        return this.state.value ?
          (
            <View style={{backgroundColor: "#fff"}}>
              <Barcode width={isTablet ? 2 : 2.25} value={this.state.value}/>
            </View>
          ) : <View />
    }

    componentDidMount(){
        // バーコードが消滅するため
        // 強制的にバーコードの再レンダリングを行う
        setInterval(() => {
            this.setState({rand: Math.random()})
        }, 2000)
    }
}
const styles = StyleSheet.create({
})
