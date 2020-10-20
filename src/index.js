import React, { useEffect } from 'react'

import { AppState } from 'react-native'
import FilterScreen from './screens/FilterScreen'
import LoginScreen from './screens/LoginScreen'
import { NavigationContainer } from '@react-navigation/native'
import SummaryHeader from './components/SummaryHeader'
import SummaryScreen from './screens/SummaryScreen'
import TestScreen from './screens/TestScreen'
import { createStackNavigator } from '@react-navigation/stack'
import database from '@react-native-firebase/database'

const Stack = createStackNavigator()

const Main = () => {
  // useEffect(() => {
  //   AppState.addEventListener('change', handleChange)

  //   return () => {
  //     AppState.removeEventListener('change', handleChange)
  //   }
  // }, [])

  // const handleChange = (newState) => {
  //   console.log(`State changing to ${newState}`)
  //   if (newState === 'active') {
  //     database().goOffline().then(console.log(`Went offline`))
  //   } else if (newState === 'background') {
  //     database().goOnline().then(console.log(`Went online`))
  //   }
  // }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen
          name="Summary"
          component={SummaryScreen}
          options={{ headerTitle: (props) => <SummaryHeader {...props} /> }}
        />
        <Stack.Screen name="Filter" component={FilterScreen} />
        <Stack.Screen name="Test" component={TestScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Main
