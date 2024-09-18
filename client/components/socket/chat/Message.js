/*

//see server: lib/socket/db/models/MessageModel.js

messageObj structure:

{d
  message,
  date,
  userId,
  avatar,
  roomId
}

*/
import classes from "./Message.module.css";

export const Message = ({ messageObj }) => {
  return (
    <li className={classes.li}>
      <div className="user-image">
        <img src={messageObj.avatar} />
      </div>

      <div className="user-message">
        <div className="user-name-time">
          {messageObj.userId}
          <div className={classes.date}>{new Date(messageObj.date).toLocaleString()}</div>
        </div>
        <div className="message-text">{messageObj.message}</div>
      </div>
    </li>
  );
};
