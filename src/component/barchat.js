import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import io from 'socket.io-client';

// Initialize socket connection to the backend
const socket = io('http://localhost:3003'); // Adjust the URL as needed

// Styled components for the chat UI
const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
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
  max-height: 300px;
  overflow-y: auto;
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  margin-bottom: 10px;
`;

const MessageBubble = styled.div`
  background-color: ${(props) => (props.from === 'You' ? '#dfe6e9' : '#74b9ff')};
  color: ${(props) => (props.from === 'You' ? '#000' : '#fff')};
  padding: 10px;
  border-radius: 10px;
  margin: 5px;
  max-width: 60%;
  align-self: ${(props) => (props.from === 'You' ? 'flex-end' : 'flex-start')};
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

const ChatComponent = ({ userId, userType }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [connectedUser, setConnectedUser] = useState(null);

  const fetchMessages = async (connectedUserId, connectedUserType) => {
    try {
      const response = await fetch(`http://localhost:3003/messages?withId=${connectedUserId}&withType=${connectedUserType}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('shinecampus_token')}`,
        },
      });
      const data = await response.json();
      setMessages(data.messages);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  useEffect(() => {
    socket.on('message', (msg) => {
      console.log('Received message from server:', msg);
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    socket.on('connectedUser', (userId) => {
      setConnectedUser(userId);
      if (userId) {
        console.log('Connected to user:', userId);
        setMessages((prevMessages) => [...prevMessages, { text: `Connected to user: ${userId}`, from: 'System' }]);
        fetchMessages(userId, userType === 'user' ? 'healer' : 'user');
      } else {
        setMessages((prevMessages) => [...prevMessages, { text: 'No users available to connect', from: 'System' }]);
      }
    });

    return () => {
      socket.off('message');
      socket.off('connectedUser');
    };
  }, [userType]);

  const sendMessage = async () => {
    if (message.trim()) {
      console.log('Sending message:', message);
      if (connectedUser) {
        socket.emit('message', { text: message, to: connectedUser, from: userId });

        setMessages((prevMessages) => [...prevMessages, { text: message, from: 'You' }]);

        // Save the message to the backend
        try {
          const response = await fetch('http://localhost:3003/send-message', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('shinecampus_token')}`,
            },
            body: JSON.stringify({
              senderType: userType, // 'user' or 'healer'
              receiverId: connectedUser,
              receiverType: userType === 'user' ? 'healer' : 'user', // The opposite type of the sender
              messageText: message,
            }),
          });

          if (!response.ok) {
            console.error('Failed to save message:', response.statusText);
          }
        } catch (error) {
          console.error('Failed to send message:', error);
        }
      }
      setMessage('');
    }
  };

  return (
    <ChatContainer>
      <MessagesContainer>
        {messages.map((msg, index) => (
          <MessageBubble key={index} from={msg.from}>
            {msg.from}: {msg.text}
          </MessageBubble>
        ))}
      </MessagesContainer>
      <div style={{ display: 'flex', alignItems: 'center' }}>
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
      </div>
    </ChatContainer>
  );
};

export default ChatComponent;