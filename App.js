import ModelState from "./context/ModelState";
import {
  DefaultTheme,
  MD2Colors as Colors,
  Provider as PaperProvider,
} from "react-native-paper";

import Navigation from "./navigation";

const App = () => {
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
        <Navigation />
      </PaperProvider>
    </ModelState>
  );
};

export default App;
