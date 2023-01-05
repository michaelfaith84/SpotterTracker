import ModelState from "./context/ModelState";
import {DefaultTheme, MD2Colors as Colors, Provider as PaperProvider,} from "react-native-paper";
import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
import ActionButton from "./components/actionButton";
import BrowseData from "./components/browseData";

const App = () => {
    const Stack = createStackNavigator();
    const theme = {
        ...DefaultTheme,
        roundness: 5,
        colors: {
            ...DefaultTheme.colors,
            primary: Colors.blue400,
            accent: Colors.blueA700,
        },
    };

    return (
        <ModelState>
            <PaperProvider theme={theme}>
                <NavigationContainer>
                    <Stack.Navigator
                        screenOptions={{headerShown: false, headerMode: "screen"}}
                    >
                        <Stack.Screen
                            name={"ActionButton"}
                            component={ActionButton}
                            // initialParams={{ key: 0, stack }}
                        />
                        <Stack.Screen
                            name={"BrowseData"}
                            component={BrowseData}
                            // initialParams={{ key: 0, stack }}
                        />
                    </Stack.Navigator>
                </NavigationContainer>
            </PaperProvider>
        </ModelState>
    );
};

export default App;
