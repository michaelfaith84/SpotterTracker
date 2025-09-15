import { SafeAreaView } from "react-native";
import {
  Directions,
  FlingGestureHandler,
  State,
} from "react-native-gesture-handler";
import { useContext, useEffect, useState } from "react";
import ModelContext from "../../context/ModelContext";
import AnimatedBackground from "./AnimatedBackground";
import { Surface } from "react-native-paper";
import Track from "./Track";
import Spot from "./Spot";
import Browse from "./Browse";
import Acquiring from "./Acquiring";
import Tracking from "./Tracking";
import Notification from "../../components/notification";
import * as Location from "expo-location";
import { TASK_FETCH_LOCATION } from "../../context/types";
import * as TaskManager from "expo-task-manager";
import * as ImagePicker from "expo-image-picker";

export async function takePhoto() {
  const permission = await ImagePicker.requestCameraPermissionsAsync();
  if (!permission.granted) {
    console.error("Permission denied");
    return;
  }

  const result = await ImagePicker.launchCameraAsync();

  if (!result.canceled) {
    return result.assets[0].uri;
  }
  return null;
}

const ActionButton = () => {
  const modelContext = useContext(ModelContext);
  const { styles, sendNotification, appendRecord, loadSettings } = modelContext;
  const [fetching, setFetching] = useState(false);
  const [visible, setVisible] = useState(false);

  const handleAcquiringSpotCancel = () => {
    setFetching(false);
  };

  const stopTracking = () => {
    Location.hasStartedLocationUpdatesAsync(TASK_FETCH_LOCATION).then(
      (status) => {
        if (status === true) {
          // Stop tracking
          Location.stopLocationUpdatesAsync(TASK_FETCH_LOCATION);
        }
      }
    );
    setFetching(false);
    setStartTime(null);
    setID(null);
    setBtnState("idle");
  };

  /**
   * These are only used for tracking. Both are initially set in
   *  the Track component and switched back to null in the Tracking
   *  component.
   *
   * id {string:uuid}
   * startTime {object}
   */
  const [id, setID] = useState(null);
  const [startTime, setStartTime] = useState(null);

  /**
   * Two states of the action button. Necessary because Track
   *  triggers Tracking for the sake of modularity.
   *
   *  idle: awaiting action -> displays the mode component
   *  tracking: used to display the Tracking component
   */
  const [btnState, setBtnState] = useState("idle");

  /**
   * Three buttons
   *  spot: saves the current location
   *  track: polls the location until stopped
   *  browse: switches to the data browser
   */
  const [mode, setMode] = useState([
    <Spot
      props={{
        setBtnState,
        fetching,
        setFetching,
        setVisible,
      }}
    />,
    <Track
      props={{
        setBtnState,
        startTime,
        setStartTime,
        setID,
        stopTracking,
        fetching,
        setFetching,
      }}
    />,
    <Browse />,
  ]);

  /**
   * Switches between the modes
   */
  const modeHandler = (direction) => {
    if (direction === "next") {
      mode.push(mode.shift());
    } else if (direction === "previous") {
      mode.unshift(mode.pop());
    }
    setMode([...mode]);
  };

  TaskManager.defineTask(
    TASK_FETCH_LOCATION,
    async ({ data: { locations }, error }) => {
      setFetching(true);
      if (error) {
        sendNotification({ type: "error", msg: error.message });
        return;
      }
      // Update
      appendRecord(id, "gps", { ...locations[0].coords, time: new Date() });
      await new Promise((r) => setTimeout(r, 250)).then(() =>
        setFetching(false)
      );
    }
  );

  useEffect(() => {
    loadSettings();
  }, []);

  // TODO: Migrate to Gesture.Fling
  return (
    <FlingGestureHandler
      direction={Directions.UP}
      onHandlerStateChange={({ nativeEvent }) => {
        if (nativeEvent.state === State.ACTIVE) {
          modeHandler("next");
        }
      }}
    >
      <FlingGestureHandler
        direction={Directions.DOWN}
        onHandlerStateChange={({ nativeEvent }) => {
          if (nativeEvent.state === State.ACTIVE) {
            modeHandler("previous");
          }
        }}
      >
        <SafeAreaView style={styles.container}>
          <AnimatedBackground />
          <SafeAreaView style={[styles.overlay, styles.actionButtonContainer]}>
            <Surface style={styles.fabSurface}>
              {fetching ? <Acquiring cancel={handleAcquiringSpotCancel} /> : ""}
              {btnState === "idle" && !fetching ? mode[0] : ""}
              {btnState === "tracking" && !fetching && id && startTime ? (
                <Tracking
                  props={{
                    setBtnState,
                    id,
                    setID,
                    startTime,
                    setStartTime,
                    stopTracking,
                  }}
                />
              ) : (
                ""
              )}
            </Surface>
          </SafeAreaView>
          <Notification />
          {/*<LongPressModal visible={visible} setVisible={setVisible} />*/}
        </SafeAreaView>
      </FlingGestureHandler>
    </FlingGestureHandler>
  );
};

export default ActionButton;
