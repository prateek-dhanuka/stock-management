import { Button, Dialog, IconButton, Portal } from 'react-native-paper'
import { StyleSheet, Text, View } from 'react-native'
import { getItemHeader, getItemScreenColor } from '../core/utils'

import Background from '../components/Background'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import ItemMenu from '../components/ItemMenu'
import NumericInput from '../components/NumericInput'
import React from 'react'
import ValidContext from '../core/ValidContext'
import { getSummary } from '../core/database'
import { getSummaryHeader } from '../core/utils'

const SummaryScreen = ({ route, navigation }) => {
  // Summary filter dialog state
  const [dialogVisible, setDialogVisible] = React.useState(false)
  const showDialog = () => setDialogVisible(true)
  const hideDialog = () => setDialogVisible(false)

  // Selected Grade and Shape
  const [selectedGrade, SelectGrade] = React.useState(null)
  const [selectedShape, SelectShape] = React.useState(null)
  const [dia, setDia] = React.useState(null)
  const [selectedLoc, SelectLoc] = React.useState(null)
  const [selectedOrigin, SelectOrigin] = React.useState(null)

  // Summary
  const [summary, setSummary] = React.useState({})

  React.useEffect(() => {
    setSummary(getSummary(selectedGrade, selectedShape, dia))
  }, [selectedGrade, selectedShape, dia])

  // Valid states
  const valid = React.useContext(ValidContext)

  // Header Text
  const header_text = getSummaryHeader(route.params, valid)

  //Set Navbar
  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: header_text,
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          <IconButton icon="filter-variant" size={20} onPress={showDialog} />
        </View>
      ),
    })
  }, [valid, route.params])

  // Navigate to item screens
  const detailItem = () => {
    navigation.navigate('Filter', { type: 'detail' })
  }

  const addItem = () => {
    navigation.navigate('Filter', { type: 'add' })
  }

  const removeItem = () => {
    navigation.navigate('Filter', { type: 'remove' })
  }

  //Filter Functions
  const filter = () => {
    hideDialog()
    navigation.setParams({
      grade: selectedGrade,
      shape: selectedShape,
      dia: dia,
    })
  }

  const clearFilters = () => {
    SelectGrade(null)
    setDia(null)
    SelectShape(null)
    hideDialog()
    navigation.setParams({ grade: null, shape: null, dia: null })
  }

  return (
    <Background>
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={hideDialog}>
          <Dialog.Title>Filter Summary</Dialog.Title>
          <Dialog.Content>
            <View>
              <ItemMenu
                item="grade"
                selected={selectedGrade}
                Select={SelectGrade}
              />
              <ItemMenu
                item="shape"
                selected={selectedShape}
                Select={SelectShape}
              />
              <NumericInput label={'Diameter'} selected={dia} Select={setDia} />
              <ItemMenu item="loc" selected={selectedLoc} Select={SelectLoc} />
              <ItemMenu
                item="origin"
                selected={selectedOrigin}
                Select={SelectOrigin}
              />
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
      <>
        <View style={styles.topContainer}>
          <Text style={styles.summaryText}>
            There are {summary.count} rods in stock
          </Text>
          <Text style={styles.summaryText}>
            The combined weight is {summary.weight}Kg
          </Text>
          <Text style={styles.summaryText}>
            The estimated cost is ₹{summary.cost}
          </Text>
        </View>
        <View style={styles.bottomContainer}>
          <Button
            style={styles.button}
            mode="contained"
            color={getItemScreenColor('detail')}
            contentStyle={{ height: 50 }}
            onPress={detailItem}>
            Detail Item
          </Button>
          <Button
            style={styles.button}
            mode="contained"
            color={getItemScreenColor('add')}
            contentStyle={{ height: 50 }}
            onPress={addItem}>
            Add Item
          </Button>
          <Button
            style={styles.button}
            mode="contained"
            color={getItemScreenColor('remove')}
            contentStyle={{ height: 50 }}
            onPress={removeItem}>
            Remove Item
          </Button>
        </View>
      </>
    </Background>
  )
}

const styles = StyleSheet.create({
  summaryText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'left',
    lineHeight: 40,
  },
  button: {
    margin: 12,
  },
  topContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  bottomContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  centerContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
})

export default SummaryScreen
