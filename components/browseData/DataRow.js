import React, { useContext, useState } from "react";
import {
  Card,
  MD2Colors as Colors,
  SegmentedButtons,
  TextInput,
  Title,
} from "react-native-paper";
import { Text, View } from "react-native";
import ModelContext from "../../context/ModelContext";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { StorageAccessFramework } from "expo-file-system";
import * as Clipboard from "expo-clipboard";

const DataRow = ({ props: { record } }) => {
  const modelContext = useContext(ModelContext);
  const {
    sendNotification,
    removeRecord,
    updateRecord,
    getLength,
    exportGeoJSON,
  } = modelContext;
  const [editName, setEditName] = useState(false);
  const [editedName, setEditedName] = useState(record.name);
  const toggleEditMode = (id) => {
    if (record.id === id) {
      setEditName(!editName);
      // Update name
      if (editName) {
        updateRecord(record.id, { ...record, name: editedName });
      }
    }
  };
  /**
   * Handles the actions belonging to the segmented button
   * @param e {string}: action:recordId
   */
  const pressHandler = async (e) => {
    const values = e.split(":");
    const action = values[0];
    const id = values[1];
    switch (action) {
      case "geojson":
        const permissions =
          await StorageAccessFramework.requestDirectoryPermissionsAsync();
        if (permissions.granted === true) {
          exportGeoJSON(permissions.directoryUri, record);
        }
        break;
      case "delete":
        removeRecord(id);
        break;
      default:
        sendNotification({ type: error, msg: "Unknown action" });
    }
  };

  const copyCoordsToClipboard = async () => {
    await Clipboard.setStringAsync(
      `${record.gps[0].longitude}, ${record.gps[0].latitude}`
    );
    sendNotification({ type: "info", msg: "Copied to clipboard" });
  };

  return (
    <Card mode={"outlined"} style={{ paddingBottom: 20 }}>
      {/*<Card.Title title={spot.name} />*/}
      <Card.Content>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingBottom: 5,
          }}
        >
          <Icon
            name={record.type === "track" ? "map-marker-path" : "map-marker"}
            size={24}
          />
          {!editName ? (
            <Title>{record.name}</Title>
          ) : (
            <TextInput
              autoFocus={true}
              style={{ flex: 1, marginHorizontal: 25 }}
              mode={"outlined"}
              value={editedName}
              onBlur={() => toggleEditMode(record.id)}
              onChangeText={(text) => setEditedName(text)}
            />
          )}
          <Icon
            id={record.id}
            key={record.id}
            name={"pencil"}
            size={24}
            onPress={() => toggleEditMode(record.id)}
          />
        </View>
        {record.type === "track" ? (
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-evenly",
              alignItems: "center",
              paddingBottom: 5,
            }}
          >
            <Text>Points: {record.gps.length}</Text>
            {record.gps.length > 1 ? (
              <Text>Length: {getLength(record)}</Text>
            ) : (
              ""
            )}
          </View>
        ) : (
          ""
        )}
        {record.type === "spot" ? (
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-evenly",
              alignItems: "center",
              paddingBottom: 5,
            }}
          >
            <Text>Lat: {record.gps[0].latitude}</Text>
            <Text>Lon: {record.gps[0].longitude}</Text>
            <Icon
              name={"clipboard-check-outline"}
              size={24}
              onPress={copyCoordsToClipboard}
            />
          </View>
        ) : (
          ""
        )}
      </Card.Content>
      <Card.Actions style={{ justifyContent: "space-between" }}>
        <SegmentedButtons
          value={null}
          onValueChange={pressHandler}
          buttons={[
            { value: `geojson:${record.id}`, label: "geojson" },
            {
              value: `delete:${record.id}`,
              label: <Icon name={"delete"} size={18} color={Colors.red700} />,
            },
          ]}
        />
      </Card.Actions>
    </Card>
  );
};

export default DataRow;
