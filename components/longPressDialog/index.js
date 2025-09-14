import {
  Portal,
  Modal,
  Text,
  TextInput,
  Button,
  Dialog,
  useTheme,
  IconButton,
  Tooltip,
} from "react-native-paper";
import { useState } from "react";
import { View } from "react-native";
import { takePhoto } from "../../screens/actionButton";

/**
 * TODO: support name, description, photo
 */
const LongPressDialog = ({ visible, setVisible, icon, startFunc }) => {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const hideDialog = () => setVisible(false);
  const theme = useTheme();
  const handleStart = () => {
    startFunc(name);
    hideDialog();
  };

  /**
   * iOS doesn't geotag... Also, the user may not have geotagging enabled on Android.
   * This checks the EXIF data and adds it if necessary.
   *
   * @param imagePath
   */
  const handleGeotagging = (imagePath) => {};

  /**
   * Gets a spot and then lets the user launch the camera app. If
   */
  const handleStartWithPic = async () => {
    handleStart(name);
    const image = await takePhoto();
    handleGeotagging(image);
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={hideDialog}>
        <Dialog.Icon icon={icon} />
        <Dialog.Title>Add Details</Dialog.Title>
        <Dialog.Content>
          <TextInput
            label={"Name"}
            value={name}
            onChangeText={setName}
            mode={"outlined"}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={hideDialog} textColor="#FF0000">
            Cancel
          </Button>
          <Button onPress={handleStart}>Start</Button>
          <Tooltip title={"Start with geotagged picture"}>
            <IconButton
              icon={"camera"}
              iconColor={theme.colors.primary}
              onPress={handleStartWithPic}
            />
          </Tooltip>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default LongPressDialog;
