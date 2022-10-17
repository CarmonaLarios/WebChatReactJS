import React from "react";
import { useEffect, useRef } from "react";

const MessageContainer = ({ messages, userId }) => {
  const messageRef = useRef();
  var style = null;

  function MessagePosition (message){
    console.table([{userIdMessage: message.userId, currentUser: message.userName}])
    return message.userId === userId?'user-message-right':'user-message-left';
  }

  function ShowUserId(message){
    console.table([{userId: message.userId, userName: message.userName }])
  }

  function TextPosition (message){
    console.table([{userIdMessage: message.userId, currentUser: message.userName}])
    return message.userId === userId?'chat-alignment-right':'chat-alignment-left';
  }

  useEffect(()=>{
    if(messageRef && messageRef.current){
      const {scrollHeigth, clientHeight} = messageRef.current;
      messageRef.current.scrollTo({
        left: 0, top: scrollHeigth - clientHeight, behavior: "smooth"
      });
    }
  },[messages]);

  return (
    <div className="message-container">
      {messages.map((m, index) => (        
        <div key={index} className={`${MessagePosition(m)}`}>
          <div className={`user-message ${TextPosition (m)}`}>{m.userName} diz:</div>
          {/*<div className="from-user">{m.userName} diz:</div>*/}
          <div className={`message ${MessagePosition(m)}`}>{m.message}</div>
        </div>
      ))}
    </div>
  );
};

export default MessageContainer;
