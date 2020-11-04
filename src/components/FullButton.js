import { StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import { Surface, TouchableRipple } from 'react-native-paper'

import React from 'react'
import color from 'color'
import { theme } from '../core/theme'

const FullButton = ({ style, buttonColor, onPress, text, ...props }) => {
  const rippleColor = color(buttonColor).alpha(0.32).rgb().string()

  return (
    <Surface
      {...props}
      style={[
        styles.button,
        { backgroundColor: buttonColor, borderRadius: theme.roundness },
      ]}>
      <TouchableRipple
        borderless
        delayPressIn={0}
        onPress={onPress}
        style={{borderRadius: theme.roundness}}
				rippleColor={rippleColor}>
        <View style={styles.content}>
          <Text numberOfLines={1} style={[styles.label, theme.fonts.medium]}>
            {text}
          </Text>
        </View>
      </TouchableRipple>
    </Surface>
  )
}

const styles = StyleSheet.create({
  button: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    textAlign: 'center',
    letterSpacing: 1,
    marginVertical: 9,
    marginHorizontal: 16,
		textTransform: 'uppercase',
		color: 'white',
  },
})

export default React.memo(FullButton)
