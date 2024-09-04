"use client";

import io from "socket.io-client";
import { createContext, useReducer, useEffect, useContext } from "react";

import { actionTypes } from "@/types/ClientTypes";

//prop is the initial context (only values)
const initialState = {
  defaultNamespaceSocket: null,
  namespaces: [], //default namespace causes fetch of a list of namespaces from the db
  //------------------------------------------

  // namespaceSockets: {}, //stores sockets at index 'namespace endpoint'
  // listeners: { nsChange: [], messageToRoom: [] },
  // namespaceRoomList: [], //after namespace selected -> this is select namespaces' rooms (just an array of mongoose object IDs)
  // rooms: null,
  // selectedNamespace: null, //a global variable we update when the user updates the namespace
};

//create context - if you want auto completion, the passed in object needs the skeleton of functions, constants avail
//give rest of code structure (and has functions)
const SocketContext = createContext({
  ...initialState,
  saveFetchedNamespaces: () => {},
  //------------------------------------------

  // setNamespaceRoomList: () => {},
  // registerNamespace: (endpoint, socket) => {}, //register a namespace by passing {endpoint:'namespace endpoint', socket:'socket'}
  // setSelectedNamespace: () => {},
  // setNamespaceRooms: () => {},
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
      case actionTypes.DEFAULT_NAMESPACE_SOCKET:
        return {
          ...state,
          defaultNamespaceSocket: action.payload,
        };
      case actionTypes.FETCHED_NAMESPACES:
        return {
          ...state,
          namespaces: action.payload,
        };
      //------------------------------------------

      // case actionTypes.REGISTER_NAMESPACE:
      //   return {
      //     ...state,
      //     namespaceSockets: {
      //       ...state.namespaceSockets,
      //       [action.payload.endpoint]: action.payload.socket,
      //     },
      //   };

      // case actionTypes.SET_NAMESPACE_ROOM_LIST:
      //   return {
      //     ...state,
      //     namespaceRoomList: action.payload,
      //   };

      // case actionTypes.SET_SELECTED_NAMESPACE:
      //   return {
      //     ...state,
      //     selectedNsId: action.payload,
      //   };

      // case actionTypes.SET_ROOMS:
      //   return {
      //     ...state,
      //     rooms: action.payload,
      //   };

      default:
        return state;
    }
  };
  //------------------------------------------

  function saveDefaultNamespaceSocket(socket) {
    dispatch({
      type: actionTypes.DEFAULT_NAMESPACE_SOCKET,
      payload: socket,
    });
  }

  function saveFetchedNamespaces(namespaces) {
    dispatch({
      type: actionTypes.FETCHED_NAMESPACES,
      payload: namespaces,
    });
  }
  //------------------------------------------

  // function registerNamespace(endpoint, socket) {
  //   dispatch({
  //     type: actionTypes.REGISTER_NAMESPACE,
  //     payload: { endpoint, socket },
  //   });
  // }

  // function setNamespaceRoomList(namespaceRoomList) {
  //   dispatch({
  //     type: actionTypes.SET_NAMESPACE_ROOM_LIST,
  //     payload: namespaceRoomList,
  //   });
  // }

  // function setSelectedNamespace(key) {
  //   dispatch({
  //     type: actionTypes.SET_SELECTED_NAMESPACE_ENDPOINT,
  //     payload: { key },
  //   });
  // }

  // function setRooms(rooms) {
  //   dispatch({
  //     type: actionTypes.SET_ROOMS,
  //     payload: rooms,
  //   });
  // }

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    // Initialize socket connection - connect to default namespace '/'
    //NOTE: io() call triggers SERVER' CALL OF: `io.on("connection", ()=>{})`
    const defaultNamespaceSocket = io(`${process.env.NEXT_PUBLIC_SERVER_URL}:${process.env.NEXT_PUBLIC_SERVER_PORT}`);
    saveDefaultNamespaceSocket(defaultNamespaceSocket);

    // Cleanup on component unmount
    return () => {
      console.log("CLEANUP SocketContextProvider");
      defaultNamespaceSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{
        ...state,
        saveFetchedNamespaces,

        // registerNamespace,
        // setNamespaceRoomList,
        // setSelectedNamespace,
        // setRooms,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}
