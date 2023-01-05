import { useContext, useEffect } from "react";
import { Button } from "react-native-paper";
import ModelContext from "../../context/ModelContext";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { TASK_FETCH_LOCATION } from "../../context/types";
import "react-native-get-random-values";
import { v4 } from "uuid";
import * as Location from "expo-location";

const Track = ({ props: { setBtnState, setStartTime, setID } }) => {
  const [foregroundStatus, requestforegroundPermission] =
    Location.useForegroundPermissions();
  const [backgroundStatus, requestBackgroundPermission] =
    Location.useBackgroundPermissions();
  const modelContext = useContext(ModelContext);
  const { styles, sendNotification, createRecord, createDefaultName } =
    modelContext;

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
      }).then(() => createRecord(id, createDefaultName(start), "track"));
    }
    // .catch((err) => {
    //   sendNotification({ type: "error", msg: err });
    // });
  };

  // const startTrack = async (name = null) => {
  //   setStartTime;
  //   // Get permission
  //   // // await Location.requestBackgroundPermissionsAsync()
  //   // //   .then(async (status) => {
  //   // //     if (status.granted !== true) {
  //   // //       new Error("Permission to access location was denied");
  //   // //     } else {
  //   // //       await Location.startLocationUpdatesAsync(TASK_FETCH_LOCATION, {
  //   // //         accuracy: LocationAccuracy.Highest,
  //   // //         // distanceInterval: state.preferences.track.interval,
  //   // //         // deferredUpdatesInterval: state.preferences.track.frequency,
  //   // //         // foregroundService is how you get the task to be updated as often as would be if the app was open
  //   // //         foregroundService: {
  //   // //           notificationTitle: "Using your location",
  //   // //           // notificationBody:
  //   // //           //   "Tracking you at an interval of " +
  //   // //           //   state.preferences.track.interval +
  //   // //           //   " meters or every " +
  //   // //           //   state.preferences.track.frequency +
  //   // //           //   " ms.",
  //   // //         },
  //   // //       });
  //   // //     }
  //   //   })
  //   //   .catch((err) => {
  //   //     dispatch({
  //   //       type: SET_NOTIFICATION,
  //   //       payload: { type: "error", msg: err },
  //   //     });
  //   //   });
  // };
  // useEffect(() => {
  //   setBtnState(mode);
  // }, []);
  return (
    <Button
      mode={"text"}
      style={[
        // styles.fadingContainer,
        styles.actionBtnCommon,
        {
          borderColor: styles.default.color,
          backgroundColor: styles.default.BGColor,
        },
      ]}
      icon={() => (
        <Icon
          name={"map-marker-path"}
          style={[{ color: styles.default.color }]}
          size={120}
        />
      )}
      onPress={startTracking}
      // onLongPress={
      //   modes[0] === "spot" || modes[0] === "track"
      //     ? showStartModal
      //     : () => {}
      // }
    />
  );
};

export default Track;
