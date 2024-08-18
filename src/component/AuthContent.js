import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();
const socket = io('https://api.shinecampushub.web.id');

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [healer, setHealer] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('shinecampus_token');

    if (token) {
      let decoded;
      try {
        decoded = jwtDecode(token);
      } catch (error) {
        console.error("Invalid token:", error);
        logout();
        return;
      }

      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        logout();
      } else {
        const userType = decoded.userId ? 'user' : 'healer';

        axios.get(`https://api.shinecampushub.web.id/${userType}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(response => {
          if (userType === 'user') {
            setUser(response.data.user);
          } else {
            setHealer(response.data.healer);
          }
          setIsLoggedIn(true);
        })
        .catch(error => {
          console.error('Failed to fetch user data:', error);
          setIsLoggedIn(false);
          logout();
        });
      }
    }

    socket.on('message', (msg) => {
      setMessages(prevMessages => [...prevMessages, msg]);
    });

    return () => {
      socket.off('message');
    };
  }, []);

  const sendMessage = async (receiverId, receiverType, messageText) => {
    const senderType = user ? 'user' : 'healer';
    const senderId = user ? user.id_user : healer.id_healer;

    try {
      const response = await axios.post('https://api.shinecampushub.web.id/send-message', {
        senderType,
        receiverId,
        receiverType,
        messageText,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('shinecampus_token')}`,
        },
      });

      const newMessage = {
        id_message: response.data.messageId,
        sender_id: senderId,
        sender_type: senderType,
        receiver_id: receiverId,
        receiver_type: receiverType,
        message_text: messageText,
        timestamp: new Date(),
      };

      socket.emit('message', newMessage);

      setMessages(prevMessages => [...prevMessages, newMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const receiveMessages = async (withId, withType) => {
    try {
      const response = await axios.get('https://api.shinecampushub.web.id/messages', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('shinecampus_token')}`,
        },
        params: { withId, withType },
      });

      setMessages(response.data.messages);
    } catch (error) {
      console.error('Failed to retrieve messages:', error);
    }
  };

  const login = (userData) => {
    if (userData.userId) {
      setUser(userData);
    } else {
      setHealer(userData);
    }
    setIsLoggedIn(true);
    localStorage.setItem('shinecampus_token', userData.token);
  };

  const logout = () => {
    setUser(null);
    setHealer(null);
    setIsLoggedIn(false);
    localStorage.removeItem('shinecampus_token');
  };

  return (
    <AuthContext.Provider value={{ user, healer, isLoggedIn, login, logout, sendMessage, receiveMessages, messages }}>
      {children}
    </AuthContext.Provider>
  );
};



