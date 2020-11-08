import {
  ActivityIndicator,
  DataTable,
  Dialog,
  IconButton,
  List,
  Menu,
  Portal,
} from 'react-native-paper'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { getDetails, getGradeColor } from '../core/database'

import DataCell from '../components/DataCell'
import { FlatGrid } from 'react-native-super-grid'
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

  // Color dialog state
  const [dialogVisible, setDialogVisible] = React.useState(false)
  const showDialog = () => setDialogVisible(true)
  const hideDialog = () => setDialogVisible(false)

  // Set Navbar
  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: `${dia} ${valid.grades[grade].text} ${valid.shapes[shape].text}`,
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          <IconButton icon="palette" size={20} onPress={showDialog} />
        </View>
      ),
    })
  }, [])

  // Get counts for all locations and origins
  const [details, setDetails] = React.useState({
    full: [],
    partial: [],
    color: [],
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
  // console.log(
  //   `Colors are `,
  //   colors,
  //   ' => ',
  //   colors.map((color) => valid.colors[color.color])
  // )

  return (
    <>
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={hideDialog}>
          <Dialog.Title>Color Summary</Dialog.Title>
          <Dialog.Content>
            <FlatGrid
              data={colors}
              itemDimension={100}
              renderItem={({ item }) => {
                const origin = valid.origins[item.origin].text
                const bgColor = valid.colors[item.color].bgColor
                const color = valid.colors[item.color].color
                const icon = valid.colors[item.color].icon

                return (
                  <Menu.Item
                    icon={(props) => {
                      return (
                        <>
                          <View
                            style={[
                              styles.fillView,
                              bgColor && { backgroundColor: bgColor },
                            ]}
                          />
                          <Icon size={props.size} color={color} name={icon} />
                        </>
                      )
                    }}
                    iconcolor={color}
                    title={origin}
                  />
                )
              }}
            />
          </Dialog.Content>
        </Dialog>
      </Portal>
      <ScrollView style={styles.container}>
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
  fillView: {
    position: 'absolute',
    top: 5,
    left: 5,
    width: 14,
    height: 14,
  },
})

export default DetailScreen
