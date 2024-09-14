import { actionTypes } from "../types/ServerTypes.js";
import { addMessage } from "./addMessage.js";
import { getMessages } from "./getMessages.js";
import { getNamespaces } from "./getNamespaces.js";
import { getRooms } from "./getRooms.js";

function leaveRooms(socket, rooms) {
  //NOTE: never leaves first room (which is socket itself's own room)
  //you can also create a var i=0, then increment i++
  //as forEach iterates in ascending order
  Array.from(rooms).forEach((room, index) => {
    //we dont want to leave the (socket.) sockets own room which is guaranteed to be first
    if (index !== 0) {
      socket.leave(room);
    }
  });
}

export async function initSocketHandlers(io) {
  //lesson 35

  // const thisNs = io.of(namespace.endpoint);
  // thisNs.on('connection', (socket)=>{
  // });

  /*
  NOTE: use `io.of(namespace.endpoint)` for interacting with the Socket.IO namespace directly, 
  NOTE: use `namespaces[roomObj.namespaceId]` when you need access to custom namespace-related data.
  */
  console.log("SERVER: STEP 07 - FUNCTION initNamespaceHandlers()");
  const namespaces = await getNamespaces();

  namespaces.forEach((namespace) => {
    // io.of(namespace.endpoint) -> initializes a namespace in Socket.IO.
    //'.of(namespace.endpoint)' -> creates or retrieves a namespace based on the namespace and endpoint
    io.of(namespace.endpoint).on(actionTypes.CONNECTION, (socket) => {
      console.log(`${socket.id} has connected to ${namespace.endpoint}`);
      //roomObj passed from CLIENTSIDE - joinRoom.js - joinRoom() see SocketContext: roomObj is { roomId, selectedNamespaceEndpoint }
      //lesson 40 acknowlege functions - ackCallBack()
      //NOTE: roomObj - includes information necessary for the server to understand which room the client wants to join, such as namespaceId and roomTitle.
      //NOTE: CLIENTSIDE emits 'joinRoom', and an object received as 'roomObj' {roomId, selectedNamespaceEndpoint} from SocketContext.js joinRoom
      socket.on(actionTypes.JOIN_ROOM, async (roomObj, ackCallback) => {
        //need to fetch the history

        console.log(`join room...`);
        console.log("-------------------------------------------------");
        console.log("passed in roomObj BEGIN: ");
        Object.entries(roomObj).forEach(([key, value]) => {
          console.log(`${key}: ${value}`);
        });
        console.log("passed in roomObj END: ");
        console.log("-------------------------------------------------");

        //NOTE: namespaces/namespace is (SERVER namespaces/namespace), which makes thisNs a server concept
        const thisNs = namespaces.find((namespace) => namespace.endpoint === roomObj.endpoint);
        const roomObjs = await getRooms(thisNs); //get from DB
        console.log("roomObjs: ", roomObjs);

        // roomInstance
        // thisRoomObj - the server-side (from DB) representation of the room, fetched from the server's internal data structure - It contains the room's details as they are stored on the server
        // NOTE: roomObj.roomId is passed from clientside
        const thisRoomObj = roomObjs.find((room) => room._id === roomObj.roomId);
        console.log("thisRoomObj: ", thisRoomObj);

        const thisRoomsHistory = thisRoomObj.history;

        // make client leave all rooms, because application design dictates the client can only be in one room at a time
        leaveRooms(socket, socket.rooms); //socket.rooms returns a Set()

        // join the room
        // NOTE: roomObj.roomTitle (changed to roomObj.roomId) is coming from CLIENT (Not safe)
        // TODO: auth so user (socket) has right to join room
        socket.join(roomObj.roomId);

        // fetch the number of sockets in this room
        const sockets = await io.of(namespace.endpoint).in(roomObj.roomId).fetchSockets();
        const socketCount = sockets.length;
        console.log(`SERVER: socketCount: ${socketCount}`);
        ackCallback({
          numUsers: socketCount,
          thisRoomsHistory,
          roomName: thisRoomObj.roomTitle,
        });
      });

      socket.on(actionTypes.GET_MESSAGES_FROM_ID, async (payload, ackCallBack) => {
        const { ids } = payload;
        console.log("socket payload: ", ids);
        const messageObjs = await getMessages(ids);
        console.log("messageObjs: ", messageObjs);

        ackCallBack({
          messageObjs,
        });
      });

      socket.on(actionTypes.SOCKET_TO_ROOM, async (messageObj) => {
        console.log("messageObj:", messageObj);
        //broadcast this to all connected clients in room
        //how can we find out what room this socket is in?
        // socket.rooms is a property that contains a Set-like object listing all rooms (including the default room) that the socket is currently joined to.
        // By default, a socket is always joined to its own room, identified by its socket.id.
        // [...rooms] converts the rooms Set-like object into an array. This is done to easily access individual elements of the Set.
        // Sets do not support direct indexing like arrays (rooms[1] wouldn't work directly on a Set).
        // The first element ([0]) is typically the socket's own room (the socket itself), identified by its socket.id.
        // The second element ([1]) is often the specific room the socket has joined.

        //socket.rooms is an object that provides information about the rooms that a particular socket is currently a member of
        //NOTE: when joining a namespace, it returns a "socket"
        //NOTE: by default the socket joins its own room which can be identified by socketId - Set { 'socketId', 'room1', 'room2' }.
        const rooms = socket.rooms; //Set of IDs

        console.log("SERVER socket.rooms: ", rooms);

        const socketRoom = [...rooms][0]; //string id
        const currentRoom = [...rooms][1]; //string id
        console.log("SERVER socket room: ", socketRoom);
        console.log("SERVER current room : ", currentRoom);

        //SERVER: push message on rooms history[] array
        addMessage(messageObj);

        // send out this messageObj to everyone including the sender
        //io.of() means -> all (connected) sockets in current room
        io.of(namespace.endpoint).in(currentRoom).emit(actionTypes.SERVER_BROADCAST_TO_ROOM_SOCKETS, messageObj);
      });

      socket.on(actionTypes.SOCKET_TO_SERVER, (dataFromClient) => {
        console.log("Data:", dataFromClient);
        //io. (this is the actual socket server (single instance created at start))
        io.emit(actionTypes.SERVER_BROADCAST_TO_SOCKETS, { text: dataFromClient.text });
      });

      //eg. when client closes browser
      socket.on(actionTypes.SOCKET_DISCONNECT, () => {
        console.log(`SERVER: receives 'disconnect', (${socket.id}) has disconnected`);
      });
    });
  });
}
