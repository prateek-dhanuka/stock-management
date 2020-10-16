import { Checkbox, Text } from 'react-native-paper'
import { StyleSheet, View } from 'react-native'
import { getItemHeader, getItemScreenColor } from '../core/utils'
import {
  grade_display,
  grades,
  shape_display,
  shapes,
} from '../assets/constants'

import Background from '../components/Background'
import Button from '../components/Button'
import { Picker } from '@react-native-community/picker'
import React from 'react'
import TextInput from '../components/TextInput'
import { theme } from '../core/theme'
import { useState } from 'react'

const ItemScreen = ({ route, navigation }) => {
  //Data state
  const [grade, setGrade] = useState(null)
  const [shape, setShape] = useState(null)
  const [dia, setDia] = useState(null)
  const [count, setCount] = useState(1)
  const [length, setLength] = useState(null)
  const [isFull, setIsFull] = useState(true)

  //Get Navbar data
  var color = getItemScreenColor(route.params.type)
  var header_text = getItemHeader(route.params.type)

  // Set Navbar
  navigation.setOptions({
    headerStyle: {
      backgroundColor: color,
    },
    title: header_text,
    headerTintColor: 'lightyellow',
  })

  // Submit function
  const handleSubmit = () => {
    //TODO: Add form verification
    //TODO: Add database integration
    //TODO: Add length decoding capability
    console.log(
      `${route.params.type}ed the following item: ${shape} ${dia}${grade}. Full = ${isFull}. Count = ${count}. length = ${length}`
    )
    navigation.navigate('Summary', { grade: null, shape: null, dia: null })
  }

  return (
    <Background>
      <View style={styles.pickerView}>
        <Picker
          selectedValue={grade}
          onValueChange={(itemValue, itemIndex) => {
            setGrade(itemValue)
          }}
          style={styles.picker}>
          <Picker.Item label="Please select a Grade..." value={null} />
          {grades.map((grade) => (
            <Picker.Item
              label={grade_display[grade]}
              value={grade}
              key={grade}
            />
          ))}
        </Picker>
      </View>
      <View style={styles.pickerView}>
        <Picker
          selectedValue={shape}
          onValueChange={(itemValue, itemIndex) => {
            setShape(itemValue)
          }}
          style={styles.picker}>
          <Picker.Item label="Please select a Shape..." value={null} />
          {shapes.map((shape) => (
            <Picker.Item
              label={shape_display[shape]}
              value={shape}
              key={shape}
            />
          ))}
        </Picker>
      </View>
      <TextInput
        label="Diameter"
        returnKeyType="next"
        value={dia}
        onChangeText={(text) => setDia(text)}
        error={false}
        errorText=""
        autoCapitalize="none"
        keyboardType="decimal-pad"
      />
      <TextInput
        label="Count"
        returnKeyType="next"
        value={count}
        onChangeText={(text) => setCount(text)}
        error={false}
        errorText=""
        autoCapitalize="none"
        keyboardType="decimal-pad"
      />
      <View
        style={styles.horizontal}
        onPress={() => {
          setIsFull(!isFull)
        }}>
        <Text style={styles.text}>
          {isFull ? 'Full Length' : 'Partial Length'}
        </Text>
        <View style={styles.divider} />
        <Checkbox
          color={color}
          status={isFull ? 'checked' : 'unchecked'}
          onPress={() => {
            setIsFull(!isFull)
          }}
        />
      </View>
      {isFull ? (
        <View />
      ) : (
        <TextInput
          label="Length"
          returnKeyType="done"
          value={length}
          onChangeText={(text) => setLength(text)}
          error={false}
          errorText=""
          autoCapitalize="none"
          keyboardType="number-pad"
        />
      )}
      <Button mode="contained" color={color} onPress={handleSubmit}>
        {header_text}
      </Button>
    </Background>
  )
}

const styles = StyleSheet.create({
  pickerView: {
    width: '100%',
    backgroundColor: theme.colors.surface,
    marginVertical: 12,
    borderWidth: 1,
    borderRadius: theme.roundness,
  },
  horizontal: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    marginVertical: 12,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderRadius: theme.roundness,
  },
  divider: {
    flex: 1,
  },
  text: {
    margin: 12,
    fontSize: 15,
  },
})

export default ItemScreen
