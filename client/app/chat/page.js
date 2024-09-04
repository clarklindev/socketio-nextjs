//CLIENTSIDE
"use client";
import { useEffect } from "react";

import { useSocket } from "@/context/chat/SocketContext";
import { handleMessage } from "@/lib/socket/actions/handleMessage";
import { Namespaces } from "@/components/chat/Namespaces";
import { Namespace } from "@/components/chat/Namespace";
import { Rooms } from "@/components/chat/Rooms";

import { actionTypes } from "@/types/ClientTypes";

import "./page.css";

// CLIENT-SIDE

export default function ChatPage() {
  const { initialSocket, saveFetchedNamespaces, namespaces, rooms, selectedNamespaceRoomIDs, saveFetchedRooms } = useSocket();

  useEffect(() => {
    if (initialSocket) {
      const handleConnect = () => {
        console.log("CLIENT: DEFAULT SOCKET has connected 'connect'");

        initialSocket.emit(actionTypes.INITIAL_SOCKET_CONNECTED);

        // Now that we know the socket is connected, set up the other event listeners
        initialSocket.on(actionTypes.SERVER_TO_INITIAL_SOCKET, (data) => {
          console.log('CLIENT: receives "welcome":', data);
        });

        initialSocket.on(actionTypes.DB_NAMESPACES, (namespaces) => {
          console.log("namespaces: ", namespaces); //objects
          saveFetchedNamespaces(namespaces);
        });
      };

      // Register the connect event handler
      initialSocket.on(actionTypes.CONNECT, handleConnect);

      return () => {
        initialSocket.off(actionTypes.CONNECT, handleConnect);
        initialSocket.off(actionTypes.SERVER_TO_INITIAL_SOCKET);
        initialSocket.off(actionTypes.DB_NAMESPACES);
      };
    }
  }, [initialSocket]);

  useEffect(() => {
    const fetchRooms = async () => {
      console.log("FUNCTION fetchRooms()");
      if (selectedNamespaceRoomIDs.length > 0) {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}:${
              process.env.NEXT_PUBLIC_SERVER_PORT
            }/api/socket/rooms?ids=${selectedNamespaceRoomIDs.join(",")}`
          );
          const data = await res.json();
          console.log("rooms: ", data);
          saveFetchedRooms(data);
        } catch (error) {
          console.error("Error fetching rooms:", error);
        }
      } else {
        saveFetchedRooms([]);
      }
    };
    fetchRooms();
  }, [selectedNamespaceRoomIDs]); //roomID's
  //------------------------------------------

  const handleSubmit = (event) => {
    event.preventDefault();
    const message = event.target.message.value;
    handleMessage(message);
  };

  //------------------------------------------

  const namespacesDOM = namespaces?.length > 0 && (
    <Namespaces>
      {namespaces.map((ns, index) => {
        return <Namespace key={index} {...ns} />;
      })}
    </Namespaces>
  );

  const roomsDOM = rooms?.length > 0 && (
    <Rooms>
      {rooms.map((room, index) => {
        return <div key={index}>{room.roomTitle}</div>;
      })}
    </Rooms>
  );

  return (
    <main>
      <div className="sidemenu">{namespacesDOM}</div>
      <div className="subsidemenu">{roomsDOM}</div>
      <div className="content">
        <h2 className="room-heading">hello</h2>
        <ul id="messages" className="messages"></ul>
        <form id="form" onSubmit={handleSubmit}>
          <input id="input" name="message" autoComplete="off" />
          <button type="submit">Send</button>
        </form>
      </div>
    </main>
  );
}
