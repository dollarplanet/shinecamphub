import React, { useState } from 'react';
import './room_chat.css';
import Sidebar from '../component/sidebar';
import Navbar from '../component/navbar';
import Barbox from '../component/barbox';
import QuestionForm from '../component/questionForm';
import ContactInfo from '../component/contactInfo';

const PusatBantuan = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [title] = useState('Pusat Bantuan');

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
      <div style={{ flexGrow: 1 }}>
        <Navbar />
        <Barbox title={title}/>
        <QuestionForm/>
        <ContactInfo/>
      </div>
    </div>
  );
};
export default PusatBantuan;