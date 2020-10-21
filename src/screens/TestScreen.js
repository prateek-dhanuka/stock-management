import { DataTable, List } from 'react-native-paper'
import { StyleSheet, Text, View } from 'react-native'

import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import React from 'react'
import ValidContext from '../core/ValidContext'

const TestScreen = ({ route, navigation }) => {
  // Received params
  const { grade, shape, dia } = route.params

  // Valid states
  const valid = React.useContext(ValidContext)

  // Set header text
  React.useEffect(() => {
    navigation.setOptions({
      title: `${dia} ${valid.grades[grade].text} ${valid.shapes[shape].text}`,
    })
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.center}>
        <Text style={styles.text}> The Color of the steel is </Text>
        <Text style={[styles.text, { color: 'orange' }]}>orange </Text>
      </View>
      <List.Accordion
        title="Full Length Details"
        left={(props) => <List.Icon {...props} icon="format-line-weight" />}
      >
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Dessert</DataTable.Title>
            <DataTable.Title numeric>Calories</DataTable.Title>
            <DataTable.Title numeric>Fat</DataTable.Title>
          </DataTable.Header>

          <DataTable.Row>
            <DataTable.Cell>Frozen yogurt</DataTable.Cell>
            <DataTable.Cell numeric>159</DataTable.Cell>
            <DataTable.Cell numeric>6.0</DataTable.Cell>
          </DataTable.Row>

          <DataTable.Row>
            <DataTable.Cell>Ice cream sandwich</DataTable.Cell>
            <DataTable.Cell numeric>237</DataTable.Cell>
            <DataTable.Cell numeric>8.0</DataTable.Cell>
          </DataTable.Row>

          <DataTable.Pagination
            page={1}
            numberOfPages={3}
            onPageChange={(page) => {
              console.log(page)
            }}
            label="1-2 of 6"
          />
        </DataTable>
      </List.Accordion>

      <List.Accordion
        title="Cut Piece Details"
        left={(props) => <List.Icon {...props} icon="format-line-style" />}>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Dessert</DataTable.Title>
            <DataTable.Title numeric>Calories</DataTable.Title>
            <DataTable.Title numeric>Fat</DataTable.Title>
          </DataTable.Header>

          <DataTable.Row>
            <DataTable.Cell>Frozen yogurt</DataTable.Cell>
            <DataTable.Cell numeric>159</DataTable.Cell>
            <DataTable.Cell numeric>6.0</DataTable.Cell>
          </DataTable.Row>

          <DataTable.Row>
            <DataTable.Cell>Ice cream sandwich</DataTable.Cell>
            <DataTable.Cell numeric>237</DataTable.Cell>
            <DataTable.Cell numeric>8.0</DataTable.Cell>
          </DataTable.Row>

          <DataTable.Pagination
            page={1}
            numberOfPages={3}
            onPageChange={(page) => {
              console.log(page)
            }}
            label="1-2 of 6"
          />
        </DataTable>
      </List.Accordion>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    flexDirection: 'column',
    // alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'left',
    lineHeight: 40,
  },
})

export default TestScreen
