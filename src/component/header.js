import React from 'react';
import RoomIcon from '../images/chat.png'; // update paths as necessary
import ForumIcon from '../images/forum_chat.png';
import MembershipIcon from '../images/membership.png';
import './Header.css';

const Header = () => {
  return (
    <div className="header">
      <div className="header-item">
        <img src={RoomIcon} alt="Room Chat" />
        <span>Room Chat</span>
      </div>
      <div className="header-item">
        <img src={ForumIcon} alt="Forum Chat Global" />
        <span>Forum Chat Global</span>
      </div>
      <div className="header-item">
        <img src={MembershipIcon} alt="Membership" />
        <span>Membership</span>
      </div>
    </div>
  );
};

export default Header;
