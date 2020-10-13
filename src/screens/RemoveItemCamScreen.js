import React from 'react'
import { View } from 'react-native'

const RemoveItemCamScreen = ({ route, navigation }) => {
  //Set the NavBar
  navigation.setOptions({
    headerStyle: {
      backgroundColor: 'red',
    },
    headerTintColor: 'lightyellow',
  })

  return <View />
}

export default RemoveItemCamScreen
