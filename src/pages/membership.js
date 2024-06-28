import React, { useState } from 'react';
import "./home.css"
import Sidebar from '../component/sidebar';
import Navbar from "../component/navbar"

const RoomChat = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div style={{ display: 'flex' }}>
        <div>
            <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
            <Navbar />
        </div>
    </div>
  );
};

export default RoomChat;