import { useSocket } from "@/context/chat/SocketContext";

import styles from "./Room.module.css";

export const Room = (props) => {
  const { joinRoom } = useSocket();

  const clickHandler = (event) => {
    event.preventDefault();
    joinRoom(props.roomId);
  };

  return (
    <div className={styles.room} onClick={(event, roomId) => clickHandler(event, roomId)}>
      {props.children}
    </div>
  );
};
