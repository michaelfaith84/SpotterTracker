import { SafeAreaView, ScrollView } from "react-native";
import { Appbar, MD2Colors as Colors } from "react-native-paper";
import DataRow from "./DataRow";
import { useContext, useEffect, useState } from "react";
import ModelContext from "../../context/ModelContext";
import {
  Directions,
  FlingGestureHandler,
  State,
} from "react-native-gesture-handler";
import { CommonActions, useNavigation } from "@react-navigation/native";
import Notification from "../notification";

const BrowseData = () => {
  const modelContext = useContext(ModelContext);
  const { records, loadRecords } = modelContext;
  const [filters, setFilters] = useState({
    includeTracks: true,
    includeSpots: true,
    // searchString: "",
  });

  const navigation = useNavigation();

  const gotoActionButton = () => {
    navigation.dispatch(
      CommonActions.navigate({
        name: "ActionButton",
      })
    );
  };

  useEffect(() => {
    loadRecords();
  }, []);

  return (
    <FlingGestureHandler
      direction={Directions.LEFT}
      onHandlerStateChange={({ nativeEvent }) => {
        if (nativeEvent.state === State.ACTIVE) {
          gotoActionButton();
        }
      }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <Appbar.Header
          style={{
            backgroundColor: Colors.lightBlueA700,
          }}
        >
          <Appbar.Content title="Records" />
          <Appbar.Action
            icon="map-marker"
            style={{ opacity: filters.includeSpots ? 1 : 0.2 }}
            onPress={() =>
              setFilters({ ...filters, includeSpots: !filters.includeSpots })
            }
          />
          <Appbar.Action
            icon="map-marker-path"
            style={{ opacity: filters.includeTracks ? 1 : 0.2 }}
            onPress={() =>
              setFilters({ ...filters, includeTracks: !filters.includeTracks })
            }
          />
          {/*<Appbar.Action icon="magnify" />*/}
        </Appbar.Header>
        <ScrollView>
          {records.length > 0
            ? records.map((record) => {
                if (filters.includeSpots && record.type === "spot") {
                  return <DataRow props={{ record }} key={record.id} />;
                } else if (filters.includeTracks && record.type === "track") {
                  return <DataRow props={{ record }} key={record.id} />;
                }
              })
            : ""}
        </ScrollView>
        <Notification />
      </SafeAreaView>
    </FlingGestureHandler>
  );
};

export default BrowseData;
