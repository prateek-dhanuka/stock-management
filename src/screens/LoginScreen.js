import * as React from "react";
import { Text } from "react-native";

const LoginScreen = ({ route, navigation }) => {
  const { name } = route.params;
  return (
    <Text>Hey, {JSON.stringify(name).replace(/\"/g, "")}'s temp screen</Text>
  );
};

export default LoginScreen;
