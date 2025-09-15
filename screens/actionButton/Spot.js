import React, { useContext, useEffect } from "react";
import ModelContext from "../../context/ModelContext";
import { Button } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Acquiring from "./Acquiring";
import * as Location from "expo-location";
import { v4 } from "uuid";
import { View } from "react-native";
import LongPressDialog from "../../components/longPressDialog";

const Spot = ({ props: { fetching, setFetching } }) => {
  const [foregroundStatus, requestforegroundPermission] =
    Location.useForegroundPermissions();
  const modelContext = useContext(ModelContext);
  const { styles, sendNotification, createDefaultName, createRecord } =
    modelContext;
  const [visible, setVisible] = React.useState(false);

  const SpotIcon = () => (
    <Icon
      name={"map-marker"}
      style={[{ color: styles.default.color }]}
      size={120}
    />
  );

  const showModal = () => {
    setVisible(true);
  };
  const hideModal = () => {
    setVisible(false);
  };

  const getLocation = async (name = null, properties = {}) => {
    // Handle empty strings
    if ((name && name.length === 0) || typeof name !== "string") {
      name = null;
    }

    setFetching(true);
    let location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
    });

    const id = v4();
    const start = new Date();

    // Make sure we've got a name
    if (!name) {
      name = createDefaultName(start);
    }

    createRecord(id, name, "spot", {
      ...location,
      props: properties,
      time: start,
    });
    setFetching(false);
    sendNotification({
      type: "success",
      msg: `Record ${name} has been created`,
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
          icon={SpotIcon}
          onLongPress={showModal}
          onPress={getLocation}
        />
      ) : (
        <Acquiring cancel={cancel} />
      )}
      <LongPressDialog
        setVisible={setVisible}
        visible={visible}
        icon={"map-marker"}
        startFunc={getLocation}
      />
    </View>
  );
};

export default Spot;
