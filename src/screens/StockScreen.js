import React, { useState, useEffect } from 'react'
import {
  DataTable,
  IconButton,
  Dialog,
  Portal,
  Paragraph,
  Button,
  Menu,
  Title,
} from 'react-native-paper'
import { View, Text } from 'react-native'
import { theme } from '../core/theme'
import TextInput from '../components/TextInput'
import { Picker } from '@react-native-community/picker'
import DialogInput from '../components/DialogInput'
import { getData, uploadData } from '../core/database'

const itemsPerPage = 10

const StockScreen = ({ navigation }) => {
  // Data State
  const [data, setData] = useState([])

  // Page State
  const [page, setPage] = useState(0)
  const from = page * itemsPerPage
  const to = Math.min((page + 1) * itemsPerPage, data.length)

  // Add Type Dialog State
  const [typeDialogVisible, setTypeDialogVisible] = useState(false)
  const showTypeDialog = () => setTypeDialogVisible(true)
  const hideTypeDialog = () => setTypeDialogVisible(false)

  // Type Dialog Data
  const [typeGrade, setTypeGrade] = useState('en-8')
  const [typeShape, setTypeShape] = useState('square')
  const [typeDia, setTypeDia] = useState(0)

  // Filter Dialog State
  const [filterDialogVisible, setFilterDialogVisible] = useState(false)
  const showFilterDialog = () => setFilterDialogVisible(true)
  const hideFilterDialog = () => setFilterDialogVisible(false)

  // Filter Dialog Data
  const [filterGrade, setFilterGrade] = useState('grade')
  const [filterShape, setFilterShape] = useState('shape')
  const [filterDia, setFilterDia] = useState('')

  // Selected State
  const [selected, Select] = useState('')

  // Sort state
  const [sortBy, SetSort] = useState({ heading: 'key', ascending: true })

  // Get Database Data
  useEffect(() => {
    console.log(`Get data called`)
    getData()
      .then((data) => {
        setData(data)
      })
      .catch((error) => {
        console.error(error)
      })
  }, [typeDialogVisible])

  const handleMinus = () => {
    console.log('Pressed -')
  }

  // Set Navbar
  navigation.setOptions({
    headerRight: () => (
      <View style={{ flexDirection: 'row' }}>
        <IconButton
          icon="filter-variant"
          size={20}
          onPress={showFilterDialog}
        />
        <IconButton icon="plus" size={20} onPress={showTypeDialog} />
        <IconButton icon="minus" size={20} onPress={handleMinus} />
      </View>
    ),
  })

  //Upload Data Handler
  const onUploadData = async () => {
    await uploadData({ grade: typeGrade, dia: typeDia, shape: typeShape })
    setTypeDialogVisible(false)
  }

  //Handle Sorting of table
  const handleSort = (heading) => {
    if (sortBy.heading != heading) {
      SetSort({ heading: heading, ascending: true })
      console.log(`Sorting ${heading} in ascending order`)
    } else {
      if (sortBy.ascending) {
        SetSort({ ...sortBy, ascending: false })
        console.log(`Sorting ${heading} in descending order`)
      } else {
        console.log(`Stop sorting ${heading}`)
        SetSort({ heading: 'key', ascending: true })
      }
    }

    //TODO fix sort
    var tempData = Object.values({ ...data })
    console.log(typeof tempData)
    tempData.sort((a, b) => {
      var keyA = a[sortBy.heading]
      var keyB = b[sortBy.heading]

      if (sortBy.ascending) {
        return keyA < keyB ? 1 : keyA > keyB ? -1 : 0
      } else {
        return keyA < keyB ? -1 : keyA > keyB ? 1 : 0
      }
    })
    setData(tempData)
  }

  const filter = () => {
    console.log(
      `Filtering by Grade: ${filterGrade}, Shape: ${filterShape}, Dia: ${filterDia}`
    )
    hideTypeDialog()
  }

  return (
    <View>
      <Portal>
        {/* Filter Dialog */}
        <Dialog visible={filterDialogVisible} onDismiss={hideFilterDialog}>
          <Dialog.Title>Filter Data</Dialog.Title>
          <Dialog.Content>
            <View>
              {/* Filter grade picker */}
              <View style={{ flexDirection: 'column' }}>
                <Text>Grade: </Text>
                <Picker
                  selectedValue={filterGrade}
                  onValueChange={(itemValue, itemIndex) =>
                    setFilterGrade(itemValue)
                  }>
                  <Picker.Item label="Grade" value="grade" />
                  <Picker.Item label="EN-8" value="en-8" />
                  <Picker.Item label="EN-19" value="en-19" />
                  <Picker.Item label="MS" value="ms" />
                </Picker>
              </View>
              {/* Filter shape picker */}
              <View style={{ flexDirection: 'column' }}>
                <Text>Shape: </Text>
                <Picker
                  selectedValue={filterShape}
                  onValueChange={(itemValue, itemIndex) =>
                    setFilterShape(itemValue)
                  }>
                  <Picker.Item label="Shape" value="shape" />
                  <Picker.Item label="Square" value="square" />
                  <Picker.Item label="Round" value="round" />
                </Picker>
              </View>
              {/* Filter Dia text input */}
              <DialogInput
                label="Diameter"
                value={filterDia}
                onChangeText={(text) => setFilterDia(text)}
                error={false}
                errorText={''}
                autoCapitalize="none"
                textContentType="none"
                keyboardType="decimal-pad"
              />
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={filter}>Done</Button>
            <Button onPress={hideFilterDialog}>Cancel</Button>
          </Dialog.Actions>
        </Dialog>

        {/* Type Dialog */}
        <Dialog visible={typeDialogVisible} onDismiss={hideTypeDialog}>
          <Dialog.Title>Add Item</Dialog.Title>
          <Dialog.Content>
            <View>
              {/* Type grade picker */}
              <View style={{ flexDirection: 'column' }}>
                <Text>Grade: </Text>
                <Picker
                  selectedValue={typeGrade}
                  onValueChange={(itemValue, itemIndex) =>
                    setTypeGrade(itemValue)
                  }>
                  <Picker.Item label="EN-8" value="en-8" />
                  <Picker.Item label="EN-19" value="en-19" />
                  <Picker.Item label="MS" value="ms" />
                </Picker>
              </View>
              {/* Type shape picker */}
              <View style={{ flexDirection: 'column' }}>
                <Text>Shape: </Text>
                <Picker
                  selectedValue={typeShape}
                  onValueChange={(itemValue, itemIndex) =>
                    setTypeShape(itemValue)
                  }>
                  <Picker.Item label="Square" value="square" />
                  <Picker.Item label="Round" value="round" />
                </Picker>
              </View>
              {/* Type dia text input */}
              <DialogInput
                label="Diameter"
                value={typeDia}
                onChangeText={(text) => setTypeDia(text)}
                error={false}
                errorText={''}
                autoCapitalize="none"
                textContentType="none"
                keyboardType="decimal-pad"
              />
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={onUploadData}>Done</Button>
            <Button onPress={hideTypeDialog}>Cancel</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      {/* Data table */}
      <DataTable theme={theme}>
        <DataTable.Header theme={theme}>
          <DataTable.Title
            theme={theme}
            onPress={() => handleSort('Shape')}
            sortDirection={
              sortBy.heading === 'Shape'
                ? sortBy.ascending
                  ? 'ascending'
                  : 'descending'
                : ''
            }
            style={{ flex: 0.2 }}>
            Shape
          </DataTable.Title>
          <DataTable.Title
            theme={theme}
            onPress={() => handleSort('Diameter')}
            sortDirection={
              sortBy.heading === 'Diameter'
                ? sortBy.ascending
                  ? 'ascending'
                  : 'descending'
                : ''
            }
            style={{ flex: 0.2 }}>
            Dia
          </DataTable.Title>
          <DataTable.Title
            theme={theme}
            onPress={() => handleSort('Grade')}
            sortDirection={
              sortBy.heading === 'Grade'
                ? sortBy.ascending
                  ? 'ascending'
                  : 'descending'
                : ''
            }
            style={{ flex: 0.3 }}>
            Grade
          </DataTable.Title>
          <DataTable.Title
            theme={theme}
            onPress={() => handleSort('Full')}
            sortDirection={
              sortBy.heading === 'Full'
                ? sortBy.ascending
                  ? 'ascending'
                  : 'descending'
                : ''
            }
            style={{ flex: 0.15 }}>
            Full
          </DataTable.Title>
          <DataTable.Title
            theme={theme}
            onPress={() => handleSort('Partial')}
            sortDirection={
              sortBy.heading === 'Partial'
                ? sortBy.ascending
                  ? 'ascending'
                  : 'descending'
                : ''
            }
            style={{ flex: 0.15 }}>
            Partial
          </DataTable.Title>
        </DataTable.Header>
        {data.slice(from, to).map((item) => {
          return (
            <DataTable.Row
              key={item.key}
              onPress={() =>
                selected === item.key ? Select('') : Select(item.key)
              }
              style={
                selected === item.key
                  ? { backgroundColor: theme.colors.primary }
                  : {}
              }>
              <DataTable.Cell theme={theme} style={{ flex: 0.2 }}>
                {item.shape}
              </DataTable.Cell>
              <DataTable.Cell theme={theme} style={{ flex: 0.2 }}>
                {item.dia}
              </DataTable.Cell>
              <DataTable.Cell theme={theme} style={{ flex: 0.3 }}>
                {item.grade}
              </DataTable.Cell>
              <DataTable.Cell theme={theme} style={{ flex: 0.15 }}>
                {item.full}
              </DataTable.Cell>
              <DataTable.Cell theme={theme} style={{ flex: 0.15 }}>
                {item.partial}
              </DataTable.Cell>
            </DataTable.Row>
          )
        })}
        <DataTable.Pagination
          page={page}
          numberOfPages={Math.ceil(data.length / itemsPerPage)}
          onPageChange={(page) => setPage(page)}
          label={`${from + 1}-${to} of ${data.length}`}
          theme={theme}
        />
      </DataTable>
    </View>
  )
}

export default StockScreen
