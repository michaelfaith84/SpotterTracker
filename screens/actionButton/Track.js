import React, { useContext, useEffect } from "react";
import { Button } from "react-native-paper";
import ModelContext from "../../context/ModelContext";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { TASK_FETCH_LOCATION } from "../../context/types";
import "react-native-get-random-values";
import { v4 } from "uuid";
import * as Location from "expo-location";
import LongPressDialog from "../../components/longPressDialog";
import { View } from "react-native";

const Track = ({ props: { setBtnState, setStartTime, setID } }) => {
  const [foregroundStatus, requestforegroundPermission] =
    Location.useForegroundPermissions();
  const [backgroundStatus, requestBackgroundPermission] =
    Location.useBackgroundPermissions();
  const modelContext = useContext(ModelContext);
  const [visible, setVisible] = React.useState(false);
  const { styles, sendNotification, createRecord, createDefaultName } =
    modelContext;

  const TrackIcon = () => (
    <Icon
      name={"map-marker-path"}
      style={[{ color: styles.default.color }]}
      size={120}
    />
  );

  const showDialog = () => {
    setVisible(true);
  };

  const hideDialog = () => {
    setVisible(false);
  };

  useEffect(() => {
    if (!foregroundStatus) {
      requestforegroundPermission();
    }
    if (!backgroundStatus) {
      requestBackgroundPermission();
    }
  }, []);

  const startTracking = async (name = null) => {
    if (backgroundStatus.granted !== true) {
      sendNotification({
        type: "error",
        msg: "Permission to access location was denied",
      });
    } else {
      const id = v4();
      setID(id);
      const start = new Date();
      setStartTime(start);
      const name = name ? name : createDefaultName(start);
      setBtnState("tracking");
      await Location.startLocationUpdatesAsync(TASK_FETCH_LOCATION, {
        accuracy: Location.Accuracy.Highest,
        showsBackgroundLocationIndicator: true,
        distanceInterval: 1,
        deferredUpdatesInterval: 5000,
        // foregroundService is how you get the task to be updated as often as would be if the app was open
        foregroundService: {
          notificationTitle: "Using your location",
          // notificationBody:
          //   "Tracking you at an interval of " +
          //   state.preferences.track.interval +
          //   " meters or every " +
          //   state.preferences.track.frequency +
          //   " ms.",
        },
      }).then(() => createRecord(id, name, "track"));
    }
  };

  return (
    <View>
      <Button
        mode={"text"}
        style={[
          styles.actionBtnCommon,
          {
            borderColor: styles.default.color,
            backgroundColor: styles.default.BGColor,
          },
        ]}
        icon={() => <TrackIcon />}
        onPress={startTracking}
        onLongPress={showDialog}
      />

      <LongPressDialog
        setVisible={setVisible}
        visible={visible}
        icon={"map-marker-path"}
        startFunc={startTracking}
      />
    </View>
  );
};

export default Track;
