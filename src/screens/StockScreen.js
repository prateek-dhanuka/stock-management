import React, { useState, useEffect } from "react";
import database from "@react-native-firebase/database";
import {
  DataTable,
  IconButton,
  Dialog,
  Portal,
  Paragraph,
  Button,
  Menu,
  Title,
} from "react-native-paper";
import { View, Text } from "react-native";
import { theme } from "../core/theme";
import TextInput from "../components/TextInput";
import { Picker } from "@react-native-community/picker";
import DialogInput from "../components/DialogInput";

const itemsPerPage = 10;

const StockScreen = ({ navigation }) => {
  // Data State
  const [data, setData] = useState([]);

  // Page State
  const [page, setPage] = useState(0);
  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, data.length);

  // Dialog State
  const [visible, setVisible] = useState(false);
  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  // Dialog Data State
  const [grade, setGrade] = useState("en-8");
  const [shape, setShape] = useState("square");
  const [dia, setDia] = useState(0);

  // Selected State
  const [selected, Select] = useState({ value: "", error: "" });

  // Get Database Data
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

  // Set Navbar
  navigation.setOptions({
    headerRight: () => (
      <View style={{ flexDirection: "row" }}>
        <IconButton icon="plus" size={20} onPress={showDialog} />
        <IconButton
          icon="minus"
          size={20}
          onPress={() => console.log("Pressed -")}
        />
      </View>
    ),
  });

  //Upload Data
  const onUploadType = async () => {
    var key = database().ref("/types").push().key;

    database()
      .ref("/types")
      .child(key)
      .set({
        grade: grade,
        dia: dia.value,
        shape: shape,
      })
      .catch((error) => {
        setDia({ ...dia, error: error });
      });

    database()
      .ref("/data")
      .child(key)
      .set({
        full: 0,
        part: [],
      })
      .catch((error) => {
        setDia({ ...dia, error: error });
      });

    setVisible(false);
  };

  return (
    <View>
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Add Item</Dialog.Title>
          <Dialog.Content>
            <View>
              <View style={{ flexDirection: "column" }}>
                <Text>Grade: </Text>
                <Picker
                  selectedValue={grade}
                  onValueChange={(itemValue, itemIndex) => setGrade(itemValue)}
                >
                  <Picker.Item label="EN-8" value="en-8" />
                  <Picker.Item label="EN-19" value="en-19" />
                  <Picker.Item label="MS" value="ms" />
                </Picker>
              </View>
              <View style={{ flexDirection: "column" }}>
                <Text>Shape: </Text>
                <Picker
                  selectedValue={shape}
                  onValueChange={(itemValue, itemIndex) => setShape(itemValue)}
                >
                  <Picker.Item label="Square" value="square" />
                  <Picker.Item label="Round" value="round" />
                </Picker>
                <DialogInput
                  label="Diameter"
                  value={dia.value}
                  onChangeText={(text) => setDia({ value: text, error: "" })}
                  error={!!dia.error}
                  errorText={dia.error}
                  autoCapitalize="none"
                  textContentType="none"
                  keyboardType="decimal-pad"
                />
              </View>
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={onUploadType}>Done</Button>
            <Button onPress={hideDialog}>Cancel</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <DataTable theme={theme}>
        <DataTable.Header theme={theme}>
          <DataTable.Title theme={theme}>Shape</DataTable.Title>
          <DataTable.Title theme={theme}>Diameter</DataTable.Title>
          <DataTable.Title theme={theme}>Grade</DataTable.Title>
        </DataTable.Header>
        {data.slice(from, to).map((item) => {
          return (
            <DataTable.Row
              key={item.key}
              onPress={() => Select(item.key)}
              style={
                selected === item.key
                  ? { backgroundColor: theme.colors.primary }
                  : {}
              }
            >
              <DataTable.Cell theme={theme}>{item.shape}</DataTable.Cell>
              <DataTable.Cell theme={theme}>{item.dia}</DataTable.Cell>
              <DataTable.Cell theme={theme}>{item.grade}</DataTable.Cell>
            </DataTable.Row>
          );
        })}
        <DataTable.Pagination
          page={page}
          numberOfPages={Math.ceil(data.length / itemsPerPage)}
          onPageChange={(page) => setPage(page)}
          label={`${from + 1}-${to} of ${data.length}`}
          theme={theme}
        />
      </DataTable>
    </View>
  );
};

export default StockScreen;
