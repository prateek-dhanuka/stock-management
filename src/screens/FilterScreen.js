import {
  DataTable,
  Dialog,
  List,
  Button as PaperButton,
  Portal,
  Switch,
  Text,
} from 'react-native-paper'
import { ScrollView, StyleSheet, ToastAndroid, View } from 'react-native'
import { addItems, findIdToRemove, removeItems } from '../core/database'
import { getItemHeader, getItemScreenColor } from '../core/utils'

import Background from '../components/Background'
import Button from '../components/Button'
import ItemMenu from '../components/ItemMenu'
import NumericInput from '../components/NumericInput'
import React from 'react'
import { theme } from '../core/theme'

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

  // Remove item Multiple items dialog
  const [dialogVisible, setDialogVisible] = React.useState(false)
  const showDialog = () => setDialogVisible(true)
  const hideDialog = () => setDialogVisible(false)
  const [ids, setIds] = React.useState({})
  const [selectedId, SelectId] = React.useState(null)
  const [data, setData] = React.useState({})

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
      headerTintColor: 'white',
    })
  }, [])

  // Submit function
  const handleSubmit = () => {
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
      if (!selectedIsFull && selectedLength === null) {
        ToastAndroid.show(`Please Enter a Length!`, ToastAndroid.SHORT)
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
      navigation.navigate('Detail', data)
    }

    if (route.params.type === 'remove') {
      console.log('Going to remove', data)
      setData(data)
      findIdToRemove(data)
        .then((ids) => {
          // console.log(`Found the following ids(${ids.length}): `, ids)
          if (Array.isArray(ids) && ids.length > 1) {
            setIds(ids)
            setDialogVisible(true)
            return
          }
        })
        .catch((error) => console.error(error))
    }

    if (route.params.type === 'detail') {
      navigation.navigate('Detail', data)
    }
  }

  const removeID = () => {
    removeItems(ids[selectedId])
    hideDialog()
    navigation.navigate('Detail', data)
  }

  return (
    <Background>
      <Portal>
        <Dialog
          visible={dialogVisible}
          onDismiss={hideDialog}
          style={{
            position: 'absolute',
            top: '0%',
            height: '90%',
          }}>
          <Dialog.ScrollArea>
            <Dialog.Title>
              Found Multiple Items that match the Filter
            </Dialog.Title>
            <ScrollView contentContainerStyle={{ padding: 24 }}>
              <DataTable>
                <DataTable.Header>
                  <DataTable.Title>Cost</DataTable.Title>
                  <DataTable.Title numeric>Length</DataTable.Title>
                </DataTable.Header>
                {Object.keys(ids).map((id) => (
                  <DataTable.Row
                    key={id}
                    style={
                      selectedId === id ? { backgroundColor: color } : null
                    }
                    onPress={() => SelectId(id)}>
                    <DataTable.Cell>
                      {ids[id].cost === 0 ? 'Unknown' : ids[id].cost}
                    </DataTable.Cell>
                    <DataTable.Cell numeric>
                      {ids[id].length === -1 ? 'Full' : ids[id].length}
                    </DataTable.Cell>
                  </DataTable.Row>
                ))}
              </DataTable>
            </ScrollView>
            <Dialog.Actions>
              <PaperButton onPress={hideDialog} color={color}>
                Cancel
              </PaperButton>
              <PaperButton onPress={removeID} color={color}>
                Remove
              </PaperButton>
            </Dialog.Actions>
          </Dialog.ScrollArea>
        </Dialog>
      </Portal>
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
