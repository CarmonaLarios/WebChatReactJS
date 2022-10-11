import { Form, Button } from "react-bootstrap";
import { useState } from "react";
import React from 'react';

const Lobby = ({ joinInRoom }) => {
  const [user, setUser] = useState(),
    [room, setRoom] = useState();

  return (
    <Form
      className="lobby" 
        onSubmit={e => { 
          e.preventDefault();
          joinInRoom(user, room);
      }}
    >
      <Form.Group>
        <Form.Control
          placeholder="Seu nome..."
          onChange={(e) => setUser(e.target.value) }
          className="userInput"
        />
        <Form.Control
          placeholder="Sala desejada..."
          onChange={(e) => setRoom(e.target.value)}
          className="userInput"
        />
      </Form.Group>
      <Button variant="success" type="submit" disabled={!(user && room)} className="userInput">
        Entrar
      </Button>
    </Form>
  );
};

export default Lobby;
