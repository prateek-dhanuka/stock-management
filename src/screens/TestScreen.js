import { IconButton, List } from 'react-native-paper'
import { StyleSheet, Text, View } from 'react-native'

import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import React from 'react'
import ValidContext from '../core/ValidContext'

const TestScreen = ({ route, navigation }) => {
  // Valid states
  const valid = React.useContext(ValidContext)

  return (
    <View style={styles.container}>
      <IconButton
        size={25}
        icon={valid.shapes[route.params.shape].icon}
        style={styles.button}
      />
      <Text style={styles.diaText}>{route.params.dia}</Text>
      <IconButton
        icon={valid.grades[route.params.grade].icon}
        size={25}
        style={styles.button}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    marginHorizontal: -2,
  },
  diaText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'black',
    // backgroundColor: 'blue',
  },
})

export default TestScreen
