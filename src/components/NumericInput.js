import React, { memo } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { TextInput } from 'react-native-paper'
import { theme } from '../core/theme'

const NumericInput = ({ label, selected, Select, color }) => (
  <View style={styles.container}>
    <TextInput
      style={styles.input}
      selectionColor={color ? color : theme.colors.primary}
      theme={
        color
          ? {
              ...theme,
              colors: { placeholder: color, text: color, primary: color },
            }
          : theme
      }
      mode="outlined"
      dense
      label={label}
      value={selected}
      onChangeText={(text) => Select(text)}
      autoCapitalize="none"
      textContentType="none"
      keyboardType="decimal-pad"
    />
  </View>
)

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  input: {
    backgroundColor: theme.colors.surface,
  },
})

export default memo(NumericInput)
