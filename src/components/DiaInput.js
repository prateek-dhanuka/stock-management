import React, { memo } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { TextInput } from 'react-native-paper'
import { theme } from '../core/theme'

const DiaInput = ({ selected, Select }) => (
  <View style={styles.container}>
    <TextInput
      style={styles.input}
      selectionColor={theme.colors.primary}
      underlineColor={theme.colors.primary}
      mode="outlined"
      dense
      label="Diameter"
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

export default memo(DiaInput)
