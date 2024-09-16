import { useState, useEffect } from "react";

import { Message } from "./Message";
import { useSocket } from "@/context/chat/SocketContext";
import { actionTypes } from "@/lib/chat/types/ClientTypes";

import styles from "./Chatpanel.module.css";

export const Chatpanel = () => {
  const { selectedRoomId, namespaceSockets, selectedNamespaceEndpoint, roomHistory, numUsers, roomName } = useSocket();
  const [message, setMessage] = useState("");
  const [historyDOM, setHistoryDOM] = useState();

  useEffect(() => {
    const fetchMessages = async () => {
      if (namespaceSockets && namespaceSockets[selectedNamespaceEndpoint] && roomHistory && roomHistory.length) {
        const socket = namespaceSockets[selectedNamespaceEndpoint];

        console.log("CLIENT roomHistory: ", roomHistory);

        try {
          // fetch messages with socket BUT if no roomHistory skip..
          const ackResp = await socket.emitWithAck(actionTypes.GET_MESSAGES_FROM_ID, {
            ids: roomHistory,
          });

          console.log("CLIENT GET_MESSAGES_FROM_ID ackResp: ", ackResp);

          //build the DOM
          const messageDOM = ackResp.messageObjs.length
            ? ackResp.messageObjs
                .slice() // Create a shallow copy to avoid mutating the original array
                .reverse() // Reverse the copied array
                .map((message, index) => <Message key={index} messageObj={message} />)
            : null;
          setHistoryDOM(messageDOM);
        } catch (error) {
          console.error("Error fetching messages: ", error);
        }
      } else {
        setHistoryDOM();
      }
    };
    fetchMessages();
  }, [selectedRoomId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const socket = namespaceSockets[selectedNamespaceEndpoint];

    // const user = await getTestUser();
    // console.log("CLIENT user: ", user);

    //NOTE: so after user login - the userId should be saved
    const messageData = {
      message,
      avatar: "https://via.placeholder.com/30",
      userId: "66e29c29a557f6e5a70d7572", //using test userId
      endpoint: selectedNamespaceEndpoint,
      roomId: selectedRoomId,
    };

    socket.emit(actionTypes.SOCKET_TO_ROOM, messageData);

    setMessage("");
  };

  // Handle input change
  const handleChange = (event) => {
    setMessage(event.target.value);
  };

  return (
    <div className={styles["chat-panel"]}>
      {/* header */}
      {selectedRoomId ? (
        <>
          <div className={styles["room-header"]}>
            <div>
              current room:<span>{roomName}</span>
            </div>

            <div>
              number of users:<span>{numUsers}</span>
            </div>
            <div className="search">
              <span className="glyphicon glyphicon-search"></span>
              <input type="text" id="search-box" placeholder="Search" />
            </div>
          </div>
          {/* message form */}
          <div className={styles["message-form"]}>
            <h2 className="room-heading">hello</h2>

            {/* message history */}
            <div className={styles["messages"]} id="message-history">
              {historyDOM}
            </div>

            {/* form */}
            <form id="form" onSubmit={handleSubmit}>
              <input id="input" name="message" autoComplete="off" value={message} onChange={handleChange} />
              <button type="submit">Send</button>
            </form>
          </div>
        </>
      ) : null}
    </div>
  );
};
