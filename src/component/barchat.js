import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import io from 'socket.io-client';

const socket = io('http://localhost:3001'); // Adjust the URL as needed

const ChatContainer = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #9b59b6;
  padding: 10px;
  border-radius: 5px;
  background-color: #f7f7f7; /* Background color to match the image */
  box-shadow: 0 2px 4px rgba(0,0,0,0.1); /* Slight shadow for better appearance */
  position: fixed; /* Make the position fixed */
  bottom: 1px; /* Distance from the bottom */
  left: 125px; /* Distance from the left */
  right: 10px; /* Distance from the right */
  z-index: 1000; /* Ensure it is above other elements */
`;

const Input = styled.input`
  flex: 1;
  margin: 0 10px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 16px; /* Adjust font size for better readability */
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  margin: 0 5px;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  border-radius: 50%;
  transition: background-color 0.3s;

  &:hover {
    background-color: #eee;
  }
`;

const ChatComponent = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on('message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.off('message');
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit('message', message);
      setMessage('');
    }
  };

  return (
    <ChatContainer>
      <IconButton onClick={() => alert('Emoji clicked!')}>😊</IconButton>
      <Input
        type="text"
        placeholder="Ketikkan Pesan Anda..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            sendMessage();
          }
        }}
      />
      <IconButton onClick={() => alert('Profile clicked!')}>👤</IconButton>
      <IconButton onClick={() => alert('Attach clicked!')}>📎</IconButton>
      <IconButton onClick={() => alert('Camera clicked!')}>📷</IconButton>
    </ChatContainer>
  );
};

export default ChatComponent;

