import { Button, Dialog, IconButton, Portal } from 'react-native-paper'
import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import {
  grade_display,
  grades,
  shape_display,
  shapes,
} from '../assets/constants'

import Background from '../components/Background'
import DialogInput from '../components/DialogInput'
import GradeMenu from '../components/GradeMenu'
import Header from '../components/Header'
import { Picker } from '@react-native-community/picker'
import ShapeMenu from '../components/ShapeMenu'
import { getSummary } from '../core/database'
import { getSummaryHeader } from '../core/utils'

const SummaryScreen = ({ route, navigation }) => {
  // Summary filter dialog state
  const [dialogVisible, setDialogVisible] = useState(false)
  const showDialog = () => setDialogVisible(true)
  const hideDialog = () => setDialogVisible(false)

  // Selected Grade and Shape
  const [selectedGrade, SelectGrade] = useState(null)
  const [selectedShape, SelectShape] = useState(null)
  const [selectedLoc, SelectLoc] = useState(null)
  const [selectedOrigin, SelectOrigin] = useState(null)

  //Filter Data state
  const [grade, setGrade] = useState(null)
  const [shape, setShape] = useState(null)
  const [dia, setDia] = useState(null)

  // Header Text
  const header_text = getSummaryHeader(route.params)

  //Set Navbar
  navigation.setOptions({
    title: header_text,
    headerRight: () => (
      <View style={{ flexDirection: 'row' }}>
        <IconButton icon="filter-variant" size={20} onPress={showDialog} />
      </View>
    ),
  })

  // Navigate to item screens
  const detailItem = () => {
    navigation.navigate('Item', { type: 'detail' })
  }

  const addItem = () => {
    navigation.navigate('Item', { type: 'add' })
  }

  const removeItem = () => {
    navigation.navigate('Item', { type: 'remove' })
  }

  //Filter Functions
  const filter = () => {
    hideDialog()
    navigation.navigate('Summary', { grade: grade, shape: shape, dia: dia })
  }

  const clearFilters = () => {
    setGrade(null)
    setDia(null)
    setShape(null)
    hideDialog()
    navigation.navigate('Summary', { grade: null, shape: null, dia: null })
  }

  const summary = getSummary(grade, shape, dia)

  return (
    <Background>
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={hideDialog}>
          <Dialog.Title>Filter Summary</Dialog.Title>
          <Dialog.Content>
            <View>
              <GradeMenu selected={selectedGrade} Select={SelectGrade} />
              <ShapeMenu selected={selectedShape} Select={SelectShape} />
              <DialogInput
                label="Diameter"
                value={dia}
                onChangeText={(text) => setDia(text)}
                autoCapitalize="none"
                textContentType="none"
                keyboardType="decimal-pad"
              />
              <LocMenu selected={selectedLoc} Select={SelectLoc} />
              <OriginMenu selected={selectedOrigin} Select={SelectOrigin} />
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={clearFilters}>Clear Filters</Button>
            <View style={styles.divider} />
            <Button onPress={filter}>Done</Button>
            <Button onPress={hideDialog}>Cancel</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <View style={styles.container}>
        <Text style={styles.summaryText}>
          There are {summary.count} rods in stock
        </Text>
        <Text style={styles.summaryText}>
          The combined weight is {summary.weight}Kg
        </Text>
        <Text style={styles.summaryText}>
          The estimated cost is ₹{summary.cost}
        </Text>
        <View style={styles.divider} />
        <Button
          style={styles.button}
          mode="contained"
          color="blue"
          contentStyle={{ height: 50 }}
          onPress={detailItem}>
          Detail Item
        </Button>
        <Button
          style={styles.button}
          mode="contained"
          color="green"
          contentStyle={{ height: 50 }}
          onPress={addItem}>
          Add Item
        </Button>
        <Button
          style={styles.button}
          mode="contained"
          color="red"
          contentStyle={{ height: 50 }}
          onPress={removeItem}>
          Remove Item
        </Button>
      </View>
    </Background>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    // alignItems: 'center',
  },
  divider: {
    flex: 1,
  },
  summaryText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'left',
    lineHeight: 40,
  },
  button: {
    margin: 12,
  },
})

export default SummaryScreen
