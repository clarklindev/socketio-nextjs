//'namespace' is the string '/'
//'client' is the socket

export const actionTypes = {
  DEFAULT_NAMESPACE_SOCKET: "default_namespace_socket", //context
  DEFAULT_NAMESPACE_CONNECT: "connect", //client/app/chat/page
  FETCHED_NAMESPACES: "fetched_namespace", //context

  //SERVER + CLIENT SHARED
  SERVER_TO_DEFAULT_NAMESPACE: "server_to_default_namespace", //client/app/chat/page
  DEFAULT_CLIENT_CONNECTED: "default_client_connected", //client/app/chat/page
  DB_NAMESPACES: "db_namespaces", //client/app/chat/page

  /*
    //------------------------------------------w
    REGISTER_NAMESPACE: "register_namespace",
    SET_NAMESPACE_ROOM_LIST: "set_namespace_room_list",
    SET_SELECTED_NAMESPACE: "set_selected_namespace",
    SET_ROOMS: "set_rooms"
    */
};
