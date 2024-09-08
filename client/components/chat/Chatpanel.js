import { handleMessage } from "@/lib/socket/actions/handleMessage";
import { useSocket } from "@/context/chat/SocketContext";
import { Message } from "./Message";

import styles from "./Chatpanel.module.css";

export const Chatpanel = () => {
  const { roomHistory } = useSocket();

  const roomHistoryDOM = roomHistory.map((messageObj) => {
    return <Message>{messageObj.newMessage}</Message>;
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    const message = event.target.message.value;
    handleMessage(message);
  };

  return (
    <div className={styles["chat-panel"]}>
      {/* header */}
      <div className={styles["room-header"]}>
        <div>
          current room:<span></span>
        </div>
        <div>
          number of users:<span></span>
        </div>
        <div className="search">
          <span className="glyphicon glyphicon-search"></span>
          <input type="text" id="search-box" placeholder="Search" />
        </div>
      </div>
      {/* message form */}
      <div className={styles["message-form"]}>
        <h2 className="room-heading">hello</h2>
        <ul className={styles["messages"]}>{roomHistoryDOM}</ul>
        <form id="form" onSubmit={handleSubmit}>
          <input id="input" name="message" autoComplete="off" />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};
