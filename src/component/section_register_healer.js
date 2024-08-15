import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./section_login.css";

const SectionRegister = () => {
  const [username, setUsername] = useState('');
  const [email, setEmailState] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const onButtonClick = async (event) => {
    event.preventDefault();

    // Reset error states
    setUsernameError('');
    setEmailError('');
    setPasswordError('');
    setError('');

    // Validation
    let valid = true;

    if (username === '') {
      setUsernameError('Please enter your username');
      valid = false;
    }

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
        // Call the healer registration API endpoint
        const response = await axios.post('http://localhost:3003/register/healer', { username, email, password });

        if (response.status === 200) {
          // Navigate to login page after successful registration
          navigate('/login');
        }
      } catch (error) {
        setError('Registration failed');
      }
    }
  };

  return (
    <div className='mainContainer'>
      <div className='titleContainer'>
        <b>Register as Healer</b>
      </div>
      <div className='inputContainer'>
        <input
          type='text'
          value={username}
          placeholder='Enter your username here'
          onChange={(ev) => setUsername(ev.target.value)}
          className='inputBox'
        />
        <label className='errorLabel'>{usernameError}</label>
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
      <p>Sudah punya akun? <b><a href="/login">Login</a></b></p>
      {error && <p className="errorLabel">{error}</p>}
    </div>
  );
};

export default SectionRegister;



