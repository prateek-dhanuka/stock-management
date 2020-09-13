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

  // Dialog State
  const [visible, setVisible] = useState(false)
  const showDialog = () => setVisible(true)
  const hideDialog = () => setVisible(false)

  // Dialog Data State
  const [typeGrade, setTypeGrade] = useState('en-8')
  const [typeShape, setTypeShape] = useState('square')
  const [typeDia, setTypeDia] = useState(0)

  //Filter Data State
  const [filterGrade, setFilterGrade] = useState('grade')
  const [filterShape, setFilterShape] = useState('shape')
  const [filterDia, setFilterDia] = useState('')

  // Selected State
  const [selected, Select] = useState('')

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
  }, [visible])

  const handleMinus = () => {
    console.log('Pressed -')
  }

  const filter = () => {
    console.log(`Filter!`)
  }

  // Set Navbar
  navigation.setOptions({
    headerRight: () => (
      <View style={{ flexDirection: 'row' }}>
        <IconButton icon="filter-variant" size={20} onPress={filter} />
        <IconButton icon="plus" size={20} onPress={showDialog} />
        <IconButton icon="minus" size={20} onPress={handleMinus} />
      </View>
    ),
  })

  //Upload Data Handler
  const onUploadData = async () => {
    await uploadData({ grade: typeGrade, dia: typeDia, shape: typeShape })
    setVisible(false)
  }

  //Handle Sorting of table
  const handleSort = (heading) => {
    console.log(`clicked on ${heading}`)
  }

  return (
    <View>
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Add Item</Dialog.Title>
          <Dialog.Content>
            <View>
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
              <DialogInput
                label="Diameter"
                value={typeDia.value}
                onChangeText={(text) => setTypeDia({ value: text, error: '' })}
                error={!!typeDia.error}
                errorText={typeDia.error}
                autoCapitalize="none"
                textContentType="none"
                keyboardType="decimal-pad"
              />
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={onUploadData}>Done</Button>
            <Button onPress={hideDialog}>Cancel</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <DataTable theme={theme}>
        <DataTable.Header theme={theme}>
          <DataTable.Title theme={theme} onPress={() => handleSort('Shape')}>
            Shape
          </DataTable.Title>
          <DataTable.Title theme={theme} onPress={() => handleSort('Diameter')}>
            Diameter
          </DataTable.Title>
          <DataTable.Title theme={theme} onPress={() => handleSort('Grade')}>
            Grade
          </DataTable.Title>
          <DataTable.Title theme={theme} onPress={() => handleSort('Full')}>
            Full
          </DataTable.Title>
          <DataTable.Title theme={theme} onPress={() => handleSort('Partial')}>
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
              <DataTable.Cell theme={theme}>{item.shape}</DataTable.Cell>
              <DataTable.Cell theme={theme}>{item.dia}</DataTable.Cell>
              <DataTable.Cell theme={theme}>{item.grade}</DataTable.Cell>
              <DataTable.Cell theme={theme}>{item.full}</DataTable.Cell>
              <DataTable.Cell theme={theme}>{item.partial}</DataTable.Cell>
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
