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

export default (state, action) => {
  switch (action.type) {
    case LOAD_RECORD:
      console.log("State Records", JSON.stringify(state.records));
      return {
        ...state,
        records: [
          ...state.records.filter((e) => e.id !== action.payload.id),
          typeof action.payload ? JSON.parse(action.payload) : action.payload,
        ],
      };
    case CREATE_RECORD:
      return {
        ...state,
        records: [...state.records, action.payload],
      };
    case APPEND_RECORD:
      return {
        ...state,
        records: [
          ...state.records.filter((record) => record.id !== action.payload.id),
          action.payload,
        ],
      };
    case UPDATE_RECORD:
      return {
        ...state,
        records: [
          ...state.records.filter((e) => e.id !== action.payload.id),
          action.payload,
        ],
        notification: {
          type: "success",
          msg: `Record ${action.payload.name} has been updated`,
        },
      };
    case REMOVE_RECORD:
      return {
        ...state,
        records: [...state.records.filter((e) => e.id !== action.payload)],
        notification: {
          type: "success",
          msg: `Record ${
            state.records.filter((record) => record.id === action.payload)[0]
              .name
          } has been removed`,
        },
      };
    case SET_NOTIFICATION:
      return {
        ...state,
        notification: action.payload,
      };
    case CLEAR_NOTIFICATION:
      return {
        ...state,
        notification: { type: "", msg: "" },
      };
    case SET_SETTINGS:
      return { ...state, settings: action.payload };
    default:
      return state;
  }
};
