import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Lobby from "./components/Lobby";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { useEffect, useState } from "react";
import React from "react";
import Chat from "./components/Chat";

const App = () => {
  const [connection, setConection] = useState();
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  //generate a randomId for user to help with message layout
  const [userId, setUserId] = useState(parseInt(Math.random() * 20));
  const [accessToken, setAccessToken] = useState();


  const joinRoom = async (userName, room) => {
    try {


      const connection = new HubConnectionBuilder()
        .withUrl("https://localhost:7120/chat")
        //.configureLogging(LogLevel.Information)
        .build();

      connection.on("UsersInRoom", (users)=>{
        setUsers(users);
      });

      connection.on("ReceiveMessage", (userName, message, userId) => {
        setMessages((messages) => [...messages, { userName, message, userId }]);
      });

      connection.onclose((e) => {
        setConection();
        setMessages([]);
        setUsers([]);
        closeConnection();
      });

      await connection.start();

      await connection.invoke("JoinInRoom", { userName, room, userId });
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

  // const setRandomId = () =>{
  //   try{
  //     setUserId(parseInt(Math.random() * 20));
  //     console.log(userId)
  //   }
  //   catch(error){
  //     console.log(error)
  //   }
    
  //   //useEffect(()=>{ console.log('userId',userId)},[userId])
  // }

  useEffect(()=>{
    console.log('userId',userId)
      
  },[userId]);

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
          userId={userId}
        />
      )}
    </div>
  );
};

export default App;
