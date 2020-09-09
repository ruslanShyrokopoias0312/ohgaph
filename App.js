import React from 'react';
import { StyleSheet, Text, View, AsyncStorage, Platform } from 'react-native';
import Wrapper from './src/components/Wrapper.js'
import Notification from './src/components/parts/Notification.js'

const oldRender = Text.render
const overwriteFont = Platform.select({
    ios: { fontFamily: 'Arial', },
    android: { fontFamily: 'Roboto' }
})
const overwriteStyles = StyleSheet.create({
    defaultFontFamily: overwriteFont
})

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;
Text.render = function (...args) {
    const origin = oldRender.call(this, ...args)
    return React.cloneElement(origin, {
        style: [overwriteStyles.defaultFontFamily, origin.props.style]
    })
}

export default class App extends React.Component {

  constructor() {
      super()
      this.state = {}
  }

  render() {
    return(
        <View style={styles.container}>
            <Notification style={{display: 'none', opacity: 0}}/>
            <Wrapper />
        </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
});
