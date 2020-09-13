import React, { memo } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { TextInput as Input } from 'react-native-paper'
import { theme } from '../core/theme'

const TextInput = ({ ...props }) => (
  <Input
    style={styles.input}
    selectionColor={theme.colors.primary}
    underlineColor={theme.colors.primary}
    mode="flat"
    {...props}
  />
)

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 12,
  },
  input: {
    backgroundColor: theme.colors.surface,
  },
})

export default memo(TextInput)
