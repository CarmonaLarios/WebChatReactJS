import React from "react";
import { useEffect, useRef } from "react";

const MessageContainer = ({ messages }) => {
  const messageRef = useRef();

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
        <div key={index} className="user-message">
          <div className="message bg-primary">{m.message}</div>
          <div className="from-user">{m.userName}</div>
        </div>
      ))}
    </div>
  );
};

export default MessageContainer;
