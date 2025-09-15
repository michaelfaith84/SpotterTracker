import { useContext } from "react";
import ModelContext from "../../context/ModelContext";
import { Button } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { CommonActions, useNavigation } from "@react-navigation/native";
//TODO: Make this look less gross
const Browse = () => {
  const modelContext = useContext(ModelContext);
  const { styles } = modelContext;
  const navigation = useNavigation();
  const gotoBrowseData = () => {
    navigation.dispatch(
      CommonActions.navigate({
        name: "BrowseData",
      })
    );
  };
  return (
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
          name={"database-marker"}
          style={[{ color: styles.default.color }]}
          size={120}
        />
      )}
      animated={true}
      onPress={gotoBrowseData}
    />
  );
};

export default Browse;
