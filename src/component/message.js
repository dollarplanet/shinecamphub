import React, { createContext, useState } from 'react';

export const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [connectedUser, setConnectedUser] = useState(null);

  return (
    <MessageContext.Provider value={{ messages, setMessages, connectedUser, setConnectedUser }}>
      {children}
    </MessageContext.Provider>
  );
};
