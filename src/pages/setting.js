import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./setting.css";
import Sidebar from '../component/sidebar';
import Navbar from "../component/navbar";
import UserInfo from '../component/userInfo';
import ActionItem from '../component/actionItem';
import languageIcon from '../images/clarity_language-line.png';
import passwordIcon from '../images/carbon_password.png';
import guideIcon from '../images/material-symbols-light_menu-book-outline.png';
import privacyIcon from '../images/codicon_shield.png';
import helpIcon from '../images/mdi_account-help-outline.png';
import termsIcon from '../images/syarat-dan-ketentuan.png';
import logoutIcon from '../images/basil_logout-outline.png';

const Setting = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleActionClick = (path) => {
    console.log(`Navigating to: ${path}`);
    navigate(path); // Navigate to the specified path
  };

  return (
    <div style={{ display: 'flex' }}>
      <div>
        <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
        <Navbar />
        <UserInfo />
        <div className="action-list">
          <ActionItem
            iconSrc={languageIcon}
            title="Pilih Bahasa"
            description="pengenalan teks dan penulisan"
            onClick={() => handleActionClick('/setting/pilih-bahasa')}
          />
          <ActionItem
            iconSrc={passwordIcon}
            title="Ganti Password"
            description="atur ulang password dan pemulihan akun"
            onClick={() => handleActionClick('/setting/ganti-password')}
          />
          <ActionItem
            iconSrc={guideIcon}
            title="Panduan"
            description="instruksi atau petunjuk website"
            onClick={() => handleActionClick('/setting/panduan')}
          />
          <ActionItem
            iconSrc={privacyIcon}
            title="Kebijakan Privasi"
            description="keamanan akun pengguna"
            onClick={() => handleActionClick('/setting/kebijakan-privasi')}
          />
          <ActionItem
            iconSrc={helpIcon}
            title="Pusat Bantuan"
            description="sumber informasi dan pertanyaan umum (FAQ)"
            onClick={() => handleActionClick('/setting/pusat-bantuan')}
          />
          <ActionItem
            iconSrc={termsIcon}
            title="Syarat dan Ketentuan"
            description="kewajiban dan tanggung jawab pengguna"
            onClick={() => handleActionClick('/setting/syarat-dan-ketentuan')}
          />
          <ActionItem
            iconSrc={logoutIcon}
            title="Log-out"
            description="keluar dari akun"
            onClick={() => handleActionClick('/logout')}
          />
        </div>
      </div>
    </div>
  );
};

export default Setting;

