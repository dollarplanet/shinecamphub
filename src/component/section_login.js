import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./section_login.css";

Modal.setAppElement('#root'); 

const SectionLogin = ({ setLoggedIn, setEmail, setUserId }) => {
  const [email, setEmailState] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [error, setError] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is already logged in via token
    const token = localStorage.getItem('shinecampus_token');
    if (token) {
      setLoggedIn(true);
      navigate('/home');
    }
  }, [setLoggedIn, navigate]);

  const openModal = (e) => {
    e.preventDefault();
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const registerAsUser = () => {
    closeModal();
    navigate('/register_user');
  };

  const registerAsHealer = () => {
    closeModal();
    navigate('/register_healer');
  };

  const validateEmail = (email) => {
    if (email === '') {
      return 'Please enter your email';
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      return 'Please enter a valid email';
    }
    return '';
  };

  const validatePassword = (password) => {
    if (password === '') {
      return 'Please enter a password';
    } else if (password.length < 8) {
      return 'The password must be 8 characters or longer';
    }
    return '';
  };

  const onButtonClick = async (event) => {
    event.preventDefault();

    // Clear previous errors
    setEmailError('');
    setPasswordError('');
    setError('');

    const emailValidationError = validateEmail(email);
    const passwordValidationError = validatePassword(password);

    if (emailValidationError || passwordValidationError) {
      setEmailError(emailValidationError);
      setPasswordError(passwordValidationError);
      return;
    }

    setIsLoading(true); // Start loading

    try {
      // Send login request to backend
      const response = await axios.post('http://localhost:3003/login', { email, password });
      console.log('Response:', response);

      if (response.status === 200) {
        // On successful login
        setLoggedIn(true);
        setEmail(response.data.email);
        setUserId(response.data.userId);

        // Save the token in localStorage with a specific name
        localStorage.setItem('shinecampus_token', response.data.token);

        // Redirect user after successful login
        navigate('/login/login-berhasil');
      }
    } catch (error) {
      console.error('Error:', error);
      if (error.response && error.response.data) {
        setError(error.response.data.error);
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false); // Stop loading
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
        <button className='inputButton' onClick={onButtonClick} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Konfirmasi'}
        </button>
      </div>
      <p>belum punya akun? <b><a href="/register" onClick={openModal}>Register</a></b></p>
      {error && <p className="errorLabel">{error}</p>}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Register Modal"
      >
        <div className="modalContent">
          <h2 className="modalHeader">Register</h2>
          <button className="modalButton" onClick={registerAsUser}>Register as User</button>
          <button className="modalButton" onClick={registerAsHealer}>Register as Healer</button>
          <button className="modalButton" onClick={closeModal}>Close</button>
        </div>
      </Modal>
    </div>
  );
};

export default SectionLogin;




