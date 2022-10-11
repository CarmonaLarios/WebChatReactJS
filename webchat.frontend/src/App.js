import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Lobby from "./components/Lobby";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { useState } from "react";
import React from "react";
import Chat from "./components/Chat";

const App = () => {
  const [connection, setConection] = useState();
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);

  const joinRoom = async (userName, room) => {
    try {
      const connection = new HubConnectionBuilder()
        .withUrl("https://localhost:7120/chat")
        .configureLogging(LogLevel.Information)
        .build();

      connection.on("UsersInRoom", (users)=>{
        setUsers(users);
      });

      connection.on("ReceiveMessage", (userName, message) => {
        setMessages((messages) => [...messages, { userName, message }]);
      });

      connection.onclose((e) => {
        setConection();
        setMessages([]);
        setUsers([]);
      });

      await connection.start();
      await connection.invoke("JoinInRoom", { userName, room });
      setConection(connection);
    } catch (error) {
      console.log(error);
    }
  };

  const sendMessage = async (message) => {
    try {
      await connection.invoke("SendMessage", message);
    } catch (error) {
      console.log(error);
    }
  };

  const closeConnection = async () => {
    try {
      await connection.stop();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="app">
      <h2>Web Chat</h2>
      <hr className="line" />
      {!connection ? (
        <Lobby joinInRoom={joinRoom} />
      ) : (
        <Chat
          messages={messages}
          sendMessage={sendMessage}
          closeConnection={closeConnection}
          users={users}
        />
      )}
    </div>
  );
};

export default App;
