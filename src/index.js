import { AppState } from 'react-native'
import DetailScreen from './screens/DetailScreen'
import FilterScreen from './screens/FilterScreen'
import LoginScreen from './screens/LoginScreen'
import { NavigationContainer } from '@react-navigation/native'
import React from 'react'
import SummaryScreen from './screens/SummaryScreen'
import analytics from '@react-native-firebase/analytics'
import { createStackNavigator } from '@react-navigation/stack'

const Stack = createStackNavigator()

const Main = () => {
  const routeNameRef = React.useRef()
  const navigationRef = React.useRef()

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() =>
        (routeNameRef.current = navigationRef.current.getCurrentRoute().name)
      }
      onStateChange={async (state) => {
        const previousRouteName = routeNameRef.current
        const currentRouteName = navigationRef.current.getCurrentRoute().name

        if (previousRouteName !== currentRouteName) {
          await analytics().logScreenView({
            screen_name: currentRouteName,
            screen_class: currentRouteName,
          })
          // .then(
          //   console.log(
          //     `Logged moving from ${previousRouteName} to ${currentRouteName}`
          //   )
          // )
        }

        routeNameRef.current = currentRouteName
      }}>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Summary" component={SummaryScreen} />
        <Stack.Screen name="Filter" component={FilterScreen} />
        <Stack.Screen name="Detail" component={DetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Main
