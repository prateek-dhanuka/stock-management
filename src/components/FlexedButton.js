import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import React from 'react'
import { Surface } from 'react-native-paper'
import ValidContext from '../core/ValidContext'

const FlexedButtons = () => {
  // Valid grades
  const valid = React.useContext(ValidContext)

  // Width to use to make square buttons
  const [width, setWidth] = React.useState(0)
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headText}>Select Grade</Text>
      <View style={styles.horizontalContainer}>
        {Object.keys(valid.grades).map((grade, index) => {
          return (
            <Surface
              style={[styles.buttonContainer, { height: width }]}
              onLayout={
                index === 0 // Only Get width from first button
                  ? (event) => {
                      setWidth(event.nativeEvent.layout.width) // Get width to make the button square
                    }
                  : () => {}
              }
              key={grade}>
              <Text style={styles.buttonText}>{valid.grades[grade].text}</Text>
            </Surface>
          )
        })}
      </View>
      <Text style={styles.headText}>Select Shape</Text>
      <View style={styles.horizontalContainer}>
        {Object.keys(valid.shapes).map((shape, index) => {
          return (
            <Surface
              style={[
                styles.constantContainer,
                { height: width, width: width },
              ]}
              key={shape}>
              <Text style={styles.buttonText}>{valid.shapes[shape].text}</Text>
            </Surface>
          )
        })}
      </View>
      <Text style={styles.headText}>Select Location</Text>
      <View style={styles.horizontalContainer}>
        {Object.keys(valid.locs).map((loc, index) => {
          return (
            <Surface
              style={[styles.buttonContainer, { height: width }]}
              key={loc}>
              <Text style={styles.buttonText}>{valid.locs[loc].text}</Text>
            </Surface>
          )
        })}
      </View>
      <Text style={styles.headText}>Select Origin</Text>
      {Object.keys(valid.origins).map((origin, index, array) => {
        if (index % 2 !== 0) {
          return null
        } else {
          return (
            <View style={styles.horizontalContainer} key={origin}>
              <Surface style={[styles.buttonContainer, { height: width }]}>
                <Text style={styles.buttonText}>
                  {valid.origins[array[index]].text}
                </Text>
              </Surface>
              <Surface style={[styles.buttonContainer, { height: width }]}>
                <Text style={styles.buttonText}>
                  {valid.origins[array[index + 1]].text}
                </Text>
              </Surface>
            </View>
          )
        }
      })}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    // alignItems: 'flex-start',
  },
  horizontalContainer: {
    flex: 1,
    flexDirection: 'row',
    // alignItems: 'center',
    // justifyContent: 'center',
    paddingHorizontal: 2,
  },
  buttonContainer: {
    flex: 1,
    margin: 3,
    borderRadius: 10,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'blue',
    elevation: 4,
  },
  constantContainer: {
    // flex: 1,
    margin: 3,
    borderRadius: 10,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'blue',
    elevation: 4,
  },
  listContainer: {
    flex: 1,
    margin: 3,
    borderRadius: 10,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  buttonText: {
    fontSize: 14,
    marginHorizontal: 3,
    marginVertical: 8,
    // color: 'white',
  },
  headText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginStart: 8,
    marginVertical: 10,
    color: 'red',
    textTransform: 'uppercase',
  },
})

export default React.memo(FlexedButtons)
