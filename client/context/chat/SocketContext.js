"use client";

import io from "socket.io-client";
import { createContext, useReducer, useEffect, useContext } from "react";

import { actionTypes } from "@/lib/chat/types/ClientTypes";
import { addUser } from "@/lib/chat/actions/addUser";

//TODO:
/*
shouldnt there be a separation of state whats client accessible and private to the context?
ANSWER: yes, you should access state via getters/setters, else defeats the purpose of using Context and useReducer
*/

//prop is the initial context (only values)
const initialState = {
  //user related
  user: null,
  //namespace related
  db_namespaces: [], //default namespace causes fetch of a list of namespace objects from the db
  namespaceSockets: {}, //stores sockets at index 'namespace endpoint'
  selectedNamespaceEndpoint: null, //a global variable we update when the user updates the namespace
  selectedNamespaceRoomIDs: [], //after namespace selected -> this is select namespaces' rooms (just an array of mongoose object IDs)
  db_rooms: [], //fetched room objects from DB
  //room related
  selectedRoomId: null,
  roomHistory: [],
  numUsers: null,
  roomName: null,
};

//create context - if you want auto completion, the passed in object needs the skeleton of functions, constants avail
//give rest of code structure (and has functions)
const SocketContext = createContext({
  ...initialState,
  //other functions
  saveFetchedRooms: (db_rooms) => {},
  joinRoom: (roomId) => {},
  joinNamespace: () => {},
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
      case actionTypes.SAVE_FETCHED_DB_NAMESPACES:
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

      case actionTypes.SAVE_FETCHED_DB_ROOMS:
        return {
          ...state,
          db_rooms: action.payload,
        };

      case actionTypes.SAVE_ROOM_DETAILS:
        return {
          ...state,
          roomHistory: action.payload.roomHistory,
          selectedRoomId: action.payload.selectedRoomId,
          numUsers: action.payload.numUsers,
          roomName: action.payload.roomName,
        };

      case actionTypes.SAVE_USER:
        return {
          ...state,
          user: action.payload,
        };

      default:
        return state;
    }
  };
  //------------------------------------------
  const [state, dispatch] = useReducer(reducer, initialState);

  // YOU NEED TO DESCTRUCT STATE TO USE OR ACCESS THROUGH STATE
  const { namespaceSockets, selectedNamespaceEndpoint, user, numUsers } = state;
  //------------------------------------------

  function saveFetchedNamespaces(db_namespaces) {
    dispatch({
      type: actionTypes.SAVE_FETCHED_DB_NAMESPACES,
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

  function saveFetchedRooms(db_rooms) {
    dispatch({
      type: actionTypes.SAVE_FETCHED_DB_ROOMS,
      payload: db_rooms,
    });
  }

  function saveRoomDetails(roomDetails) {
    if (!roomDetails) {
      //do a reset
      dispatch({
        type: actionTypes.SAVE_ROOM_DETAILS,
        payload: {
          roomHistory: [],
          selectedRoomId: null,
          numUsers: 0,
          roomName: null,
        },
      });
      return;
    }

    const { history, roomId, numUsers, roomName } = roomDetails;

    dispatch({
      type: actionTypes.SAVE_ROOM_DETAILS,
      payload: {
        roomHistory: history,
        numUsers,
        roomName,
        selectedRoomId: roomId,
      },
    });
  }

  function createSocket(endpoint) {
    //There is no socket at this nsId. So make a new connection!
    //join this namespace with io()
    //NOTE: the namespace endpoint (ns.endpoint) has prefix '/' in db
    console.log(`CONTEXT: FUNCTION createSocket(${endpoint})`);
    const socket = io(`${process.env.NEXT_PUBLIC_SERVER_URL}:${process.env.NEXT_PUBLIC_SERVER_PORT}${endpoint}`);
    dispatch({
      type: actionTypes.CREATE_SOCKET,
      payload: { endpoint, socket },
    });
    return socket;
  }

  async function joinNamespace(endpoint, rooms) {
    saveSelectedNamespaceEndpoint(endpoint);
    saveSelectedNamespaceRoomIDs(rooms);
    saveRoomDetails(); //no prop means reset room state: selectedRoomId, roomHistory, numUsers

    if (!namespaceSockets[endpoint]) {
      const socket = await createSocket(endpoint);
      return socket;
    } else {
      console.log(`namespace already exists: (${endpoint})`);
    }
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
    const socket = namespaceSockets[selectedNamespaceEndpoint];
    console.log("socket: ", socket);

    const ackResp = await socket.emitWithAck(actionTypes.JOIN_ROOM, {
      roomId: roomId,
      endpoint: selectedNamespaceEndpoint,
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
    saveRoomDetails({ history: ackResp.thisRoomsHistory, numUsers: ackResp.numUsers, roomId, roomName: ackResp.roomName }); //history etc.
  }

  async function getTestUser() {
    console.log("CLIENT: getTestUser()");

    if (user) {
      return user;
    }

    const testUser = {
      name: "test",
      password: "password",
      email: "test@test.com",
    };

    const addUserResult = await addUser(testUser);

    dispatch({
      type: actionTypes.SAVE_USER,
      payload: addUserResult.savedUser,
    });
  }

  //------------------------------------------

  useEffect(() => {
    // Initialize socket connection - connect to default namespace '/'
    //NOTE: io() call triggers SERVER' CALL OF: `io.on("connection", ()=>{})`
    //NOTE: a 'socket' represents a connection between client and socket server
    createSocket("/");
  }, []);

  useEffect(() => {
    const initialSocket = namespaceSockets["/"];

    if (initialSocket) {
      const handleConnect = async () => {
        console.log("CLIENT: DEFAULT SOCKET has connected 'connect'");

        initialSocket.on(actionTypes.SERVER_TO_INITIAL_SOCKET, (data) => {
          console.log('CLIENT: receives "welcome":', data);
        });

        const ackResp = await initialSocket.emitWithAck(actionTypes.INITIAL_SOCKET_CONNECTED);
        console.log("CLIENT initialSocket ackResp: ", ackResp);
        saveFetchedNamespaces(ackResp.db_namespaces);
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
  }, [namespaceSockets["/"]]);

  return (
    <SocketContext.Provider
      value={{
        ...state,
        saveFetchedRooms,
        joinNamespace,
        joinRoom,
        getTestUser,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}
