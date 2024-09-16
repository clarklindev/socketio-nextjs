import { useState, useEffect } from "react";

import { actionTypes } from "@/lib/chat/types/ClientTypes";
import { useSocket } from "@/context/chat/SocketContext";
import { Namespace } from "@/components/chat/Namespace";

export const Namespaces = () => {
  const { db_namespaces, selectedNamespaceEndpoint, namespaceSockets, addNewMessageById } = useSocket();
  const [db_namespacesDOM, setDb_namespacesDOM] = useState();

  useEffect(() => {
    console.log("db_namespaces: ", db_namespaces);
    const namespacesDOM =
      db_namespaces?.length > 0 &&
      db_namespaces.map((ns, index) => {
        return <Namespace key={index} settings={ns} />;
      });

    setDb_namespacesDOM(namespacesDOM);
  }, [db_namespaces]);

  useEffect(() => {
    let socket = null;

    const setupListeners = () => {
      if (namespaceSockets && namespaceSockets[selectedNamespaceEndpoint]) {
        socket = namespaceSockets[selectedNamespaceEndpoint];

        socket.on(actionTypes.SERVER_BROADCAST_TO_ROOM_SOCKETS, (message_id) => {
          console.log("clientside SERVER_BROADCAST_TO_ROOM_SOCKETS: ", message_id);
          addNewMessageById(message_id);
        });

        socket.on("reconnect", (data) => {
          console.log("reconnect event!!!");
          console.log(data);
        });

        socket.on("nsChange", (data) => {
          console.log("Namespace Changed!");
          console.log(data);
        });
      }
    };

    // Function to clean up listeners
    const cleanupListeners = () => {
      if (socket) {
        console.log("=========================================================");
        console.log("CLEANUP==================================================");
        console.log("=========================================================");
        console.log("CLIENT: useEffect() cleanup cleanupListeners() called");
        socket.off("connect");
        socket.off("welcome");
        socket.off("messageFromServer");
        socket.off("reconnect");
        socket.disconnect();
      }
    };

    setupListeners();

    return () => {
      cleanupListeners();
    };
  }, [namespaceSockets[selectedNamespaceEndpoint]]);

  return <div className="namespaces">{db_namespacesDOM}</div>;
};
