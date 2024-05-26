import React from 'react';
import { useNavigate } from 'react-router-dom';
import ImageBerhasil from "../images/image3.png";
import "./section_login.css";

const Section_Lberhasil = () => {

  const navigate = useNavigate();

  const onButtonClick = (event) => {
    event.preventDefault();
      navigate('/home');
  };

  return (
    <div className='mainContainer'>
      <div className='inputContainer'>
      <img src={ImageBerhasil} alt="Logo" />
      <p>Login Berhasil</p>
      <p>Selamat Datang di SHINE CAMPUS HUB</p>
      </div>
      <div className='inputContainer'>
        <button className='inputButton' onClick={onButtonClick}>
          Login
        </button>
      </div>
    </div>
  );
};

export default Section_Lberhasil;
