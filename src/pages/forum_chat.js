import React, { useState, useContext } from 'react';
import './room_chat.css';
import Sidebar from '../component/sidebar';
import Navbar from '../component/navbar';
import Barbox from '../component/barbox';
import ChatComponent from '../component/barchat';
import { MessageContext, MessageProvider } from '../component/message';

const Barchat = () => {
  const { messages } = useContext(MessageContext);

  return (
    <div className="barchat">
      {messages.map((msg, index) => (
        <div key={index} className="message">
          <strong>{msg.from}:</strong> {msg.text}
        </div>
      ))}
    </div>
  );
};

const ForumChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [title] = useState('Forum Chat');

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <MessageProvider>
      <div style={{ display: 'flex' }}>
        <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
        <div style={{ flexGrow: 1 }}>
          <Navbar />
          <Barbox title={title}/>
          <Barchat/>
          <ChatComponent />
        </div>
      </div>
    </MessageProvider>
  );
};

export default ForumChat;

