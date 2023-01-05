import { useContext, useEffect, useRef } from "react";
import ModelContext from "../../context/ModelContext";
import { Button } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Animated } from "react-native";

const Acquiring = () => {
  const modelContext = useContext(ModelContext);
  const { styles } = modelContext;

  const pulseAnim = useRef(new Animated.Value(1));
  const pulse = useRef(
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim.current, {
          useNativeDriver: true,
          toValue: 0.1,
          duration: 333,
        }),
        Animated.timing(pulseAnim.current, {
          useNativeDriver: true,
          toValue: 1,
          duration: 333,
        }),
      ])
    )
  );

  useEffect(() => {
    pulse.current.start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.fadingContainer,
        {
          alignItems: "center",
        },
      ]}
    >
      <Button
        mode={"text"}
        style={[
          styles.actionBtnCommon,
          {
            opacity: pulseAnim.current,
            borderColor: styles.acquiring.color,
            backgroundColor: styles.acquiring.BGColor,
          },
        ]}
        icon={() => (
          <Icon
            name={"satellite-variant"}
            style={[{ color: styles.acquiring.color }]}
            size={120}
          />
        )}
        animated={true}
      />
    </Animated.View>
  );
};

export default Acquiring;
