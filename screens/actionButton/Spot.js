import { useContext, useEffect } from "react";
import ModelContext from "../../context/ModelContext";
import { Button } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Acquiring from "./Acquiring";
import * as Location from "expo-location";
import { v4 } from "uuid";
import { View } from "react-native";

const Spot = ({ props: { fetching, setFetching } }) => {
  const [foregroundStatus, requestforegroundPermission] =
    Location.useForegroundPermissions();
  const modelContext = useContext(ModelContext);
  const { styles, sendNotification, createDefaultName, createRecord } =
    modelContext;

  const getLocation = async (name = null) => {
    setFetching(true);
    let location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
    });

    const id = v4();
    const start = new Date();
    createRecord(id, createDefaultName(start), "spot", {
      ...location.coords,
      time: start,
    });
    setFetching(false);
    sendNotification({
      type: "success",
      msg: `Record ${createDefaultName(start)} has been created`,
    });
  };

  const cancel = () => {
    setFetching(false);
  };

  useEffect(() => {
    if (!foregroundStatus) {
      requestforegroundPermission();
    }
  }, []);

  return (
    <View>
      {!fetching ? (
        <Button
          mode={"text"}
          style={[
            styles.actionBtnCommon,
            {
              borderColor: styles.default.color,
              backgroundColor: styles.default.BGColor,
            },
          ]}
          icon={() => (
            <Icon
              name={"map-marker"}
              style={[{ color: styles.default.color }]}
              size={120}
            />
          )}
          onPress={getLocation}
        />
      ) : (
        <Acquiring props={{ cancel }} />
      )}
    </View>
  );
};

export default Spot;
