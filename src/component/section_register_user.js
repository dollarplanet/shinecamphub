import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./section_user.css";

const SectionRegister = ({ setLoggedIn, setEmail, setUserId, setRegister }) => {
  const [username, setUsername] = useState('');
  const [email, setEmailState] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [campusName, setCampusName] = useState('');
  const [studentProof, setStudentProof] = useState(null);

  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [campusNameError, setCampusNameError] = useState('');
  const [studentProofError, setStudentProofError] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  const onButtonClick = async (event) => {
    event.preventDefault();

    setUsernameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setCampusNameError('');
    setStudentProofError('');
    setError('');
    setSuccess('');

    let valid = true;

    // Validation logic
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

    if (confirmPassword !== password) {
      setConfirmPasswordError('Passwords do not match');
      valid = false;
    }

    if (campusName === '') {
      setCampusNameError('Please enter your campus name');
      valid = false;
    }

    if (!studentProof) {
      setStudentProofError('Please upload proof of student status');
      valid = false;
    }

    if (valid) {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('campusName', campusName);
      formData.append('studentProof', studentProof);

      try {
        const response = await axios.post('https://api.shinecampushub.web.id/register', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.status === 200) {
          const loginResponse = await axios.post('https://api.shinecampushub.web.id/login', { email, password });

          if (loginResponse.status === 200) {
            setLoggedIn(true);
            setEmail(loginResponse.data.user.email);
            setUserId(loginResponse.data.user.id_user);

            // Set registration status
            setRegister(true);

            // Save the token in localStorage
            localStorage.setItem('shinecampus_token', loginResponse.data.token);

            setSuccess('Registration and login successful! Redirecting...');
            setTimeout(() => navigate('/login'), 2000); // Redirect after 2 seconds
          }
        }
      } catch (error) {
        if (error.response && error.response.data) {
          setError(error.response.data.error);
        } else {
          setTimeout(() => navigate('/login'), 2000);
        }
      }
    }
  };

  return (
    <div className='mainContainer'>
      <div className='titleContainer'>
        <b>Register</b>
      </div>
      <div className='inputContainer'>
        <input
          type='text'
          value={username}
          placeholder='Username'
          onChange={(ev) => setUsername(ev.target.value)}
          className='inputBox'
        />
        <label className='errorLabel'>{usernameError}</label>
      </div>
      <div className='inputContainer'>
        <input
          type='password'
          value={password}
          placeholder='Password'
          onChange={(ev) => setPassword(ev.target.value)}
          className='inputBox'
        />
        <label className='errorLabel'>{passwordError}</label>
      </div>
      <div className='inputContainer'>
        <input
          type='password'
          value={confirmPassword}
          placeholder='Confirm Password'
          onChange={(ev) => setConfirmPassword(ev.target.value)}
          className='inputBox'
        />
        <label className='errorLabel'>{confirmPasswordError}</label>
      </div>
      <div className='inputContainer'>
        <input
          type='email'
          value={email}
          placeholder='Email'
          onChange={(ev) => setEmailState(ev.target.value)}
          className='inputBox'
        />
        <label className='errorLabel'>{emailError}</label>
      </div>
      <div className='inputContainer'>
        <input
          type='text'
          value={campusName}
          placeholder='Nama Kampus'
          onChange={(ev) => setCampusName(ev.target.value)}
          className='inputBox'
        />
        <label className='errorLabel'>{campusNameError}</label>
      </div>
      <div className='inputContainer'>
        <input
          type='file'
          placeholder='Upload Bukti Mahasiswa Aktif'
          onChange={(ev) => setStudentProof(ev.target.files[0])}
          className='inputBox'
        />
        <label className='errorLabel'>{studentProofError}</label>
      </div>
      <div className='inputContainer'>
        <button className='inputButton' onClick={onButtonClick}>
          Konfirmasi
        </button>
      </div>
      <p>sudah punya akun? <b><a href="/login">Login</a></b></p>
      {error && <p className="errorLabel">{error}</p>}
      {success && <p className="successLabel">{success}</p>}
    </div>
  );
};

export default SectionRegister;



