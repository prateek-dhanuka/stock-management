import { DataTable, List } from 'react-native-paper'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { getCounts, getGradeColor } from '../core/database'

import DataCell from '../components/DataCell'
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

  // Get counts for all locations and origins
  const [counts, setCounts] = React.useState({ full: {}, partial: {} })
  React.useLayoutEffect(() => {
    setCounts(getCounts(grade, shape, dia, valid))
  }, [])
  const full = counts.full
  const partial = counts.partial

  // Get colors for each location
  const [colors, setColors] = React.useState({})
  React.useLayoutEffect(() => {
    setColors(getGradeColor(grade, shape, valid))
  }, [])

  return (
    <ScrollView style={styles.container}>
      <List.Accordion
        title="Color Details"
        left={(props) => <List.Icon {...props} icon="palette" />}>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Origin</DataTable.Title>
            <DataTable.Title>Color</DataTable.Title>
          </DataTable.Header>

          {Object.keys(colors).map((origin) => (
            <DataTable.Row key={origin}>
              <DataCell color={colors[origin].color} important>
                {valid.origins[origin].text}
              </DataCell>
              <DataCell
                style={{ backgroundColor: colors[origin].color, margin: 10 }}>
                {/* {colors[origin].text} */}
              </DataCell>
            </DataTable.Row>
          ))}
        </DataTable>
      </List.Accordion>
      <List.Accordion
        title="Full Length Details"
        left={(props) => <List.Icon {...props} icon="format-line-weight" />}>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Origin</DataTable.Title>
            <DataTable.Title>Location</DataTable.Title>
            <DataTable.Title numeric>Count</DataTable.Title>
          </DataTable.Header>
          {Object.keys(full).map((origin) =>
            Object.keys(full[origin]).map((loc) => (
              <DataTable.Row key={`${origin}.${loc}`}>
                <DataCell color={colors[origin].color}>
                  {valid.origins[origin].text}
                </DataCell>
                <DataCell
                  color={colors[origin].color}
                  icon={valid.locs[loc].icon}>
                  {valid.locs[loc].text}
                </DataCell>
                <DataCell numeric important>
                  {full[origin][loc]}
                </DataCell>
              </DataTable.Row>
            ))
          )}
        </DataTable>
      </List.Accordion>

      <List.Accordion
        title="Cut Piece Details"
        left={(props) => <List.Icon {...props} icon="format-line-style" />}>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Origin</DataTable.Title>
            <DataTable.Title>Location</DataTable.Title>
            <DataTable.Title numeric>Length</DataTable.Title>
          </DataTable.Header>
          {Object.keys(partial).map((origin) =>
            Object.keys(partial[origin]).map((loc) => (
              <DataTable.Row key={`${origin}.${loc}`}>
                <DataCell color={colors[origin].color}>
                  {valid.origins[origin].text}
                </DataCell>
                <DataCell
                  color={colors[origin].color}
                  icon={valid.locs[loc].icon}>
                  {valid.locs[loc].text}
                </DataCell>
                <DataCell numeric important>
                  {`${partial[origin][loc].length}(x${partial[origin][loc].count})`}
                </DataCell>
              </DataTable.Row>
            ))
          )}
        </DataTable>
      </List.Accordion>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    flexDirection: 'column',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
})

export default TestScreen
