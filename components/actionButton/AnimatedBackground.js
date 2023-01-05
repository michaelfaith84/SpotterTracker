import { Animated, SafeAreaView } from "react-native";
import ModelContext from "../../context/ModelContext";
import { useContext, useRef } from "react";
import { Video } from "expo-av";

const AnimatedBackground = () => {
  const modelContext = useContext(ModelContext);
  const { styles } = modelContext;
  const bgAnim = useRef(new Animated.Value(0));
  return (
    <SafeAreaView style={styles.background}>
      <Animated.View
        style={[styles.backgroundViewWrapper, { opacity: bgAnim.current }]}
      >
        <Video
          isLooping
          isMuted
          positionMillis={500}
          source={require("../../assets/clouds.mp4")}
          onLoad={() => {
            Animated.timing(bgAnim.current, {
              toValue: 1,
              useNativeDriver: true,
            }).start();
          }}
          resizeMode="cover"
          shouldPlay
          style={{ flex: 1 }}
        />
      </Animated.View>
    </SafeAreaView>
  );
};

export default AnimatedBackground;
