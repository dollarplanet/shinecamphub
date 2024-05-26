import React from 'react';
import { NavLink } from 'react-router-dom'; // import NavLink dari react-router-dom
import "../component/Navbar.css";
import Logo from '../images/logo.png';

const Navbar = ({ src, alt }) => {
  return (
    <div className="fContainer">
      <nav className="wrapper">
        <div className='ImgContainer'>
          <div className='ImgContainer-2'>
            <img src={Logo} alt={alt} className="Img" />
          </div>
        </div>
        
        <input className='search-input'/>

        <button className='btn-login'><NavLink to="/login" className="Navlink"><b>Login</b></NavLink></button>
      </nav>
    </div>
  );
}

export default Navbar;