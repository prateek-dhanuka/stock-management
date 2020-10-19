import React, { memo } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { TextInput as Input } from 'react-native-paper'
import { theme } from '../core/theme'

const TextInput = ({ ...props }) => (
  <View style={styles.container}>
    <Input
      style={styles.input}
      selectionColor={theme.colors.primary}
      underlineColor={theme.colors.primary}
      mode="outlined"
      dense
      {...props}
    />
  </View>
)

const styles = StyleSheet.create({
  container: {
    // width: '100%',
  },
  input: {
    backgroundColor: theme.colors.surface,
  },
})

export default memo(TextInput)
