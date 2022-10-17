import React from "react";
import { Button } from "react-bootstrap";
import ConnectedUsers from "./ConnectedUsers";
import MessageContainer from "./MessageContainer";
import SendMessageForm from "./SendMessageForm";

const Chat = ({ messages, sendMessage, closeConnection, users, userId }) => (
  <div>
    <div className="leave-room">
      <Button variant="danger" onClick={()=> closeConnection()}>Sair da sala</Button>
    </div>
    {<ConnectedUsers users={users}/>}
    <div className="chat">
      <MessageContainer messages={messages} userId={userId} />
      <SendMessageForm sendMessage={sendMessage} />
    </div>
  </div>
);

export default Chat;
