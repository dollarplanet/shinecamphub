import React, { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import io from 'socket.io-client';
import { MessageContext } from './message';

const socket = io('http://localhost:3003'); // Adjust the URL as needed

const ChatContainer = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #9b59b6;
  padding: 10px;
  border-radius: 5px;
  background-color: #f7f7f7;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: fixed;
  bottom: 1px;
  left: 125px;
  right: 10px;
  z-index: 1000;
`;

const Input = styled.input`
  flex: 1;
  margin: 0 10px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 16px;
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

const ChatComponent = ({ userId }) => {
  const [message, setMessage] = useState('');
  const { messages, setMessages, connectedUser, setConnectedUser } = useContext(MessageContext);

  useEffect(() => {
    socket.on('message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    socket.on('connectedUser', (userId) => {
      setConnectedUser(userId);
      if (userId) {
        setMessages((prevMessages) => [...prevMessages, { text: `Connected to user: ${userId}`, from: 'System' }]);
      } else {
        setMessages((prevMessages) => [...prevMessages, { text: 'No users available to connect', from: 'System' }]);
      }
    });

    return () => {
      socket.off('message');
      socket.off('connectedUser');
    };
  }, [setMessages, setConnectedUser]);

  const sendMessage = () => {
    if (message.trim()) {
      if (message.startsWith('/search')) {
        socket.emit('searchUser');
      } else if (message.startsWith('/next')) {
        socket.emit('nextUser');
      } else if (connectedUser) {
        socket.emit('message', { text: message, to: connectedUser, from: userId });
        setMessages((prevMessages) => [...prevMessages, { text: message, from: 'You' }]);
      }
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


