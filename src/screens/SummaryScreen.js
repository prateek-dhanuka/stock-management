import {
  Avatar,
  Button,
  Card,
  Dialog,
  IconButton,
  Paragraph,
  Portal,
  Surface,
  Text,
  Title,
} from 'react-native-paper'
import { StyleSheet, View } from 'react-native'

import Background from '../components/Background'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import ItemMenu from '../components/ItemMenu'
import NumericInput from '../components/NumericInput'
import React from 'react'
import ValidContext from '../core/ValidContext'
import { getSummary } from '../core/database'
import { getSummaryHeader } from '../core/utils'
import { theme } from '../core/theme'

const SummaryScreen = ({ route, navigation }) => {
  // Summary filter dialog state
  const [dialogVisible, setDialogVisible] = React.useState(false)
  const showDialog = () => setDialogVisible(true)
  const hideDialog = () => setDialogVisible(false)

  // Selected Grade and Shape
  const [grade, SelectGrade] = React.useState(null)
  const [shape, SelectShape] = React.useState(null)
  const [dia, SelectDia] = React.useState(null)
  const [loc, SelectLoc] = React.useState(null)
  const [origin, SelectOrigin] = React.useState(null)

  // Summary
  const [summary, setSummary] = React.useState({})

  React.useEffect(() => {
    async function summaryFunc() {
      const summaryData = await getSummary({ grade, shape, dia, loc, origin })
      setSummary(summaryData)
    }
    summaryFunc()
  }, [grade, shape, dia, loc, origin])

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
      headerLeft: () => {},
    })
  }, [valid, route.params])

  // Navigate to item screens
  const detailItem = () => {
    navigation.navigate('Filter', { type: 'detail' })
  }

  const addItem = () => {
    // navigation.navigate('Filter', { type: 'add' })
    navigation.navigate('Filter', { type: 'add' })
  }

  const removeItem = () => {
    navigation.navigate('Filter', { type: 'remove' })
  }

  //Filter Functions
  const filter = () => {
    hideDialog()
    navigation.setParams({
      grade: grade,
      shape: shape,
      dia: dia,
      loc: loc,
      origin: origin,
    })
  }

  const clearFilters = () => {
    SelectGrade(null)
    SelectDia(null)
    SelectShape(null)
    SelectLoc(null)
    SelectOrigin(null)
    hideDialog()
    navigation.setParams({
      grade: null,
      shape: null,
      dia: null,
      loc: null,
      origin: null,
    })
  }

  return (
    <Background>
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={hideDialog}>
          <Dialog.Title>Filter Summary</Dialog.Title>
          <Dialog.Content>
            <View>
              <ItemMenu item="grade" selected={grade} Select={SelectGrade} />
              <ItemMenu item="shape" selected={shape} Select={SelectShape} />
              <NumericInput
                label={'Diameter'}
                selected={dia}
                Select={SelectDia}
              />
              <ItemMenu item="loc" selected={loc} Select={SelectLoc} />
              <ItemMenu item="origin" selected={origin} Select={SelectOrigin} />
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
          <Card style={styles.card}>
            <Card.Title
              title={
                summary.cost === undefined
                  ? 0
                  : summary.cost.toLocaleString('en-IN', {
                      style: 'currency',
                      currency: 'INR',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                      // maximumFractionDigits: 1,
                    })
              }
            />
            <Card.Content>
              <Text>Estimated Cost</Text>
            </Card.Content>
          </Card>
          <View style={styles.horizontal}>
            <View style={styles.vertical}>
              <Card style={styles.card}>
                <Card.Title
                  title={`${
                    summary.weight === undefined
                      ? 0
                      : summary.weight.toLocaleString('en-IN')
                  } Kg`}
                />
                <Card.Content>
                  <Text>Estimated Weight</Text>
                </Card.Content>
              </Card>
            </View>
            <View style={styles.vertical}>
              <Card style={styles.card}>
                <Card.Title title={summary.count} />
                <Card.Content>
                  <Text>Count</Text>
                </Card.Content>
              </Card>
            </View>
          </View>
        </View>
        <View style={styles.centerContainer}>
          <View style={{ flex: 1 }} />
        </View>
        <View style={styles.bottomContainer}>
          <Button
            style={styles.button}
            mode="contained"
            color={theme.colors.detail}
            contentStyle={{ height: 50 }}
            onPress={detailItem}>
            Detail Item
          </Button>
          <View style={styles.horizontal}>
            <View style={styles.vertical}>
              <Button
                style={styles.button}
                mode="contained"
                color={theme.colors.add}
                contentStyle={{ height: 50 }}
                onPress={addItem}>
                Add Item
              </Button>
            </View>
            <View style={styles.vertical}>
              <Button
                style={styles.button}
                mode="contained"
                color={theme.colors.remove}
                contentStyle={{ height: 50 }}
                onPress={removeItem}>
                Remove Item
              </Button>
            </View>
          </View>
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
  surface: {
    padding: 8,
    height: 100,
    width: '100%',
    elevation: 4,
  },
  cardHeadText: {
    color: 'rgba(0,0,0,0.32)',
    fontSize: 16,
  },
  button: {
    margin: 4,
    alignSelf: 'stretch',
  },
  topContainer: {
    // flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  centerContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  bottomContainer: {
    // flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    // alignSelf: 'center',
  },
  horizontal: {
    // flex: 1,
    flexDirection: 'row',
    // justifyContent: 'space-evenly',
    alignItems: 'center',
    // alignSelf: 'center',
  },
  vertical: {
    flex: 1,
    flexDirection: 'column',
  },
  card: {
    margin: 4,
  },
})

export default SummaryScreen
