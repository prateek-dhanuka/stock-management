import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import HomeScreen from "./screens/HomeScreen";
import StockScreen from "./screens/StockScreen";
import LoginScreen from "./screens/LoginScreen";

const Stack = createStackNavigator();

const Main = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Stock" component={StockScreen} />
        <Stack.Screen name="Temp" component={LoginScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Main;
