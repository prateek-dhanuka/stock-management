import React, { useEffect } from 'react'
import { AppState } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import database from '@react-native-firebase/database'

import LoginScreen from './screens/LoginScreen'
import StockScreen from './screens/StockScreen'

const Stack = createStackNavigator()

const Main = () => {
  useEffect(() => {
    AppState.addEventListener('change', handleChange)

    return () => {
      AppState.removeEventListener('change', handleChange)
    }
  }, [])

  const handleChange = (newState) => {
    console.log(`State changing to ${newState}`)
    if (newState === 'active') {
      database().goOffline().then(console.log(`Went offline`))
    } else if (newState === 'background') {
      database().goOnline().then(console.log(`Went online`))
    }
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Stock" component={StockScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Main
