import React, {Component} from 'react';
import {Animated, StyleSheet, Text, View, Platform} from 'react-native';

const HEADER_MAX_HEIGHT = 300;
const HEADER_MIN_HEIGHT = Platform.OS === 'ios' ? 60 : 73;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

export default class ScrollableHeader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      scrollY: new Animated.Value(0),
    };
  }

  _renderScrollViewContent() {
    const data = Array.from({length: 30});
    return (
      <View style={styles.scrollViewContent}>
        {data.map((_, i) => (
          <View key={i} style={styles.row}>
            <Text>{i}</Text>
          </View>
        ))}
      </View>
    );
  }

  render() {
    const headerTranslate = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [0, -HEADER_SCROLL_DISTANCE],
      extrapolate: 'clamp',
    });

    const imageOpacity = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
      outputRange: [1, 1, 0],
      extrapolate: 'clamp',
    });

    const imageTranslate = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [0, 100],
      extrapolate: 'clamp',
    });

    const titleScale = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
      outputRange: [1, 1, 0.8],
      extrapolate: 'clamp',
    });
    const titleTranslate = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
      outputRange: [0, 0, -8],
      extrapolate: 'clamp',
    });

    return (
      <View style={styles.fill}>
        <Animated.ScrollView
          style={styles.fill}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {y: this.state.scrollY}}}],
            {useNativeDriver: true},
          )}>
          {this._renderScrollViewContent()}
        </Animated.ScrollView>
        <Animated.View
          style={[styles.header, {transform: [{translateY: headerTranslate}]}]}>
          <Animated.Image
            style={[
              styles.backgroundImage,
              {
                opacity: imageOpacity,
                transform: [{translateY: imageTranslate}],
              },
            ]}
            source={require('./images/cat.jpg')}
          />
        </Animated.View>
        <Animated.View
          style={[
            styles.bar,
            {
              transform: [{scale: titleScale}, {translateY: titleTranslate}],
            },
          ]}>
          <Text style={styles.title}>Title</Text>
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  row: {
    height: 40,
    margin: 16,
    backgroundColor: '#D3D3D3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#03A9F4',
    overflow: 'hidden',
    height: HEADER_MAX_HEIGHT,
  },
  bar: {
    backgroundColor: 'transparent',
    marginTop: 28,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  title: {
    backgroundColor: 'transparent',
    color: 'white',
    fontSize: 18,
  },
  scrollViewContent: {
    marginTop: HEADER_MAX_HEIGHT,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: null,
    height: HEADER_MAX_HEIGHT,
    resizeMode: 'cover',
  },
});
