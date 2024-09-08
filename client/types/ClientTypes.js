//'namespace' is the string '/'
//'client' is the socket

export const actionTypes = {
  INITIAL_SOCKET: "initial_socket", //context
  CONNECT: "connect", //client/app/chat/page
  SAVE_FETCHED_NAMESPACES: "save_fetched_namespace", //context
  CREATE_SOCKET: "create_socket",
  SAVE_SELECTED_NAMESPACE_ENDPOINT: "save_selected_namespace_endpoint",
  SAVE_SELECTED_NAMESPACE_ROOM_IDS: "save_selected_namespace_room_ids",
  SAVE_FETCHED_ROOMS: "save_fetched_rooms",
  SAVE_ROOM_HISTORY: "save_room_history",
  //SERVER + CLIENT SHARED
  SERVER_TO_INITIAL_SOCKET: "server_to_initial_socket", //client/app/chat/page
  INITIAL_SOCKET_CONNECTED: "initial_socket_connected", //client/app/chat/page
  DB_NAMESPACES: "db_namespaces", //client/app/chat/page
  JOIN_ROOM: "join_room", //context
};
