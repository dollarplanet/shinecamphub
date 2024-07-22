import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./section_login.css";

const SectionLogin = ({ setLoggedIn, setEmail, setUserId }) => {
  const [email, setEmailState] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const onButtonClick = async (event) => {
    event.preventDefault();

    setEmailError('');
    setPasswordError('');
    setError('');

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
      try {
        const response = await axios.post('http://localhost:3003/login', { email, password });
        if (response.status === 200) {
          setLoggedIn(true);
          setEmail(email);
          setUserId(response.data.userId);
          navigate('/login/login-berhasil');
        }
      } catch (error) {
        setError('Invalid email or password');
      }
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
      {error && <p className="errorLabel">{error}</p>}
    </div>
  );
};

export default SectionLogin;
