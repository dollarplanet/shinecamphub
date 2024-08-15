import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import "../component/navbar.css";
import Logo from '../images/logo.png';
import Search from '../images/search.png';
import DefaultAvatar from '../images/Group.png';
import { useAuth } from '../component/AuthContent'; 

const Navbar = () => {
  const { user, healer, isLoggedIn } = useAuth(); // Assuming useAuth provides healer details as well
  const [searchQuery, setSearchQuery] = useState('');

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const debouncedHandleInputChange = debounce(handleInputChange, 300);

  return (
    <div className="fContainer">
      <nav className="wrapper">
        <div className='ImgContainer'>
          <div className='ImgContainer-2'>
            <img src={Logo} alt="Logo" className="Img" />
          </div>
        </div>
        <div className='search-input'>
          <img src={Search} alt='search' />
          <input
            type="text"
            placeholder="Cari..."
            value={searchQuery}
            onChange={debouncedHandleInputChange}
          />
        </div>
        <div className='user-info'>
          {isLoggedIn ? (
            <div className='profile-section'>
              <img
                src={DefaultAvatar}
                alt="Profile"
                className="profile-picture"
              />
              {user ? (
                <span className="username">{user.username}</span>
              ) : healer ? (
                <span className="username">{healer.username}</span>
              ) : null}
            </div>
          ) : (
            <button className='btn-login'>
              <NavLink to="/login" className="Navlink"><b>Login</b></NavLink>
            </button>
          )}
        </div>
      </nav>
    </div>
  );
};

// Debounce function to limit the rate of function execution
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

export default Navbar;



