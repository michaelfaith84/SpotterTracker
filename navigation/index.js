import ActionButton from "../screens/actionButton";
import BrowseData from "../screens/browseData";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const Navigation = () => {
  const Stack = createStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false, headerMode: "screen" }}
      >
        <Stack.Screen name={"ActionButton"} component={ActionButton} />
        <Stack.Screen name={"BrowseData"} component={BrowseData} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
