"use client";

import io from "socket.io-client";
import { createContext, useReducer, useEffect, useContext } from "react";

import { actionTypes } from "@/types/ClientTypes";

//prop is the initial context (only values)
const initialState = {
  initialSocket: null,
  namespaces: [], //default namespace causes fetch of a list of namespace objects from the db
  namespaceSockets: {}, //stores sockets at index 'namespace endpoint'
  selectedNamespaceEndpoint: null, //a global variable we update when the user updates the namespace
  selectedNamespaceRoomIDs: [], //after namespace selected -> this is select namespaces' rooms (just an array of mongoose object IDs)
  rooms: [], //fetched room objects from DB
};

//create context - if you want auto completion, the passed in object needs the skeleton of functions, constants avail
//give rest of code structure (and has functions)
const SocketContext = createContext({
  ...initialState,
  saveFetchedNamespaces: () => {},
  saveSelectedNamespaceEndpoint: (endpoint) => {},
  saveSelectedNamespaceRoomIDs: () => {},
  createSocket: (endpoint) => {}, //register a namespace by passing {endpoint:'namespace endpoint', socket:'socket'}
  saveFetchedRooms: (roomObjs) => {},
});

// Custom Hook for Using Socket
export const useSocket = () => {
  const context = useContext(SocketContext); //pass the shell context
  if (!context) {
    throw new Error("useSocket must be used within a SocketContextProvider");
  }
  return context;
};

// Socket Provider Component
export function SocketContextProvider({ children }) {
  //reducer
  const reducer = (state, action) => {
    switch (action.type) {
      case actionTypes.INITIAL_SOCKET:
        return {
          ...state,
          initialSocket: action.payload,
        };
      case actionTypes.SAVE_FETCHED_NAMESPACES:
        return {
          ...state,
          namespaces: action.payload,
        };

      case actionTypes.CREATE_SOCKET:
        return {
          ...state,
          namespaceSockets: {
            ...state.namespaceSockets,
            [action.payload.endpoint]: action.payload.socket,
          },
        };

      case actionTypes.SAVE_SELECTED_NAMESPACE_ENDPOINT:
        return {
          ...state,
          selectedNamespaceEndpoint: action.payload,
        };

      case actionTypes.SAVE_SELECTED_NAMESPACE_ROOM_IDS:
        return {
          ...state,
          selectedNamespaceRoomIDs: action.payload,
        };

      case actionTypes.SAVE_FETCHED_ROOMS:
        return {
          ...state,
          rooms: action.payload,
        };

      default:
        return state;
    }
  };
  //------------------------------------------

  function saveInitialSocket(socket) {
    dispatch({
      type: actionTypes.INITIAL_SOCKET,
      payload: socket,
    });
  }

  function saveFetchedNamespaces(namespaces) {
    dispatch({
      type: actionTypes.SAVE_FETCHED_NAMESPACES,
      payload: namespaces,
    });
  }

  function saveSelectedNamespaceEndpoint(endpoint) {
    dispatch({
      type: actionTypes.SAVE_SELECTED_NAMESPACE_ENDPOINT,
      payload: endpoint,
    });
  }

  function saveSelectedNamespaceRoomIDs(roomIds) {
    dispatch({
      type: actionTypes.SAVE_SELECTED_NAMESPACE_ROOM_IDS,
      payload: roomIds,
    });
  }

  function createSocket(endpoint) {
    console.log(`CONTEXT: FUNCTION createSocket(${endpoint})`);
    const socket = io(`${process.env.NEXT_PUBLIC_SERVER_URL}:${process.env.NEXT_PUBLIC_SERVER_PORT}${endpoint}`);
    dispatch({
      type: actionTypes.CREATE_SOCKET,
      payload: { endpoint, socket },
    });
  }

  function saveFetchedRooms(rooms) {
    dispatch({
      type: actionTypes.SAVE_FETCHED_ROOMS,
      payload: rooms,
    });
  }
  //------------------------------------------

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    // Initialize socket connection - connect to default namespace '/'
    //NOTE: io() call triggers SERVER' CALL OF: `io.on("connection", ()=>{})`
    //NOTE: a 'socket' represents a connection between client and socket server
    const initialSocket = io(`${process.env.NEXT_PUBLIC_SERVER_URL}:${process.env.NEXT_PUBLIC_SERVER_PORT}`);
    saveInitialSocket(initialSocket);

    // Cleanup on component unmount
    return () => {
      console.log("CLEANUP SocketContextProvider");
      initialSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{
        ...state,
        saveFetchedNamespaces,
        createSocket,
        saveSelectedNamespaceEndpoint,
        saveSelectedNamespaceRoomIDs,
        saveFetchedRooms,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}
