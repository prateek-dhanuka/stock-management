import { IconButton, List } from 'react-native-paper'
import React, { useEffect, useState } from 'react'
import { Text, View } from 'react-native'

import database from '@react-native-firebase/database'

const TestScreen = ({ route, navigation }) => {
  // Valid states
  const [validGrades, setValidGrades] = useState(null)
  const [validShapes, setValidShapes] = useState(null)

  // Get the valid states once
  useEffect(() => {
    database()
      .ref(`/valid/grades`)
      .once('value')
      .then((snapshot) => {
        setValidGrades(snapshot.val())
      })

    database()
      .ref(`/valid/shapes`)
      .once('value')
      .then((snapshot) => {
        setValidShapes(snapshot.val())
      })
  }, [])

  // Set Header
  const header = (props) => (
    <View style={{ flexDirection: 'row' }}>
      <List.Icon icon={validShapes[route.params.shape].icon} />
      <Text>{route.params.dia} </Text>
      <List.Icon icon={validGrades[route.params.grade].icon} />
    </View>
  )

  return (
    <>
      {validGrades === null || validShapes === null ? (
        <View />
      ) : (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <IconButton
            size={25}
            icon={validShapes[route.params.shape].icon}
            style={{ marginHorizontal: -2 }}
          />
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 20,
              color: 'black',
              //   backgroundColor: 'blue',
            }}>
            {route.params.dia}
          </Text>
          <IconButton
            icon={validGrades[route.params.grade].icon}
            size={25}
            style={{ marginHorizontal: -2 }}
          />
        </View>
      )}
    </>
  )
}

export default TestScreen
