import React, { useState } from 'react';
import "./home.css"
import Sidebar from '../component/sidebar';
import Navbar from "../component/navbar"
import IsiFeedback from '../component/isiFeedback';
import HasilFeedback from '../component/hasilFeedback';

const comments = [
    { name: "Shelly Angelina", message: "SHINE sungguh hebat. aku jadi bisa menemukan banyak relasi sekarang." },
    { name: "Rosalina Ocha", message: "Setelah aku bercerita dengan SHINE, hatiku merasa lega. aku tidak merasa kesepian lagi. Terimakasih SHINE." },
    { name: "Akmal Atharrayhan", message: "Saya senang dengan SHINE ini, namun saya masih bingung ketika menjadi Helper. Tetapi saya bisa belajar sedikit lebih baik." },
    { name: "Ahmad Zaki", message: "Ternyata SHINE sangat berguna. tidak sia-sia aku mencobanya." }
];

const feedbackStats = [
    { label: "Sangat Tidak Puas", percentage: 0 },
    { label: "Tidak Puas", percentage: 27 },
    { label: "Cukup", percentage: 42 },
    { label: "Puas", percentage: 56 },
    { label: "Sangat Puas", percentage: 70 }
];

const Feedback = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div style={{ display: 'flex' }}>
        <div>
            <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
            <Navbar />
            <IsiFeedback/>
            <HasilFeedback comments={comments} feedbackStats={feedbackStats} />
        </div>
    </div>
  );
};

export default Feedback;