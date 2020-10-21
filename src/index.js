import { AppState } from 'react-native'
import FilterScreen from './screens/FilterScreen'
import LoginScreen from './screens/LoginScreen'
import { NavigationContainer } from '@react-navigation/native'
import React from 'react'
import SummaryScreen from './screens/SummaryScreen'
import TestScreen from './screens/TestScreen'
import { createStackNavigator } from '@react-navigation/stack'

const Stack = createStackNavigator()

const Main = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Summary" component={SummaryScreen} />
        <Stack.Screen name="Filter" component={FilterScreen} />
        <Stack.Screen name="Test" component={TestScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Main
