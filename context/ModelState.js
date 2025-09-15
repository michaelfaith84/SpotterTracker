import React, { useReducer } from "react";
import ModelContext from "./ModelContext";
import ModelReducer from "./ModelReducer";
import {
  APPEND_RECORD,
  CLEAR_NOTIFICATION,
  CREATE_RECORD,
  LOAD_RECORD,
  REMOVE_RECORD,
  SET_NOTIFICATION,
  SET_SETTINGS,
  UPDATE_RECORD,
} from "./types";
import "react-native-get-random-values";
import { StyleSheet } from "react-native";
import { MD2Colors as Colors } from "react-native-paper";
import { lineString, point } from "@turf/helpers";
import length from "@turf/length";
import * as FileSystem from "expo-file-system";
import { StorageAccessFramework } from "expo-file-system";
import bbox from "@turf/bbox";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Exporter from "expo-location-export/src/Exporter";

const ModelState = (props) => {
  const initialState = {
    settings: {},
    records: [],
    notification: { type: "", msg: "" },
    // pulseAnim: useRef(new Animated.Value(1)),
    styles: StyleSheet.create({
      fadingContainer: { opacity: 1 },
      actionBtnCommon: {
        borderWidth: 5,
        borderRadius: 180,
        width: 250,
        height: 250,
        justifyContent: "center",
        paddingLeft: 10,
      },
      default: {
        color: Colors.greenA700,
        BGColor: Colors.greenA100,
      },
      tracking: {
        color: Colors.redA700,
        BGColor: Colors.redA100,
      },
      acquiring: {
        color: Colors.yellowA700,
        BGColor: Colors.yellowA100,
      },
      fabSurface: {
        opacity: 0.4,
        backgroundColor: "rgba(0,0,0,0)",
        borderRadius: 180,
        width: 250,
        height: 250,
        elevation: 30,
        justifyContent: "center",
        alignItems: "center",
      },
      actionButtonContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: 100,
      },
      container: {
        alignItems: "center",
        backgroundColor: "transparent",
        flex: 1,
        justifyContent: "center",
      },
      background: {
        ...StyleSheet.absoluteFillObject,
      },
      backgroundViewWrapper: {
        ...StyleSheet.absoluteFillObject,
      },
      overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.4)",
      },
    }),
  };

  const [state, dispatch] = useReducer(ModelReducer, initialState);

  /**
   *
   * @param {string} id - storage key
   * @param {string} name
   * @param {string} type
   * @param [gps=null]
   * @param [properties=null]
   * @return {Promise<void>}
   */
  const createRecord = async (
    id,
    name,
    type,
    gps = null,
    properties = null
  ) => {
    const obj = new Exporter({ id, name });
    if (properties) {
      obj.add({ ...gps, props: properties });
    } else {
      obj.add(gps);
    }

    const record = {
      id,
      name,
      type,
      exporter: gps ? JSON.parse(obj.dump()) : {},
    };
    await AsyncStorage.setItem(id, JSON.stringify(record))
      .then(() =>
        dispatch({
          type: CREATE_RECORD,
          payload: record,
        })
      )
      .catch((e) =>
        dispatch({ type: SET_NOTIFICATION, payload: { type: "error", msg: e } })
      );
  };

  /**
   *
   * @param id
   * @param dataType
   * @param location
   * @param [properties={}]
   * @return {Promise<void>}
   */
  const appendRecord = async (id, dataType, location, properties = {}) => {
    const record = state.records.filter((record) => record.id === id)[0];
    const obj = Exporter.load(record.location);
    location["props"] = properties;
    obj.add(location);
    const updatedRecord = {
      ...record,
      [dataType]: record[dataType] ? [...record[dataType], location] : location,
    };
    await AsyncStorage.setItem(id, JSON.stringify(updatedRecord)).then(() =>
      dispatch({ type: APPEND_RECORD, payload: updatedRecord })
    );
  };

  const updateRecord = async (id, record) => {
    await AsyncStorage.setItem(id, JSON.stringify(record)).then(() =>
      dispatch({
        type: UPDATE_RECORD,
        payload: record,
      })
    );
  };

  const removeRecord = async (id) =>
    await AsyncStorage.removeItem(id)
      .then(() =>
        dispatch({
          type: REMOVE_RECORD,
          payload: id,
        })
      )
      .catch((e) =>
        dispatch({ type: SET_NOTIFICATION, payload: { type: "error", msg: e } })
      );

  const loadRecords = async () => {
    let keys = await AsyncStorage.getAllKeys();
    keys = keys.filter((key) => key !== "settings");

    keys.forEach(
      async (key) =>
        await AsyncStorage.getItem(key)
          .then((rec) => {
            dispatch({
              type: LOAD_RECORD,
              payload: rec,
            });
          })
          .catch((e) =>
            dispatch({
              type: SET_NOTIFICATION,
              payload: { type: "error", msg: e },
            })
          )
    );
  };

  const sendNotification = ({ type, msg }) => {
    dispatch({
      type: SET_NOTIFICATION,
      payload: { type, msg },
    });
  };

  const clearNotification = () => {
    dispatch({ type: CLEAR_NOTIFICATION });
  };

  const createDefaultName = (datetime) => `${datetime.toLocaleString()}`;

  const makeLineString = (record) => {
    const coordsArray = [];
    record.gps.forEach((e) =>
      coordsArray.push([e.longitude, e.latitude, e.altitude])
    );
    return lineString(
      coordsArray,
      {
        name: record.name,
        createdOn: record.gps[0].timestamp,
      },
      { id: record.id, bbox: bbox(lineString(coordsArray)) }
    );
  };

  const makePoint = (record) => {
    return point(
      [record.gps[0].longitude, record.gps[0].latitude, record.gps[0].altitude],
      {
        name: record.name,
        time: record.gps[0].timestamp,
      },
      { id: record.id, time: record.timestamp }
    );
  };

  const getLength = (record) => {
    const line = makeLineString(record);
    const miles = length(line, { units: "miles" }).toFixed(2);
    return miles >= 1
      ? `${miles} miles`
      : `${length(line, { units: "feet" }).toFixed(2)} feet`;
  };

  const exportGeoJSON = async (uri, record) => {
    const exporter = Exporter.load(JSON.stringify(record.exporter));
    const feature =
      record.type === "track"
        ? exporter.toLine("geojson")
        : exporter.toPoint("geojson");
    await StorageAccessFramework.createFileAsync(
      uri,
      `${record.name}.json`,
      "application/geo+json"
    )
      .then(async (fileUri) => {
        // Save data to newly created file
        await FileSystem.writeAsStringAsync(
          fileUri,
          JSON.stringify(feature, null, "\t"),
          {
            encoding: FileSystem.EncodingType.UTF8,
          }
        ).then(() =>
          sendNotification({
            type: "success",
            msg: `Exported as ${record.name}.json`,
          })
        );
      })
      .catch(async (e) => {
        sendNotification({ type: "error", msg: "Unable to export" });
      });
  };

  // 'setting' should be a key: value pair
  const setSetting = async (setting) => {
    await AsyncStorage.setItem("settings", JSON.stringify(state.settings));
    dispatch({
      type: SET_SETTINGS,
      payload: { ...state.settings, setting },
    });
  };

  const loadSettings = async () => {
    const settings = await AsyncStorage.getItem("settings");
    const parsed = JSON.parse(settings);

    dispatch({
      type: SET_SETTINGS,
      payload: settings ? parsed : {},
    });
  };

  return (
    <ModelContext.Provider
      value={{
        settings: state.settings,
        records: state.records,
        notification: state.notification,
        // pulseAnim: state.pulseAnim,
        styles: state.styles,
        btnState: state.btnState,
        loadRecords,
        createRecord,
        appendRecord,
        updateRecord,
        removeRecord,
        sendNotification,
        clearNotification,
        createDefaultName,
        getLength,
        exportGeoJSON,
        loadSettings,
        setSetting,
      }}
    >
      {props.children}
    </ModelContext.Provider>
  );
};

export default ModelState;
