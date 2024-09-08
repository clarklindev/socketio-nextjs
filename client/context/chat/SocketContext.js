"use client";

import io from "socket.io-client";
import { createContext, useReducer, useEffect, useContext } from "react";

import { actionTypes } from "@/types/ClientTypes";
import { Message } from "@/components/chat/Message";

//prop is the initial context (only values)
const initialState = {
  initialSocket: null,
  db_namespaces: [], //default namespace causes fetch of a list of namespace objects from the db
  namespaceSockets: {}, //stores sockets at index 'namespace endpoint'
  selectedNamespaceEndpoint: null, //a global variable we update when the user updates the namespace
  selectedNamespaceRoomIDs: [], //after namespace selected -> this is select namespaces' rooms (just an array of mongoose object IDs)
  db_rooms: [], //fetched room objects from DB
  roomHistory: [],
};

//create context - if you want auto completion, the passed in object needs the skeleton of functions, constants avail
//give rest of code structure (and has functions)
const SocketContext = createContext({
  ...initialState,
  saveFetchedNamespaces: (namespaceObjs) => {},
  saveSelectedNamespaceEndpoint: (endpoint) => {},
  saveSelectedNamespaceRoomIDs: () => {},
  createSocket: (endpoint) => {}, //register a namespace by passing {endpoint:'namespace endpoint', socket:'socket'}
  saveFetchedRooms: (roomObjs) => {},
  joinRoom: (roomId) => {},
  saveRoomHistory: (history) => {},
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
          db_namespaces: action.payload,
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
          db_rooms: action.payload,
        };

      case actionTypes.SAVE_ROOM_HISTORY:
        return {
          ...state,
          roomHistory: action.payload,
        };

      default:
        return state;
    }
  };
  //------------------------------------------
  const [state, dispatch] = useReducer(reducer, initialState);

  // YOU NEED TO DESCTRUCT STATE TO USE
  const { initialSocket, namespaceSockets, selectedNamespaceEndpoint } = state;
  //------------------------------------------

  function saveInitialSocket(socket) {
    dispatch({
      type: actionTypes.INITIAL_SOCKET,
      payload: socket,
    });
  }

  function saveFetchedNamespaces(db_namespaces) {
    dispatch({
      type: actionTypes.SAVE_FETCHED_NAMESPACES,
      payload: db_namespaces,
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
    if (!namespaceSockets[endpoint]) {
      //There is no socket at this nsId. So make a new connection!
      //join this namespace with io()
      //NOTE: the namespace endpoint (ns.endpoint) has prefix '/' in db
      console.log(`CONTEXT: FUNCTION createSocket(${endpoint})`);
      const socket = io(`${process.env.NEXT_PUBLIC_SERVER_URL}:${process.env.NEXT_PUBLIC_SERVER_PORT}${endpoint}`);
      dispatch({
        type: actionTypes.CREATE_SOCKET,
        payload: { endpoint, socket },
      });
    } else {
      console.log(`namespace already exists: (${endpoint})`);
    }
  }

  function saveFetchedRooms(db_rooms) {
    dispatch({
      type: actionTypes.SAVE_FETCHED_ROOMS,
      payload: db_rooms,
    });
  }

  async function joinRoom(roomId) {
    console.log("roomId: ", roomId);
    console.log("current endpoint: ", selectedNamespaceEndpoint);
    // CLIENT
    // requires 2 props:
    // 1. room._id
    // 2. namespace ID,

    //lesson 40 - emitWithAck() ie no callback / using async
    /* THIS IS WHAT SERVER sends back with ackCallback():
    socket.on('joinRoom', async (roomObj, ackCallback)=>{
      ackCallback({
        numUsers:socketCount,
        thisRoomsHistory
      });
    }
    */

    console.log("start");

    const ackResp = await namespaceSockets[selectedNamespaceEndpoint].emitWithAck(actionTypes.JOIN_ROOM, {
      roomId,
      selectedNamespaceEndpoint,
    });
    //--------------------------------------------------------------------------
    // lesson 39 (9min 15sec) - COMMENTED OUT IN FAVOR OF USING emitWithAck()
    // const joinRoom = (roomTitle, namespaceId) => {
    //   console.log(roomTitle, namespaceId);
    //   // add guard...script load..
    //   if (nameSpaceSockets) {
    //     nameSpaceSockets[namespaceId].emit("joinRoom", roomTitle, (ackResp) => {
    //       console.log(ackResp); // {numUsers: 1}
    //       document.querySelector(".curr-room-text").innerHTML = roomTitle;
    //       document.querySelector(
    //         ".curr-room-num-users"
    //       ).innerHTML = `${ackResp.numUsers}<span class="fa-solid fa-user"></span>`;
    //     });
    //   }
    // };

    console.log("ackResp: ", ackResp); //response from server ackResp = {numUsers: socketCount, thisRoomsHistory}

    //save room history
    dispatch({
      type: actionTypes.SAVE_ROOM_HISTORY,
      payload: ackResp.thisRoomsHistory,
    });
  }

  //------------------------------------------

  useEffect(() => {
    // Initialize socket connection - connect to default namespace '/'
    //NOTE: io() call triggers SERVER' CALL OF: `io.on("connection", ()=>{})`
    //NOTE: a 'socket' represents a connection between client and socket server
    const initialSocket = io(`${process.env.NEXT_PUBLIC_SERVER_URL}:${process.env.NEXT_PUBLIC_SERVER_PORT}`);
    saveInitialSocket(initialSocket);
  }, []);

  useEffect(() => {
    if (initialSocket) {
      const handleConnect = () => {
        console.log("CLIENT: DEFAULT SOCKET has connected 'connect'");

        initialSocket.emit(actionTypes.INITIAL_SOCKET_CONNECTED);

        // Now that we know the socket is connected, set up the other event listeners
        initialSocket.on(actionTypes.SERVER_TO_INITIAL_SOCKET, (data) => {
          console.log('CLIENT: receives "welcome":', data);
        });

        initialSocket.on(actionTypes.DB_NAMESPACES, (db_namespaces) => {
          console.log("db_namespaces: ", db_namespaces); //objects
          saveFetchedNamespaces(db_namespaces);
        });
      };

      // Register the connect event handler
      initialSocket.on(actionTypes.CONNECT, handleConnect);

      // Cleanup on component unmount
      return () => {
        console.log("CLEANUP SocketContextProvider");
        initialSocket.off(actionTypes.CONNECT, handleConnect);
        initialSocket.off(actionTypes.SERVER_TO_INITIAL_SOCKET);
        initialSocket.off(actionTypes.DB_NAMESPACES);
        initialSocket.disconnect();
      };
    }
  }, [initialSocket]);

  return (
    <SocketContext.Provider
      value={{
        ...state,
        saveFetchedNamespaces,
        createSocket,
        saveSelectedNamespaceEndpoint,
        saveSelectedNamespaceRoomIDs,
        saveFetchedRooms,
        joinRoom, //imported
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}
