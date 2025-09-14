import { useContext, useEffect, useState } from "react";
import ModelContext from "../../context/ModelContext";
import { Button } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Acquiring from "./Acquiring";
// TODO: Add picture button
const Tracking = ({
  props: { startTime, stopTracking, setFetching, fetching },
}) => {
  const modelContext = useContext(ModelContext);
  const { styles } = modelContext;

  const cancel = () => {
    setFetching(false);
    stopTracking();
  };

  /**
   * Used to pass a datetime object set when the tracking started
   * to the Tracking component
   */
  const [elapsedTime, setElapsedTime] = useState("");

  /**
   * Formats and updates the elapsed time
   */
  useEffect(() => {
    let interval = null;
    if (startTime instanceof Date) {
      interval = setInterval(() => {
        let t = (new Date().getTime() - startTime.getTime()) / 1000;
        if (t.toFixed(1) >= 359999) {
          stopTracking();
        } else if (t.toFixed(1) > 3599.9) {
          t =
            Math.floor(t / 60 / 60).toString() +
            ":" +
            Math.floor((t / 60 / 60 - Math.floor(t / 60 / 60)) * 60)
              .toString()
              .padStart(2, "0") +
            ":" +
            Math.floor(
              ((t / 60 / 60 - Math.floor(t / 60 / 60)) * 60 -
                Math.floor((t / 60 / 60 - Math.floor(t / 60 / 60)) * 60)) *
                60
            )
              .toString()
              .padStart(2, "0");
        } else if (t.toFixed(1) > 59.9) {
          t =
            Math.floor(t / 60).toString() +
            ":" +
            Math.floor((t / 60 - Math.floor(t / 60)) * 60)
              .toString()
              .padStart(2, "0");
        }
        // Maybe use later?
        else {
          t = t.toFixed(1);
        }
        setElapsedTime(t);
      }, 50);
    }
    return () => clearInterval(interval);
  }, [startTime, elapsedTime]);

  return !fetching ? (
    <Button
      mode={"text"}
      style={[
        styles.actionBtnCommon,
        {
          borderColor: styles.tracking.color,
          backgroundColor: styles.tracking.BGColor,
          justifyContent: "center",
        },
      ]}
      icon={() => (
        <Icon
          size={
            !elapsedTime || elapsedTime.length <= 4
              ? 48
              : elapsedTime.length <= 6
              ? 42
              : 36
          }
          style={{ color: styles.tracking.color }}
        >
          {elapsedTime}
        </Icon>
      )}
      onPress={stopTracking}
    />
  ) : (
    <Acquiring props={{ cancel }} />
  );
};

export default Tracking;
