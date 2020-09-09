import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Hyperlink from 'react-native-hyperlink'

export default class ReadMore extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      measured: false,
      shouldShowReadMore: false,
      showAllText: false,
    };
  }

  async componentDidMount() {
    await nextFrameAsync();

    // Get the height of the text with no restriction on number of lines
    const fullHeight = await measureHeightAsync(this._text).catch(() => {})
    this.setState({measured: true});
    await nextFrameAsync();

    // Get the height of the text now that number of lines has been set
    const limitedHeight = await measureHeightAsync(this._text).catch(() => {})

    if (fullHeight > limitedHeight) {
      this.setState({shouldShowReadMore: true}, () => {
        this.props.onReady && this.props.onReady();
      });
    } else {
      this.props.onReady && this.props.onReady();
    }
  }

  render() {
    let {
      measured,
      showAllText,
    } = this.state;

    let {
      numberOfLines,
      style
    } = this.props;

    return (
      <View>
        <Hyperlink linkDefault={ true } linkStyle={{color: "#3078ca"}}>
          <Text
            numberOfLines={measured && !showAllText ? numberOfLines : 0}
            style={style}
            ref={text => { this._text = text; }}>
            {this.props.children}
          </Text>
        </Hyperlink>

        {this._maybeRenderReadMore()}
      </View>
    );
  }

  _handlePressReadMore(){
    this.setState({showAllText: true});
  }

  _handlePressReadLess(){
    this.setState({showAllText: false});
  }

  _maybeRenderReadMore() {
    let {
      shouldShowReadMore,
      showAllText,
    } = this.state;

    if (shouldShowReadMore && !showAllText) {
      if (this.props.renderTruncatedFooter) {
        return this.props.renderTruncatedFooter(this._handlePressReadMore.bind(this));
      }

      return (
        <Text style={styles.button} onPress={this._handlePressReadMore.bind(this)}>
          もっと読む
        </Text>
      )
    } else if (shouldShowReadMore && showAllText) {
      if (this.props.renderRevealedFooter) {
        return this.props.renderRevealedFooter(this._handlePressReadLess.bind(this));
      }

      return (
        <Text style={styles.button} onPress={this._handlePressReadLess.bind(this)}>
          隠す
        </Text>
      );
    }
  }
}

function measureHeightAsync(component) {
  return new Promise((resolve, reject) => {
    try {
      component.measure((x, y, w, h) => {
        resolve(h);
      });
    } catch(e) {
      reject(e)
    }
  });
}

function nextFrameAsync() {
  return new Promise(resolve => requestAnimationFrame(() => resolve()));
}

const styles = StyleSheet.create({
  button: {
    color: '#888',
    marginTop: 10
  },
});
