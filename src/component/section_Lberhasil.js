import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../component/AuthContent'; 
import ImageBerhasil from "../images/image3.png";
import "./section_login.css";

const Section_Lberhasil = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    } else {
      setLoading(false);
    }
  }, [isLoggedIn, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='mainContainer'>
      <div className='inputContainer'>
        <img src={ImageBerhasil} alt="Logo" />
        <p>Login Berhasil</p>
        <p>Selamat Datang di SHINE CAMPUS HUB, {user?.username}</p>
      </div>
      <div className='inputContainer'>
        <button className='inputButton' onClick={() => navigate('/home')}>
          Masuk ke Beranda
        </button>
      </div>
    </div>
  );
};

export default Section_Lberhasil;


