import { fetchNamespaces } from "./fetchNamespaces.js";
import { actionTypes } from "../../../types/ServerTypes.js";

export async function initInitialSocketHandlers(io) {
  console.log("SERVER: STEP 06 - FUNCTION initInitialSocketHandlers()");
  //set up connection event handlers
  //actionTypes.CONNECTION 'connection' is when CLIENT: SocketContext calls const newSocket = io(`${process.env.NEXT_PUBLIC_SERVER_URL}:${process.env.NEXT_PUBLIC_SERVER_PORT}`);
  //NOTE: THIS IS CALLED ONLY FOR CONNECTIONS TO DEFAULT NAMESPACE
  io.on(actionTypes.CONNECTION, async (socket) => {
    console.log(`SERVER: client (${socket.id}) connects to default namespace - io(${process.env.SERVER_URL}:${process.env.SERVER_PORT})`);
    // console.log(socket.handshake);
    //EMIT TO "CLIENT" SOCKET
    socket.emit(actionTypes.SERVER_TO_INITIAL_SOCKET, "Welcome to the server!");

    socket.on(actionTypes.INITIAL_SOCKET_CONNECTED, async () => {
      console.log("SERVER: FUNCTION fetchNamespaces()");
      const namespaces = await fetchNamespaces(); // Fetch namespaces from the API
      socket.emit(actionTypes.DB_NAMESPACES, namespaces || []);
    });
  });
}
