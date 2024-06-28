import React, { useState } from 'react';
import './room_chat.css';
import ExplanationItem from '../component/Explanantion_item';
import Sidebar from '../component/sidebar';
import Navbar from '../component/navbar';
import Barbox from '../component/barbox';
import ButtonActions from '../component/buttonAction';
import Barchat from '../component/barchat'

const RoomChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [title, setTitle] = useState('Room Chat');
  const [selectedExplanation, setSelectedExplanation] = useState('');

  const data = [
    { button1Text: 'Sch Chat', button2Text: 'Pengaduan', explanation: 'https://via.placeholder.com/150' },
    // Add more data as needed
  ];

  const handleToggleExplanation = () => {
    setShowExplanation(!showExplanation);
  };

  const handleButtonClick = (text, explanation) => {
    setTitle(text);
    setSelectedExplanation(explanation);
    setShowExplanation(false);
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleChangeTitle = (newTitle) => {
    setTitle(newTitle); // Update the title in Barbox
    setShowExplanation(false); // Ensure explanation is hidden when title changes
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
      <div style={{ flexGrow: 1 }}>
        <Navbar />
        <Barbox title={title} onToggleExplanation={handleToggleExplanation} />
        <div style={{ padding: '20px' }}>
          {showExplanation ? (
            <ExplanationItem explanation={selectedExplanation} />
          ) : (
            <ButtonActions data={data} onButtonClick={handleButtonClick} onChangeTitle={handleChangeTitle} />
          )}
        </div>
        <Barchat/>
      </div>
    </div>
  );
};

export default RoomChat;
