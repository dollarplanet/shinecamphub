import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import io from 'socket.io-client';
import axios from 'axios';

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

const ErrorMessage = styled.div`
  color: red;
  text-align: center;
  margin-bottom: 10px;
`;

const ChatComponent = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [userName, setUserName] = useState(''); // Store the username of the logged-in user
  const [withName, setWithName] = useState(''); // Store the recipient's name
  const [receiverType, setReceiverType] = useState('user');  // Default to 'user'

  // Fetch logged-in user data from the backend
  const fetchUserData = async () => {
    try {
      console.log("Fetching user data...");
      const response = await axios.get('http://localhost:3003/verify-token', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('shinecampus_token')}`,
        },
      });

      console.log('User data fetched:', response.data);
      if (response.data.user) {
        setUserName(response.data.user.username);
        setWithName(response.data.user.username);  // Assuming chat starts with the logged-in user
        setReceiverType('user');  // Set receiver type to 'user'
      } else if (response.data.healer) {
        setUserName(response.data.healer.username);
        setWithName(response.data.healer.username); // Assuming chat starts with the logged-in healer
        setReceiverType('healer');  // Set receiver type to 'healer'
      }

      setError('');
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      setError('Failed to fetch user data. Please try again later.');
    }
  };

  // Fetch previous messages from the backend using Axios
  const fetchMessages = async () => {
    if (!withName) {
      setError('Recipient name is required to fetch messages.');
      return;
    }

    try {
      console.log(`Fetching messages with recipient: ${withName}`);
      const response = await axios.get('http://localhost:3003/messages', {
        params: { withName }, // Pass the recipient's name
        headers: {
          Authorization: `Bearer ${localStorage.getItem('shinecampus_token')}`,
        },
      });

      console.log('Messages fetched:', response.data);
      setMessages(response.data.messages);
      setError('');
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      setError('Failed to fetch messages. Please try again later.');
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchMessages();

    // Listen for incoming messages from the server
    socket.on('message', (msg) => {
      console.log('Received message from server:', msg);
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.off('message');
    };
  }, [withName]); // Add `withName` as a dependency to refetch messages when it changes

  // Handle sending messages using Socket.IO and Axios
  const sendMessage = async () => {
    if (message.trim()) {
      console.log('Sending message:', message);

      // Emit the message to the server using Socket.IO
      socket.emit('message', { text: message, from: userName, to: withName, receiverType });

      // Add the message to the UI immediately
      setMessages((prevMessages) => [...prevMessages, { text: message, from: 'You' }]);

      try {
        console.log("Sending message to backend...");
        const response = await axios.post(
          'http://localhost:3003/send-message',
          {
            senderName: userName,
            receiverName: withName,
            messageText: message,
            receiverType,  // Sertakan receiverType
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('shinecampus_token')}`,
            },
          }
        );

        console.log('Message saved:', response.data);

        if (response.status !== 200) {
          console.error('Failed to save message:', response.statusText);
          setError('Failed to save message. Please try again.');
        } else {
          setError('');
        }
      } catch (error) {
        console.error('Failed to send message:', error);
        setError('Failed to send message. Please check your connection and try again.');
      }

      setMessage('');
    }
  };

  return (
    <ChatContainer>
      {error && <ErrorMessage>{error}</ErrorMessage>} {/* Display error message if exists */}
      <MessagesContainer>
        {messages.map((msg, index) => (
          <MessageBubble key={index} from={msg.sender_name === userName ? 'You' : msg.sender_name}>
            {msg.sender_name === userName ? 'You' : msg.sender_name}: {msg.message_text}
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

