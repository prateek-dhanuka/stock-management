import React, { useState, useEffect } from "react";
import { View, Text, Button, Alert } from "react-native";
import database from "@react-native-firebase/database";
import { DataTable } from "react-native-paper";
import Background from "../components/Background";

const ProfileScreen = ({ route, navigation }) => {
  const { name } = route.params;
  const [data, setData] = useState([]);
  const [selected, Select] = useState("");

  database()
    .ref("/types")
    .on("value", (snapshot) => {
      var tempData = [];
      snapshot.forEach((child) => {
        var val = child.val();
        tempData.push({
          key: child.key,
          shape: val.shape,
          grade: val.grade,
          dia: val.dia,
        });
      });
      setData(tempData);
    });

  return (
    <View>
      <Text>{selected}</Text>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>Type</DataTable.Title>
          <DataTable.Title>Shape</DataTable.Title>
          <DataTable.Title>Diameter</DataTable.Title>
          <DataTable.Title>Grade</DataTable.Title>
        </DataTable.Header>
        {data.map((item) => {
          return (
            <DataTable.Row
              key={item.key}
              onPress={() => Select(item.key)}
              style={
                item.key === selected
                  ? { backgroundColor: "#0f0" }
                  : { backgroundColor: "#fff" }
              }
            >
              <DataTable.Cell>{item.key}</DataTable.Cell>
              <DataTable.Cell>{item.shape}</DataTable.Cell>
              <DataTable.Cell>{item.dia}</DataTable.Cell>
              <DataTable.Cell>{item.grade}</DataTable.Cell>
            </DataTable.Row>
          );
        })}
      </DataTable>
    </View>
  );
};

export default ProfileScreen;
