import { StyleSheet, Text, View } from 'react-native'

import { TextInput as Input } from 'react-native-paper'
import React from 'react'
import { theme } from '../core/theme'

const TextInput = React.forwardRef(({ errorText, ...props }, ref) => (
  <View style={styles.container}>
    <Input
      style={styles.input}
      selectionColor={theme.colors.primary}
      underlineColor="transparent"
      mode="outlined"
      ref={ref}
      {...props}
    />
    {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
  </View>
))

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 12,
  },
  input: {
    backgroundColor: theme.colors.surface,
  },
  error: {
    fontSize: 14,
    color: theme.colors.error,
    paddingHorizontal: 4,
    paddingTop: 4,
  },
})

export default TextInput
