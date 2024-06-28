// Sidebar.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import HomeIcon from '../images/home.png';
import RoomIcon from '../images/chat.png';
import ForumIcon from '../images/forum_chat.png';
import MembershipIcon from '../images/membership.png';
import FeedbackIcon from '../images/feedback.png';
import SettingIcon from '../images/setting.png';
import showIcon from "../images/evaArrowLeftFill0.png";
import logo from '../images/logo.png'; // Add the path to your logo image
import './sidebar.css';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <button className="toggle-button" onClick={toggleSidebar}>
        <img src={showIcon} alt="Show Sidebar Icon" className="toggle-icon" />
      </button>
      {isOpen && (
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo" />
        </div>
      )}
      <ul className="sidebar-menu">
        <li className="sidebar-item">
          <NavLink to="/home" className="sidebar-link" activeClassName="active">
            {({ isActive }) => (
              <div className="sidebar-link-wrapper">
                <img src={HomeIcon} alt="Beranda Icon" className={`sidebar-icon ${isActive ? 'active' : ''}`} />
                {isOpen && <span className="sidebar-text">Beranda</span>}
              </div>
            )}
          </NavLink>
        </li>
        <li className="sidebar-item">
          <NavLink to="/room-chat" className="sidebar-link" activeClassName="active">
            {({ isActive }) => (
              <div className="sidebar-link-wrapper">
                <img src={RoomIcon} alt="Room Chat Icon" className={`sidebar-icon ${isActive ? 'active' : ''}`} />
                {isOpen && <span className="sidebar-text">Room Chat</span>}
              </div>
            )}
          </NavLink>
        </li>
        <li className="sidebar-item">
          <NavLink to="/forum-chat" className="sidebar-link" activeClassName="active">
            {({ isActive }) => (
              <div className="sidebar-link-wrapper">
                <img src={ForumIcon} alt="Forum Chat Icon" className={`sidebar-icon ${isActive ? 'active' : ''}`} />
                {isOpen && <span className="sidebar-text">Forum Chat Global</span>}
              </div>
            )}
          </NavLink>
        </li>
        <li className="sidebar-item">
          <NavLink to="/membership" className="sidebar-link" activeClassName="active">
            {({ isActive }) => (
              <div className="sidebar-link-wrapper">
                <img src={MembershipIcon} alt="Membership Icon" className={`sidebar-icon ${isActive ? 'active' : ''}`} />
                {isOpen && <span className="sidebar-text">Membership</span>}
              </div>
            )}
          </NavLink>
        </li>
        <li className="sidebar-item">
          <NavLink to="/feedback" className="sidebar-link" activeClassName="active">
            {({ isActive }) => (
              <div className="sidebar-link-wrapper">
                <img src={FeedbackIcon} alt="Feedback Icon" className={`sidebar-icon ${isActive ? 'active' : ''}`} />
                {isOpen && <span className="sidebar-text">Feedback</span>}
              </div>
            )}
          </NavLink>
        </li>
        <li className="sidebar-item">
          <NavLink to="/setting" className="sidebar-link" activeClassName="active">
            {({ isActive }) => (
              <div className="sidebar-link-wrapper">
                <img src={SettingIcon} alt="Pengaturan Icon" className={`sidebar-icon ${isActive ? 'active' : ''}`} />
                {isOpen && <span className="sidebar-text">Pengaturan</span>}
              </div>
            )}
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;





