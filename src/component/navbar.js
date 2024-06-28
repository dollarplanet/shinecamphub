import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import "../component/navbar.css"
import Logo from '../images/logo.png';
import Search from '../images/search.png'

const Navbar = ({ src, alt }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className="fContainer">
      <nav className="wrapper">
        <div className='ImgContainer'>
          <div className='ImgContainer-2'>
            <img src={Logo} alt={alt} className="Img" />
          </div>
        </div>
        <div className='search-input'>
          <img src={Search} alt='search' />
          <input
            type="text"
            placeholder="Cari..."
            value={searchQuery}
            onChange={handleInputChange}
          />
        </div>
        <button className='btn-login'><NavLink to="/login" className="Navlink"><b>Login</b></NavLink></button>
      </nav>
    </div>
  );
}

export default Navbar;