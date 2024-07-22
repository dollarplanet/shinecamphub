import React, { useState } from 'react';
import './room_chat.css';
import Sidebar from '../component/sidebar';
import Navbar from '../component/navbar';
import Barbox from '../component/barbox';
import OptionsLogout from '../component/optionLogout';

const ForumChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [title] = useState('Log-Out');

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
      <div style={{ flexGrow: 1 }}>
        <Navbar />
        <Barbox title={title}/>
        <OptionsLogout/>
      </div>
    </div>
  );
};
export default ForumChat;