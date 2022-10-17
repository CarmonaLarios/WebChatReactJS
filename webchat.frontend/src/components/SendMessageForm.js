import React, { useState } from "react";
import { Button, Form, FormControl, InputGroup } from "react-bootstrap";

const SendMessageForm = ({ sendMessage }) => {
  const [message, setMessage] = useState("");

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        sendMessage(message);
        setMessage("");
      }}
    >
      <InputGroup>
        <FormControl
          placeholder="Digite algo..."
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          className='inputMessage'
        />
        <InputGroup>
          <Button variant="primary" type="submit" disabled={!message}>
            Enviar
          </Button>
        </InputGroup>
      </InputGroup>
    </Form>
  );
};

export default SendMessageForm;
