export const actionTypes = {
  CONNECTION: "connection", //lib/socket/namespace/initDefaultNamespaceHandlers

  //SERVER + CLIENT SHARED
  SERVER_TO_INITIAL_SOCKET: "server_to_initial_socket", //lib/socket/namespace/initDefaultNamespaceHandlers
  INITIAL_SOCKET_CONNECTED: "initial_socket_connected", //lib/socket/namespace/initDefaultNamespaceHandlers
  DB_NAMESPACES: "db_namespaces", //lib/socket/namespace/initDefaultNamespaceHandlers
  JOIN_ROOM: "join_room",
  // SERVER_TO_CLIENTS: "server_to_clients",
  // SERVER_TO_ROOM: "server_to_room", //socket server to room
  // SOCKET_CONNECT_NAMESPACE: "socket_connect_namespace",
  // SOCKET_TO_ROOM: "socket_to_room", //socket to room
  // SOCKET_TO_SERVER: "socket_to_server",
  // SOCKET_DISCONNECT: "socket_disconnect",
};
