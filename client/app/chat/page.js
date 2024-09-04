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
  const {
    defaultNamespaceSocket,
    namespaces,
    saveFetchedNamespaces,
    //------------------------------------------
    // namespaceSockets,
    // registerNamespace,
    // selectedNsId,
    // rooms,
  } = useSocket();

  useEffect(() => {
    if (defaultNamespaceSocket) {
      const handleConnect = () => {
        console.log("CLIENT: DEFAULT SOCKET has connected 'connect'");

        defaultNamespaceSocket.emit(actionTypes.DEFAULT_CLIENT_CONNECTED);

        // Now that we know the socket is connected, set up the other event listeners
        defaultNamespaceSocket.on(actionTypes.SERVER_TO_DEFAULT_NAMESPACE, (data) => {
          console.log('CLIENT: receives "welcome":', data);
        });

        defaultNamespaceSocket.on(actionTypes.DB_NAMESPACES, (namespaces) => {
          console.log("namespaces: ", namespaces);
          saveFetchedNamespaces(namespaces);
        });
      };

      // Register the connect event handler
      defaultNamespaceSocket.on(actionTypes.DEFAULT_NAMESPACE_CONNECT, handleConnect);

      return () => {
        defaultNamespaceSocket.off(actionTypes.DEFAULT_NAMESPACE_CONNECT, handleConnect);
        defaultNamespaceSocket.off(actionTypes.SERVER_TO_DEFAULT_NAMESPACE);
        defaultNamespaceSocket.off(actionTypes.DB_NAMESPACES);
      };
    }
  }, [defaultNamespaceSocket]);
  //------------------------------------------

  // useEffect(() => {
  //   console.log("CLIENT: useEffect() called");
  //   let initializedSocket = null;

  //   const setupListeners = () => {
  //     if (selectedNsId && namespaceSockets[selectedNsId]) {
  //       initializedSocket = namespaceSockets[selectedNsId];

  //       initializedSocket.on("messageFromServer", (data) => {
  //         console.log(data);
  //       });

  //       initializedSocket.on("reconnect", (data) => {
  //         console.log("reconnect event!!!");
  //         console.log(data);
  //       });
  //     }
  //   };

  //   // Function to clean up listeners
  //   const cleanupListeners = () => {
  //     if (initializedSocket) {
  //       console.log("CLIENT: useEffect() cleanup cleanupListeners() called");
  //       initializedSocket.off("connect");
  //       initializedSocket.off("welcome");
  //       initializedSocket.off("messageFromServer");
  //       initializedSocket.off("reconnect");
  //       initializedSocket.disconnect();
  //     }
  //   };
  //   // Cleanup on component unmount
  //   /*
  //   Ensure Cleanup: Always call the cleanup function to remove listeners and disconnect the socket server when the socketServer instance changes or the component unmounts.
  //   */
  //   setupListeners();

  //   return () => {
  //     cleanupListeners();
  //   };
  // }, [selectedNsId]);

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

  // const roomsDOM = (
  //   <Rooms>
  //     {rooms?.map((room, index) => {
  //       return <div key={index}>{room.roomTitle}</div>;
  //     })}
  //   </Rooms>
  // );

  return (
    <main>
      <div className="sidemenu">{namespacesDOM}</div>
      <div className="subsidemenu">
        {
          // roomsDOM
        }
      </div>
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
