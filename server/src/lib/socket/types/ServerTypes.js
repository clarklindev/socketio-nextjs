export const actionTypes = {
  CONNECTION: "connection", //lib/socket/namespace/initDefaultNamespaceHandlers

  //SERVER + CLIENT SHARED
  SERVER_TO_INITIAL_SOCKET: "server_to_initial_socket", //lib/socket/namespace/initDefaultNamespaceHandlers
  INITIAL_SOCKET_CONNECTED: "initial_socket_connected", //lib/socket/namespace/initDefaultNamespaceHandlers
  DB_NAMESPACES: "db_namespaces", //lib/socket/namespace/initDefaultNamespaceHandlers
  JOIN_ROOM: "join_room",
  SOCKET_TO_ROOM: "socket_to_room", //socket to room
  SERVER_BROADCAST_TO_ROOM_SOCKETS: "server_broadcast_to_room_sockets", //to all sockets in this room
  SERVER_BROADCAST_TO_SOCKETS: "server_broadcast_to_sockets", //server to sockets
  SOCKET_TO_SERVER: "socket_to_server",
  SOCKET_DISCONNECT: "socket_disconnect", //socket disconnects
  GET_MESSAGES_FROM_ID: "get_messages_from_id",
};
