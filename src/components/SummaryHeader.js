import { StyleSheet, Text, View } from 'react-native'

import React from 'react'

export default function SummaryHeader({ grade, shape, dia }) {
  console.log(`Called with grade=${grade}, shape=${shape} and dia=${dia}`)

  return (
    <View style={styles.container}>
      <Text style={styles.diaText}>Summary</Text>
      {shape ? (
        <IconButton size={20} style={styles.iconButton} icon={grade.icon} />
      ) : null}
      {dia ? <Text style={styles.diaText}>dia</Text> : null}
      {grade ? (
        <IconButton size={20} style={styles.iconButton} icon={shape.icon} />
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  iconButton: {
    marginHorizontal: -2,
  },
  diaText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'black',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
