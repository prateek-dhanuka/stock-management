import { ActivityIndicator, DataTable, List } from 'react-native-paper'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { getDetails, getGradeColor } from '../core/database'

import DataCell from '../components/DataCell'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import React from 'react'
import ValidContext from '../core/ValidContext'

const DetailScreen = ({ route, navigation }) => {
  // Received params
  const { grade, shape, dia } = route.params

  // Valid states
  const valid = React.useContext(ValidContext)

  // show loading screen
  const [loading, setLoading] = React.useState(true)

  // Set header text
  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: `${dia} ${valid.grades[grade].text} ${valid.shapes[shape].text}`,
    })
  }, [])

  // Get counts for all locations and origins
  const [details, setDetails] = React.useState({
    full: [],
    partial: [],
    color: {},
  })
  React.useLayoutEffect(() => {
    async function getDetailsAsync() {
      const details = await getDetails(grade, shape, dia, valid)
      // console.log(`Got Details: `, details)
      setDetails(details)
      setLoading(false)
    }
    getDetailsAsync()
  }, [])
  const full = details.full
  const partial = details.partial
  const colors = details.color
  // console.log(`Where Full is: (${full.length}) `, full)
  // console.log(`Where Partial is: (${partial.length}) `, partial)
  // console.log(`Where Color is: `, colors)

  return (
    <>
      <ScrollView style={styles.container}>
        <List.Accordion
          title="Color Details"
          left={(props) => <List.Icon {...props} icon="palette" />}>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Origin</DataTable.Title>
              <DataTable.Title>Color</DataTable.Title>
            </DataTable.Header>

            {Object.keys(colors).map((origin) =>
              colors[origin].map((color) => (
                <DataTable.Row key={`${origin}.${color}`}>
                  <DataCell
                    color={valid.colors[color].color}
                    style={{
                      backgroundColor: valid.colors[color].bgColor,
                      margin: 10,
                    }}
                    important>
                    {valid.origins[origin].text}
                  </DataCell>
                  <View
                    style={{
                      backgroundColor: valid.colors[color].bgColor,
                      margin: 5,
                      flex: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <DataCell
                      style={{
                        backgroundColor: valid.colors[color].color,
                        margin: 5,
                      }}
                    />
                  </View>
                </DataTable.Row>
              ))
            )}
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
            {full.map((item, index) => (
              <DataTable.Row key={index}>
                <DataCell important>{valid.origins[item.origin].text}</DataCell>
                <DataCell icon={valid.locs[item.loc].icon}>
                  {valid.locs[item.loc].text}
                </DataCell>
                <DataCell numeric important>
                  {item.count}
                </DataCell>
              </DataTable.Row>
            ))}
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
            {partial.map((item, index) => (
              <DataTable.Row key={index}>
                <DataCell>{valid.origins[item.origin].text}</DataCell>
                <DataCell icon={valid.locs[item.loc].icon}>
                  {valid.locs[item.loc].text}
                </DataCell>
                <DataCell numeric important>
                  {`${item.length}(x${item.count})`}
                </DataCell>
              </DataTable.Row>
            ))}
          </DataTable>
        </List.Accordion>
      </ScrollView>
      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" />
        </View>
      ) : null}
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    flexDirection: 'column',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
})

export default DetailScreen
