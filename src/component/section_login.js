import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./section_login.css";

const SectionLogin = ({ setLoggedIn, setEmail }) => {
  const [email, setEmailState] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const navigate = useNavigate();

  const onButtonClick = (event) => {
    event.preventDefault();
    
    setEmailError('');
    setPasswordError('');
  
    let valid = true;

    if (email === '') {
      setEmailError('Please enter your email');
      valid = false;
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setEmailError('Please enter a valid email');
      valid = false;
    }
  
    if (password === '') {
      setPasswordError('Please enter a password');
      valid = false;
    } else if (password.length < 8) {
      setPasswordError('The password must be 8 characters or longer');
      valid = false;
    }
  
    if (valid) {
      setEmail(email);
      setLoggedIn(true);
      navigate('/login/login-berhasil');
    }
  };

  return (
    <div className='mainContainer'>
      <div className='titleContainer'>
        <b>Sign In</b>
      </div>
      <div className='inputContainer'>
        <input
          type='email'
          value={email}
          placeholder='Enter your email here'
          onChange={(ev) => setEmailState(ev.target.value)}
          className='inputBox'
        />
        <label className='errorLabel'>{emailError}</label>
      </div>
      <div className='inputContainer'>
        <input
          type='password'
          value={password}
          placeholder='Enter your password here'
          onChange={(ev) => setPassword(ev.target.value)}
          className='inputBox'
        />
        <label className='errorLabel'>{passwordError}</label>
      </div>
      <div className='inputContainer'>
        <button className='inputButton' onClick={onButtonClick}>
          Konfirmasi
        </button>
      </div>
    </div>
  );
};

export default SectionLogin;
