import {
  ImageBackground,
  KeyboardAvoidingView,
  StyleSheet,
  View,
} from 'react-native'
import React, { memo } from 'react'

const Background = ({ children }) => (
  <ImageBackground
    source={require('../assets/background_dot.png')}
    resizeMode="repeat"
    style={styles.background}>
    <KeyboardAvoidingView style={styles.container} behavior="height">
      {children}
    </KeyboardAvoidingView>
  </ImageBackground>
)

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    // flex: 1,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  container: {
    // flex: 1,
    flexDirection: 'column',
    padding: 20,
    height: '100%',
    width: '100%',
    // maxWidth: 340,
    alignSelf: 'center',
    // alignItems: 'center',
    justifyContent: 'space-around',
  },
})

export default memo(Background)
