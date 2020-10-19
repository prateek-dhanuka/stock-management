import { ImageBackground, StyleSheet, View } from 'react-native'
import React, { memo } from 'react'

const Background = ({ children }) => (
  <ImageBackground
    source={require('../assets/background_dot.png')}
    resizeMode="repeat"
    style={styles.background}>
    <View style={styles.container} behavior="padding">
      {children}
    </View>
  </ImageBackground>
)

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    flex: 1,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  container: {
    flex: 1,
    padding: 20,
    width: '100%',
    // maxWidth: 340,
    alignSelf: 'center',
    // alignItems: 'center',
    justifyContent: 'center',
  },
})

export default memo(Background)
