import { List, Switch, Text } from 'react-native-paper'
import { StyleSheet, View } from 'react-native'
import { getItemHeader, getItemScreenColor } from '../core/utils'

import Background from '../components/Background'
import Button from '../components/Button'
import DiaInput from '../components/DiaInput'
import ItemMenu from '../components/ItemMenu'
import React from 'react'
import { theme } from '../core/theme'
import { useState } from 'react'

const FilterScreen = ({ route, navigation }) => {
  //Data state
  const [selectedGrade, SelectGrade] = useState(null)
  const [selectedShape, SelectShape] = useState(null)
  const [selectedDia, SelectDia] = useState(null)
  const [selectedLoc, SelectLoc] = useState(null)
  const [isFull, setIsFull] = useState(true)
  const [selectedOrigin, SelectOrigin] = useState(null)

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
      <ItemMenu
        item="grade"
        selected={selectedGrade}
        Select={SelectGrade}
        color={color}
        mode="contained"
      />
      <ItemMenu
        item="shape"
        selected={selectedShape}
        Select={SelectShape}
        color={color}
        mode="contained"
      />
      <ItemMenu
        item="loc"
        selected={selectedLoc}
        Select={SelectLoc}
        color={color}
        mode="contained"
      />
      <ItemMenu
        item="origin"
        selected={selectedOrigin}
        Select={SelectOrigin}
        color={color}
        mode="contained"
      />
      <DiaInput selected={selectedDia} Select={SelectDia} />
      <List.Item
        title={
          <Text style={{ color: color, fontWeight: 'bold', fontSize: 16 }}>
            Is Full Length
          </Text>
        }
        theme={theme}
        right={(props) => (
          <Switch
            {...props}
            value={isFull}
            onValueChange={(value) => setIsFull(value)}
            color={color}
          />
        )}
      />
      <Button mode="contained" color={color} onPress={handleSubmit}>
        {header_text}
      </Button>
    </Background>
  )
}

const styles = StyleSheet.create({})

export default FilterScreen
