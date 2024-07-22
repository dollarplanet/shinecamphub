import React, { useState } from 'react';
import "./setting.css";
import Sidebar from '../component/sidebar';
import Navbar from "../component/navbar";

const PilihBahasa = () => {
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

export default PilihBahasa;