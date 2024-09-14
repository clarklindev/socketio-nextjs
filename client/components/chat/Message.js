/*

//see server: lib/socket/db/models/MessageModel.js

messageObj structure:

{
  newMessage,
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
          {/* <span>{new Date(messageObj.date).toLocaleString()}</span> */}
        </div>
        <div className="message-text">{messageObj.newMessage}</div>
      </div>
    </li>
  );
};
