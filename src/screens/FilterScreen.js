import { List, Switch, Text } from 'react-native-paper'
import { StyleSheet, ToastAndroid, View } from 'react-native'
import { getItemHeader, getItemScreenColor } from '../core/utils'

import Background from '../components/Background'
import Button from '../components/Button'
import ItemMenu from '../components/ItemMenu'
import NumericInput from '../components/NumericInput'
import React from 'react'
import { addItems } from '../core/database'
import { theme } from '../core/theme'
import { useState } from 'react'

const FilterScreen = ({ route, navigation }) => {
  //Data state
  const [selectedGrade, SelectGrade] = React.useState(null)
  const [selectedShape, SelectShape] = React.useState(null)
  const [selectedDia, SelectDia] = React.useState(null)
  const [selectedLoc, SelectLoc] = React.useState(null)
  const [selectedCost, SelectCost] = React.useState(null)
  const [selectedCount, SelectCount] = React.useState(null)
  const [selectedLength, SelectLength] = React.useState(null)
  const [selectedOrigin, SelectOrigin] = React.useState(null)
  const [selectedColor, SelectColor] = React.useState(null)
  const [selectedIsFull, SelectIsFull] = React.useState(true)

  //Get Navbar data
  var color = getItemScreenColor(route.params.type)
  var header_text = getItemHeader(route.params.type)

  // Set Navbar
  React.useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: color,
      },
      title: header_text,
      headerTintColor: 'lightyellow',
    })
  }, [])

  // Submit function
  const handleSubmit = () => {
    //TODO: Add form verification
    //TODO: Add database integration
    //TODO: Add length decoding capability

    // Detail form verification
    if (route.params.type === 'detail') {
      if (selectedGrade === null) {
        ToastAndroid.show('Please select a Grade!', ToastAndroid.SHORT)
        return
      }
      if (selectedShape === null) {
        ToastAndroid.show('Please select a Shape!', ToastAndroid.SHORT)
        return
      }
      if (selectedDia === null) {
        ToastAndroid.show('Please Enter a Dia!', ToastAndroid.SHORT)
        return
      }
    }

    // Add/Remove form verification
    if (route.params.type === 'add' || route.params.type === 'remove') {
      if (selectedGrade === null) {
        ToastAndroid.show('Please select a Grade!', ToastAndroid.SHORT)
        return
      }
      if (selectedShape === null) {
        ToastAndroid.show('Please select a Shape!', ToastAndroid.SHORT)
        return
      }
      if (selectedLoc === null) {
        ToastAndroid.show('Please Enter a Location', ToastAndroid.SHORT)
        return
      }
      if (selectedOrigin === null) {
        ToastAndroid.show('Please Enter a Origin', ToastAndroid.SHORT)
        return
      }
      if (selectedColor === null) {
        ToastAndroid.show('Please Enter a Color!', ToastAndroid.SHORT)
      }
      if (selectedDia === null) {
        ToastAndroid.show('Please Enter a Dia!', ToastAndroid.SHORT)
        return
      }
    }

    const data = {
      grade: selectedGrade,
      shape: selectedShape,
      dia: parseInt(selectedDia),
      loc: selectedLoc,
      cost: selectedCost ? parseInt(selectedCost) : 0,
      length: selectedIsFull ? -1 : parseInt(selectedLength),
      origin: selectedOrigin,
      color: selectedColor,
      count: selectedCount ? parseInt(selectedCount) : 1,
    }

    if (route.params.type === 'add') {
      console.log('Going to add ', data)
      addItems(data)
        .then(() => console.log(`Added item via a transaction`))
        .catch((error) => console.error(error))
    }

    navigation.navigate('Test', data)
  }

  return (
    <Background>
      {/* <View style={styles.topContainer} /> */}
      <View style={styles.topContainer}>
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
        {route.params.type === 'detail' ? null : (
          <>
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
            <ItemMenu
              item="color"
              selected={selectedColor}
              Select={SelectColor}
              color={color}
              mode="contained"
            />
          </>
        )}
        <NumericInput
          label={'Diameter'}
          selected={selectedDia}
          Select={SelectDia}
          color={color}
        />
        {route.params.type === 'detail' ? null : (
          <>
            <NumericInput
              label={'Cost'}
              selected={selectedCost}
              Select={SelectCost}
              color={color}
            />
            <NumericInput
              label="Count"
              selected={selectedCount}
              Select={SelectCount}
              color={color}
            />
            <List.Item
              title={
                <Text style={{ color, fontWeight: 'bold', fontSize: 16 }}>
                  Is Full Length
                </Text>
              }
              right={(props) => (
                <Switch
                  {...props}
                  value={selectedIsFull}
                  onValueChange={(value) => SelectIsFull(value)}
                  color={color}
                />
              )}
            />
          </>
        )}
        {selectedIsFull ? null : (
          <NumericInput
            label="Length"
            selected={selectedLength}
            Select={SelectLength}
            color={color}
          />
        )}
      </View>
      <View style={styles.bottomContainer}>
        <Button mode="contained" color={color} onPress={handleSubmit}>
          {header_text}
        </Button>
      </View>
    </Background>
  )
}

const styles = StyleSheet.create({
  topContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    // backgroundColor: 'red',
  },
  bottomContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    // backgroundColor: 'green',
  },
  centerContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    // backgroundColor: 'blue',
  },
})

export default FilterScreen
