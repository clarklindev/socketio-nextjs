import { useSocket } from "@/context/chat/SocketContext";
import classes from "./Room.module.css";

export const Room = (props) => {
  const { joinRoom } = useSocket();

  const clickHandler = (event) => {
    event.preventDefault();
    joinRoom(props.roomId);
  };

  return (
    <div className={classes.room} onClick={(event, roomId) => clickHandler(event, roomId)}>
      {props.children}
    </div>
  );
};
