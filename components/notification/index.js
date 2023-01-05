import ModelContext from "../../context/ModelContext";
import { useContext } from "react";
import { Snackbar } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const Notification = () => {
  const modelContext = useContext(ModelContext);
  const { notification, clearNotification } = modelContext;
  const getBackgroundColor = (type) => {
    switch (type) {
      case "info":
        return "blue";
      case "success":
        return "green";
      case "warning":
        return "orange";
      case "error":
        return "red";
      default:
        return "rgba(0, 0, 0, 0.0)";
    }
  };

  return (
    <Snackbar
      visible={notification.type !== ""}
      onDismiss={clearNotification}
      action={{
        label: "Dismiss",
        onPress: () => {
          clearNotification();
        },
      }}
      style={{
        alignItems: "center",
        color: "white",
        backgroundColor: getBackgroundColor(notification.type),
      }}
    >
      {notification.type === "success" ? (
        <Icon name={"check-circle-outline"} style={{ color: "white" }}>
          {"    "}
          {`${
            notification.type.charAt(0).toLocaleUpperCase() +
            notification.type.slice(1)
          }: ${notification.msg}`}
        </Icon>
      ) : (
        ""
      )}
      {notification.type === "info" ? (
        <Icon name={"alert-circle-outline"} style={{ color: "white" }}>
          {"    "}
          {`${
            notification.type.charAt(0).toLocaleUpperCase() +
            notification.type.slice(1)
          }: ${notification.msg}`}
        </Icon>
      ) : (
        ""
      )}
      {notification.type === "warning" ? (
        <Icon name={"alert-outline"} style={{ color: "white" }}>
          {"    "}
          {`${
            notification.type.charAt(0).toLocaleUpperCase() +
            notification.type.slice(1)
          }: ${notification.msg}`}
        </Icon>
      ) : (
        ""
      )}
      {notification.type === "error" ? (
        <Icon name={"alert-octagon-outline"} style={{ color: "white" }}>
          {"    "}
          {`${
            notification.type.charAt(0).toLocaleUpperCase() +
            notification.type.slice(1)
          }: ${notification.msg}`}
        </Icon>
      ) : (
        ""
      )}
    </Snackbar>
  );
};

export default Notification;
