import { Chip, Text } from 'react-native-paper'
import { ScrollView, StyleSheet, View } from 'react-native'

import React from 'react'
import ValidContext from '../core/ValidContext'

const GradePicker = ({ selected, Select, color, selectedColor }) => {
  // Valid grades
  const { grades } = React.useContext(ValidContext)

  // console.log(`Selected color: ${selectedColor}, Main color: ${color}`)

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ alignItems: 'center' }}>
      <View style={styles.row}>
        {Object.keys(grades).map((grade) => (
          <Chip
            style={[
              styles.chip,
              { backgroundColor: selectedColor ? selectedColor : null },
            ]}
            selected={selected === grade ? true : false}
            selectedColor={selectedColor}
            onPress={() => {
              // console.log(`Selected ${grade}`)
              Select(grade)
            }}
            textStyle={{ color: selectedColor }}
            key={grade}>
            <Text style={styles.chipText}>{grades[grade].text}</Text>
          </Chip>
        ))}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
  },
  chip: {
    margin: 4,
  },
  chipText: {
    color: '#ffffff',
  },
})

export default React.memo(GradePicker)
