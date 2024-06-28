import React, { useState } from 'react';
import './room_chat.css';
import Sidebar from '../component/sidebar';
import Navbar from '../component/navbar';
import Barbox from '../component/barbox';
import Barchat from '../component/barchat'

const ForumChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [title] = useState('Forum Chat');

  const data = [
    { button1Text: 'Sch Chat', button2Text: 'Pengaduan', explanation: 'https://via.placeholder.com/150' },
    // Add more data as needed
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
      <div style={{ flexGrow: 1 }}>
        <Navbar />
        <Barbox title={title}/>
        <Barchat/>
      </div>
    </div>
  );
};
export default ForumChat;