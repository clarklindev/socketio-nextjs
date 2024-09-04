export const actionTypes = {
  DEFAULT_NAMESPACE_CONNECTION: "connection", //lib/socket/namespace/initDefaultNamespaceHandlers

  //SERVER + CLIENT SHARED
  SERVER_TO_DEFAULT_NAMESPACE: "server_to_default_namespace", //lib/socket/namespace/initDefaultNamespaceHandlers
  DEFAULT_CLIENT_CONNECTED: "default_client_connected", //lib/socket/namespace/initDefaultNamespaceHandlers
  DB_NAMESPACES: "db_namespaces", //lib/socket/namespace/initDefaultNamespaceHandlers

  // SERVER_TO_CLIENTS: "server_to_clients",
  // SERVER_TO_ROOM: "server_to_room", //socket server to room
  // CLIENT_CONNECT_NAMESPACE: "client_connect_namespace",
  // CLIENT_JOIN_ROOM: "client_join_room",
  // CLIENT_TO_ROOM: "client_to_room", //socket to room
  // CLIENT_TO_SERVER: "client_to_server",
  // CLIENT_DISCONNECT: "client_disconnect",
};
